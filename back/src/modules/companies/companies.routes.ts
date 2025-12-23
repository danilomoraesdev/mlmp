import { FastifyInstance, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { companiesService } from "./companies.service.js";
import { handleError } from "../../lib/errors.js";
import { authenticate, requireRole } from "../../middleware/auth.middleware.js";
import {
  createCompanySchema,
  updateCompanySchema,
  companyParamsSchema,
} from "./companies.schema.js";

export async function companiesRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  // GET /companies - Listar todas as empresas (admin global)
  app.get(
    "/",
    {
      preHandler: [authenticate, requireRole("owner", "admin")],
      schema: {
        tags: ["Companies"],
        summary: "Listar todas as empresas",
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      try {
        const companies = await companiesService.findAll();
        return reply.send(companies);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // GET /companies/:id - Buscar empresa por ID
  app.get(
    "/:id",
    {
      preHandler: [authenticate],
      schema: {
        tags: ["Companies"],
        summary: "Buscar empresa por ID",
        security: [{ bearerAuth: [] }],
        params: companyParamsSchema,
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params;
        const company = await companiesService.findById(id);
        return reply.send(company);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // POST /companies - Criar empresa
  app.post(
    "/",
    {
      preHandler: [authenticate, requireRole("owner", "admin")],
      schema: {
        tags: ["Companies"],
        summary: "Criar nova empresa",
        security: [{ bearerAuth: [] }],
        body: createCompanySchema,
      },
    },
    async (request, reply) => {
      try {
        const company = await companiesService.create(request.body);
        return reply.status(201).send(company);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // PUT /companies/:id - Atualizar empresa
  app.put(
    "/:id",
    {
      preHandler: [authenticate, requireRole("owner", "admin")],
      schema: {
        tags: ["Companies"],
        summary: "Atualizar empresa",
        security: [{ bearerAuth: [] }],
        params: companyParamsSchema,
        body: updateCompanySchema,
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params;
        const company = await companiesService.update(id, request.body);
        return reply.send(company);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // DELETE /companies/:id - Deletar empresa
  app.delete(
    "/:id",
    {
      preHandler: [authenticate, requireRole("owner")],
      schema: {
        tags: ["Companies"],
        summary: "Deletar empresa (soft delete)",
        security: [{ bearerAuth: [] }],
        params: companyParamsSchema,
      },
    },
    async (request: FastifyRequest<{ Params: { id: number } }>, reply) => {
      try {
        const { id } = request.params;
        await companiesService.delete(id);
        return reply.status(204).send();
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );
}
