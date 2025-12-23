import { z } from "zod"

// Schema de registro
export const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.email("E-mail inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
})

// Schema de login
export const loginSchema = z.object({
  email: z.email("E-mail inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
})

// Schema de refresh token
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token é obrigatório"),
})

// Schema de alteração de senha
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual é obrigatória"),
  newPassword: z.string().min(8, "Nova senha deve ter no mínimo 8 caracteres"),
})

// Schema de reset de senha
export const forgotPasswordSchema = z.object({
  email: z.email("E-mail inválido"),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token é obrigatório"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
})

// Tipos inferidos
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
