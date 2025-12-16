import { FastifyInstance } from "fastify"
import { usersController } from "./users.controller.js"
import {
  createUserSchema,
  updateUserSchema,
  userParamsSchema,
} from "./users.schema.js"
import { ZodTypeProvider } from "fastify-type-provider-zod"

export async function usersRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>()

  // GET /users - Listar todos os usuários
  app.get("/", usersController.getAll)

  // GET /users/:id - Buscar usuário por ID
  app.get(
    "/:id",
    {
      schema: {
        params: userParamsSchema,
      },
    },
    usersController.getById
  )

  // POST /users - Criar usuário
  app.post(
    "/",
    {
      schema: {
        body: createUserSchema,
      },
    },
    usersController.create
  )

  // PUT /users/:id - Atualizar usuário
  app.put(
    "/:id",
    {
      schema: {
        params: userParamsSchema,
        body: updateUserSchema,
      },
    },
    usersController.update
  )

  // DELETE /users/:id - Deletar usuário
  app.delete(
    "/:id",
    {
      schema: {
        params: userParamsSchema,
      },
    },
    usersController.delete
  )
}
