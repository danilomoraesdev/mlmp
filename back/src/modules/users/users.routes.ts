import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { usersService } from "./users.service.js";
import { handleError } from "../../lib/errors.js";
import { authenticate, requireRole } from "../../middleware/auth.middleware.js";
import {
  createUserSchema,
  updateUserSchema,
  userParamsSchema,
} from "./users.schema.js";

export async function usersRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  // GET /users - Listar todos os usuários
  app.get(
    "/",
    {
      preHandler: [authenticate],
      schema: {
        tags: ["Users"],
        summary: "Listar todos os usuários",
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      try {
        const users = await usersService.findAll();
        return reply.send(users);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // GET /users/:id - Buscar usuário por ID
  app.get(
    "/:id",
    {
      preHandler: [authenticate],
      schema: {
        tags: ["Users"],
        summary: "Buscar usuário por ID",
        security: [{ bearerAuth: [] }],
        params: userParamsSchema,
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params;
        const user = await usersService.findById(id);
        return reply.send(user);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // POST /users - Criar usuário (admin only)
  app.post(
    "/",
    {
      preHandler: [authenticate, requireRole("admin")],
      schema: {
        tags: ["Users"],
        summary: "Criar novo usuário",
        description: "Apenas administradores podem criar usuários diretamente",
        security: [{ bearerAuth: [] }],
        body: createUserSchema,
      },
    },
    async (request, reply) => {
      try {
        const user = await usersService.create(request.body);
        return reply.status(201).send(user);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // PUT /users/:id - Atualizar usuário
  app.put(
    "/:id",
    {
      preHandler: [authenticate],
      schema: {
        tags: ["Users"],
        summary: "Atualizar usuário",
        security: [{ bearerAuth: [] }],
        params: userParamsSchema,
        body: updateUserSchema,
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params;
        const user = await usersService.update(id, request.body);
        return reply.send(user);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // DELETE /users/:id - Deletar usuário (soft delete)
  app.delete(
    "/:id",
    {
      preHandler: [authenticate, requireRole("admin")],
      schema: {
        tags: ["Users"],
        summary: "Deletar usuário (soft delete)",
        description: "Apenas administradores podem deletar usuários",
        security: [{ bearerAuth: [] }],
        params: userParamsSchema,
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params;
        await usersService.delete(id);
        return reply.status(204).send();
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );
}
