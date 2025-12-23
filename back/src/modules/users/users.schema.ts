import { z } from "zod";

// Role enum
const roleEnum = z.enum(["admin", "user", "guest"]).default("user");

// Schemas de validação com Zod
export const createUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(255),
  email: z.string().email("Email inválido").max(255),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
  role: roleEnum.optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  email: z.string().email().max(255).optional(),
  role: roleEnum.optional(),
  isActive: z.boolean().optional(),
});

export const userParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Tipos inferidos dos schemas
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserParams = z.infer<typeof userParamsSchema>;
