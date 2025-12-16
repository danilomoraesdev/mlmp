import { FastifyRequest, FastifyReply } from "fastify"
import { usersService } from "./users.service.js"
import { handleError } from "../../lib/errors.js"
import type {
  CreateUserInput,
  UpdateUserInput,
  UserParams,
} from "./users.schema.js"

export const usersController = {
  async getAll(request: FastifyRequest, reply: FastifyReply) {
    try {
      const users = await usersService.findAll()
      return reply.send(users)
    } catch (error) {
      return handleError(error, reply)
    }
  },

  async getById(
    request: FastifyRequest<{ Params: UserParams }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params
      const user = await usersService.findById(id)
      return reply.send(user)
    } catch (error) {
      return handleError(error, reply)
    }
  },

  async create(
    request: FastifyRequest<{ Body: CreateUserInput }>,
    reply: FastifyReply
  ) {
    try {
      const user = await usersService.create(request.body)
      return reply.status(201).send(user)
    } catch (error) {
      return handleError(error, reply)
    }
  },

  async update(
    request: FastifyRequest<{ Params: UserParams; Body: UpdateUserInput }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params
      const user = await usersService.update(id, request.body)
      return reply.send(user)
    } catch (error) {
      return handleError(error, reply)
    }
  },

  async delete(
    request: FastifyRequest<{ Params: UserParams }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params
      await usersService.delete(id)
      return reply.status(204).send()
    } catch (error) {
      return handleError(error, reply)
    }
  },
}
