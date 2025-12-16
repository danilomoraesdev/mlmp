import { FastifyInstance } from "fastify"
import { usersRoutes } from "../modules/users/index.js"

export async function registerRoutes(fastify: FastifyInstance) {
  // Health check
  fastify.get("/health", async () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
  }))

  // Registrar módulos
  fastify.register(usersRoutes, { prefix: "/users" })
}
