import { FastifyReply } from "fastify"

export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 400) {
    super(message)
    this.name = "AppError"
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} não encontrado`, 404)
    this.name = "NotFoundError"
  }
}

export class ValidationError extends AppError {
  constructor(message: string = "Dados inválidos") {
    super(message, 400)
    this.name = "ValidationError"
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Não autorizado") {
    super(message, 401)
    this.name = "UnauthorizedError"
  }
}

export function handleError(error: unknown, reply: FastifyReply) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: error.name,
      message: error.message,
    })
  }

  console.error("Unexpected error:", error)
  return reply.status(500).send({
    error: "InternalServerError",
    message: "Erro interno do servidor",
  })
}
