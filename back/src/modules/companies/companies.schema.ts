import { z } from "zod";

export const createCompanySchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres").max(255),
  slug: z
    .string()
    .min(2, "Slug deve ter no mínimo 2 caracteres")
    .max(100)
    .regex(
      /^[a-z0-9-]+$/,
      "Slug deve conter apenas letras minúsculas, números e hífens"
    ),
  document: z.string().max(20).optional(),
  email: z.string().email("E-mail inválido").optional(),
  phone: z.string().max(20).optional(),
});

export const updateCompanySchema = z.object({
  name: z.string().min(2).max(255).optional(),
  document: z.string().max(20).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional(),
  settings: z.string().optional(),
});

export const companyParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;
export type CompanyParams = z.infer<typeof companyParamsSchema>;
