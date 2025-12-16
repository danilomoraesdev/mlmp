import "dotenv/config"
import Fastify from "fastify"
import cors from "@fastify/cors"
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod"
import { registerRoutes } from "./routes/index.js"

const fastify = Fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>()

// Configurar validação e serialização com Zod
fastify.setValidatorCompiler(validatorCompiler)
fastify.setSerializerCompiler(serializerCompiler)

// Registrar CORS
fastify.register(cors, {
  origin: true,
})

// Registrar rotas
fastify.register(registerRoutes)

// Start server
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000
    await fastify.listen({ port, host: "0.0.0.0" })
    console.log(`🚀 Server running on http://localhost:${port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
