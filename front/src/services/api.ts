import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios'
import type { AuthTokens } from '@/types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const AUTH_STORAGE_KEY = 'mlmp_auth_tokens'

// Criar instância do axios
export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Funções de gerenciamento de tokens
export function getStoredTokens(): AuthTokens | null {
  const tokens = localStorage.getItem(AUTH_STORAGE_KEY)
  if (tokens) {
    try {
      return JSON.parse(tokens)
    } catch {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }
  return null
}

export function setStoredTokens(tokens: AuthTokens): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(tokens))
}

export function clearStoredTokens(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

/**
 * =============================================================================
 * RENOVAÇÃO AUTOMÁTICA DE TOKEN JWT (Token Refresh)
 * =============================================================================
 *
 * Refere-se à renovação do ACCESS TOKEN JWT quando ele expira.
 *
 * Como funciona:
 * 1. Access Token: tem vida curta (ex: 15 min) por segurança
 * 2. Refresh Token: tem vida longa (ex: 7 dias) para renovar o access token
 * 3. Quando uma requisição falha com 401 (token expirado), este interceptor:
 *    - Usa o refresh token para obter um novo access token
 *    - Refaz a requisição original automaticamente
 *    - O usuário nem percebe que o token expirou!
 *
 * Benefícios:
 * - Segurança: tokens de acesso curtos limitam janela de ataque
 * - UX: usuário fica logado por mais tempo sem precisar fazer login novamente
 */

// Controla se já está renovando o token (evita múltiplas renovações simultâneas)
let isRefreshing = false

// Fila de requisições que falharam enquanto o token estava sendo renovado
// Quando a renovação terminar, todas são reprocessadas com o novo token
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

// Processa a fila após renovação do token (sucesso ou falha)
const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  })
  failedQueue = []
}

// Interceptor de request - adiciona o access token em todas as requisições
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const tokens = getStoredTokens()
    if (tokens?.accessToken) {
      config.headers.Authorization = `Bearer ${tokens.accessToken}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor de response - renovação automática do token JWT quando expira
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    // Se o erro não for 401, já tentamos retry, ou foi marcado para pular refresh, rejeita
    const skipRefresh = (originalRequest as { _skipAuthRefresh?: boolean })
      ._skipAuthRefresh
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      skipRefresh
    ) {
      return Promise.reject(error)
    }

    // Se já está fazendo refresh, adiciona à fila
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
        .catch((err) => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    const tokens = getStoredTokens()
    if (!tokens?.refreshToken) {
      clearStoredTokens()
      window.location.href = '/login'
      return Promise.reject(error)
    }

    try {
      const response = await axios.post<AuthTokens>(`${API_URL}/auth/refresh`, {
        refreshToken: tokens.refreshToken,
      })

      const newTokens = response.data
      setStoredTokens(newTokens)

      processQueue(null, newTokens.accessToken)

      originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`
      return api(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      clearStoredTokens()
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default api
