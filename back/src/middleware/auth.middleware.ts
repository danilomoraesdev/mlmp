import { FastifyRequest, FastifyReply } from "fastify"
import { authService } from "../modules/auth/auth.service.js"
import { UnauthorizedError, handleError } from "../lib/errors.js"

declare module "fastify" {
  interface FastifyRequest {
    user?: {
      userId: number
      email: string
      role: string
    }
  }
}

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("Token não fornecido")
    }

    const token = authHeader.substring(7)
    const payload = authService.verifyAccessToken(token)

    request.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    }
  } catch (error) {
    return handleError(error, reply)
  }
}

// Middleware para verificar roles específicas
export function requireRole(...allowedRoles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      if (!request.user) {
        throw new UnauthorizedError("Não autenticado")
      }

      if (!allowedRoles.includes(request.user.role)) {
        throw new UnauthorizedError("Acesso não autorizado para este recurso")
      }
    } catch (error) {
      return handleError(error, reply)
    }
  }
}
