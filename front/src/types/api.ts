// Tipos compartilhados entre frontend e backend

export interface User {
  id: number
  name: string
  email: string
  role: "admin" | "user" | "guest"
  isActive: boolean
  emailVerifiedAt: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  createdBy: number | null
  updatedBy: number | null
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface ChangePasswordInput {
  currentPassword: string
  newPassword: string
}

// API Response types
export interface ApiError {
  error: string
  message: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}
