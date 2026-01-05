import api, { setStoredTokens, clearStoredTokens } from './api'
import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
  ChangePasswordInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  User,
} from '@/types'

export const authService = {
  async login(data: LoginInput): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data, {
      _skipAuthRefresh: true,
    } as object)
    setStoredTokens(response.data.tokens)
    return response.data
  },

  async register(data: RegisterInput): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data, {
      _skipAuthRefresh: true,
    } as object)
    setStoredTokens(response.data.tokens)
    return response.data
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } finally {
      clearStoredTokens()
    }
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>('/auth/me')
    return response.data
  },

  async changePassword(data: ChangePasswordInput): Promise<void> {
    await api.put('/auth/change-password', data)
  },

  async forgotPassword(data: ForgotPasswordInput): Promise<void> {
    await api.post('/auth/forgot-password', data, {
      _skipAuthRefresh: true,
    } as object)
  },

  async resetPassword(data: ResetPasswordInput): Promise<void> {
    await api.post('/auth/reset-password', data, {
      _skipAuthRefresh: true,
    } as object)
  },
}

export default authService
