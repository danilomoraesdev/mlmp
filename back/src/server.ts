import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import {
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import { registerRoutes } from "./routes/index.js";

const fastify = Fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();

// Configurar validação e serialização com Zod
fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

// Swagger - Documentação da API
fastify.register(fastifySwagger, {
  openapi: {
    openapi: "3.0.0",
    info: {
      title: "MLMP API",
      description: "API do boilerplate fullstack MLMP",
      version: "1.0.0",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    tags: [
      { name: "Auth", description: "Autenticação e autorização" },
      { name: "Users", description: "Gerenciamento de usuários" },
      {
        name: "Companies",
        description: "Gerenciamento de empresas (multi-tenant)",
      },
      { name: "Uploads", description: "Upload e gerenciamento de arquivos" },
    ],
  },
  transform: jsonSchemaTransform,
});

fastify.register(fastifySwaggerUi, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "list",
    deepLinking: true,
  },
  staticCSP: true,
});

// Registrar CORS
fastify.register(cors, {
  origin: true,
});

// Registrar rotas
fastify.register(registerRoutes);

// Start server
const start = async () => {
  try {
    const port = Number(process.env.PORT) || 3000;
    await fastify.listen({ port, host: "0.0.0.0" });
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📚 Swagger docs available at http://localhost:${port}/docs`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
