import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { authService } from "./auth.service.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { handleError } from "../../lib/errors.js";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.schema.js";

export async function authRoutes(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  // Rotas públicas
  app.post(
    "/register",
    {
      schema: {
        body: registerSchema,
        tags: ["Auth"],
        summary: "Registrar novo usuário",
      },
    },
    async (request, reply) => {
      try {
        const result = await authService.register(request.body);
        return reply.status(201).send(result);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  app.post(
    "/login",
    {
      schema: {
        body: loginSchema,
        tags: ["Auth"],
        summary: "Fazer login",
      },
    },
    async (request, reply) => {
      try {
        const result = await authService.login(request.body);
        return reply.send(result);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  app.post(
    "/refresh",
    {
      schema: {
        body: refreshTokenSchema,
        tags: ["Auth"],
        summary: "Renovar tokens",
      },
    },
    async (request, reply) => {
      try {
        const tokens = await authService.refreshToken(
          request.body.refreshToken
        );
        return reply.send(tokens);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  app.post(
    "/forgot-password",
    {
      schema: {
        body: forgotPasswordSchema,
        tags: ["Auth"],
        summary: "Solicitar redefinição de senha",
      },
    },
    async (request, reply) => {
      try {
        await authService.forgotPassword(request.body.email);
        return reply.send({
          message: "Se o e-mail existir, você receberá um link de redefinição.",
        });
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  app.post(
    "/reset-password",
    {
      schema: {
        body: resetPasswordSchema,
        tags: ["Auth"],
        summary: "Redefinir senha com token",
      },
    },
    async (request, reply) => {
      try {
        await authService.resetPassword(
          request.body.token,
          request.body.password
        );
        return reply.send({ message: "Senha redefinida com sucesso." });
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  // Rotas protegidas
  app.post(
    "/logout",
    {
      preHandler: [authenticate],
      schema: {
        tags: ["Auth"],
        summary: "Fazer logout",
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.user!.userId;
        await authService.logout(userId);
        return reply.status(204).send();
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  app.get(
    "/me",
    {
      preHandler: [authenticate],
      schema: {
        tags: ["Auth"],
        summary: "Obter perfil do usuário autenticado",
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const userId = request.user!.userId;
        const user = await authService.getProfile(userId);
        return reply.send(user);
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );

  app.put(
    "/change-password",
    {
      preHandler: [authenticate],
      schema: {
        body: changePasswordSchema,
        tags: ["Auth"],
        summary: "Alterar senha",
      },
    },
    async (request, reply) => {
      try {
        const userId = (request as FastifyRequest).user!.userId;
        const { currentPassword, newPassword } = request.body;
        await authService.changePassword(userId, currentPassword, newPassword);
        return reply.status(204).send();
      } catch (error) {
        return handleError(error, reply);
      }
    }
  );
}
