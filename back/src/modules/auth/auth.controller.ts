import { FastifyRequest, FastifyReply } from "fastify"
import { authService } from "./auth.service.js"
import { handleError } from "../../lib/errors.js"
import type {
  RegisterInput,
  LoginInput,
  RefreshTokenInput,
  ChangePasswordInput,
} from "./auth.schema.js"

export const authController = {
  async register(
    request: FastifyRequest<{ Body: RegisterInput }>,
    reply: FastifyReply
  ) {
    try {
      const result = await authService.register(request.body)
      return reply.status(201).send(result)
    } catch (error) {
      return handleError(error, reply)
    }
  },

  async login(
    request: FastifyRequest<{ Body: LoginInput }>,
    reply: FastifyReply
  ) {
    try {
      const result = await authService.login(request.body)
      return reply.send(result)
    } catch (error) {
      return handleError(error, reply)
    }
  },

  async refreshToken(
    request: FastifyRequest<{ Body: RefreshTokenInput }>,
    reply: FastifyReply
  ) {
    try {
      const tokens = await authService.refreshToken(request.body.refreshToken)
      return reply.send(tokens)
    } catch (error) {
      return handleError(error, reply)
    }
  },

  async logout(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request as FastifyRequest & { user: { userId: number } })
        .user.userId
      await authService.logout(userId)
      return reply.status(204).send()
    } catch (error) {
      return handleError(error, reply)
    }
  },

  async getProfile(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request as FastifyRequest & { user: { userId: number } })
        .user.userId
      const user = await authService.getProfile(userId)
      return reply.send(user)
    } catch (error) {
      return handleError(error, reply)
    }
  },

  async changePassword(
    request: FastifyRequest<{ Body: ChangePasswordInput }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (request as FastifyRequest & { user: { userId: number } })
        .user.userId
      const { currentPassword, newPassword } = request.body
      await authService.changePassword(userId, currentPassword, newPassword)
      return reply.status(204).send()
    } catch (error) {
      return handleError(error, reply)
    }
  },
}
