import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import fastifyMultipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import { z } from "zod";
import { randomUUID } from "crypto";
import { createWriteStream, existsSync, mkdirSync, unlinkSync } from "fs";
import { pipeline } from "stream/promises";
import path from "path";
import { fileURLToPath } from "url";
import { authenticate } from "../../middleware/auth.middleware.js";
import { handleError, ValidationError } from "../../lib/errors.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, "../../../uploads");

// Garantir que o diretório existe
if (!existsSync(UPLOADS_DIR)) {
  mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Tipos de arquivo permitidos
const ALLOWED_MIMETYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Schema para params
const filenameParamsSchema = z.object({
  filename: z.string().min(1),
});

export async function uploadsRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  // Registrar multipart
  await fastify.register(fastifyMultipart, {
    limits: {
      fileSize: MAX_FILE_SIZE,
    },
  });

  // Servir arquivos estáticos
  await fastify.register(fastifyStatic, {
    root: UPLOADS_DIR,
    prefix: "/uploads/",
    decorateReply: false,
  });

  // POST /upload - Upload de arquivo
  app.post(
    "/",
    {
      preHandler: [authenticate],
      schema: {
        tags: ["Uploads"],
        summary: "Fazer upload de arquivo",
        security: [{ bearerAuth: [] }],
        consumes: ["multipart/form-data"],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const data = await request.file();

        if (!data) {
          throw new ValidationError("Nenhum arquivo enviado");
        }

        // Validar tipo
        if (!ALLOWED_MIMETYPES.includes(data.mimetype)) {
          throw new ValidationError(
            `Tipo de arquivo não permitido. Tipos aceitos: ${ALLOWED_MIMETYPES.join(
              ", "
            )}`
          );
        }

        // Gerar nome único
        const ext = path.extname(data.filename);
        const filename = `${randomUUID()}${ext}`;
        const filepath = path.join(UPLOADS_DIR, filename);

        // Salvar arquivo
        await pipeline(data.file, createWriteStream(filepath));

        // Montar URL
        const baseUrl = `${request.protocol}://${request.hostname}`;
        const fileUrl = `${baseUrl}/uploads/${filename}`;

        return reply.status(201).send({
          filename,
          originalName: data.filename,
          mimetype: data.mimetype,
          url: fileUrl,
        });
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // DELETE /upload/:filename - Deletar arquivo
  app.delete(
    "/:filename",
    {
      preHandler: [authenticate],
      schema: {
        tags: ["Uploads"],
        summary: "Deletar arquivo",
        security: [{ bearerAuth: [] }],
        params: filenameParamsSchema,
      },
    },
    async (request, reply) => {
      try {
        const { filename } = request.params;
        const filepath = path.join(UPLOADS_DIR, filename);

        // Verificar se arquivo existe
        if (!existsSync(filepath)) {
          throw new ValidationError("Arquivo não encontrado");
        }

        // Deletar
        unlinkSync(filepath);

        return reply.status(204).send();
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );
}
