import api, { setStoredTokens, clearStoredTokens } from "./api"
import type {
  AuthResponse,
  LoginInput,
  RegisterInput,
  ChangePasswordInput,
  User,
} from "@/types"

export const authService = {
  async login(data: LoginInput): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", data)
    setStoredTokens(response.data.tokens)
    return response.data
  },

  async register(data: RegisterInput): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", data)
    setStoredTokens(response.data.tokens)
    return response.data
  },

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout")
    } finally {
      clearStoredTokens()
    }
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>("/auth/me")
    return response.data
  },

  async changePassword(data: ChangePasswordInput): Promise<void> {
    await api.put("/auth/change-password", data)
  },
}

export default authService
