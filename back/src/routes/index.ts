import { FastifyInstance } from "fastify";
import { usersRoutes } from "../modules/users/index.js";
import { authRoutes } from "../modules/auth/index.js";
import { companiesRoutes } from "../modules/companies/index.js";
import { uploadsRoutes } from "../modules/uploads/index.js";

export async function registerRoutes(fastify: FastifyInstance) {
  // Health check
  fastify.get("/health", async () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
  }));

  // Registrar módulos
  fastify.register(authRoutes, { prefix: "/auth" });
  fastify.register(usersRoutes, { prefix: "/users" });
  fastify.register(companiesRoutes, { prefix: "/companies" });
  fastify.register(uploadsRoutes, { prefix: "/upload" });
}
