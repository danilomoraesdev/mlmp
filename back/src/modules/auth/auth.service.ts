import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq, and, isNull } from "drizzle-orm";
import { db } from "../../db/index.js";
import { users, type SafeUser, type NewUser } from "../../db/schema.js";
import {
  UnauthorizedError,
  ValidationError,
  NotFoundError,
} from "../../lib/errors.js";
import type { RegisterInput, LoginInput } from "./auth.schema.js";

const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET ||
  "your-super-secret-refresh-key-change-in-production";
const ACCESS_TOKEN_EXPIRES = "15m";
const REFRESH_TOKEN_EXPIRES = "7d";

interface TokenPayload {
  userId: number;
  email: string;
  role: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

function generateTokens(user: {
  id: number;
  email: string;
  role: string;
}): AuthTokens {
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES,
  });

  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES,
  });

  return { accessToken, refreshToken };
}

function sanitizeUser(user: typeof users.$inferSelect): SafeUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, refreshToken, ...safeUser } = user;
  return safeUser;
}

export const authService = {
  async register(
    data: RegisterInput
  ): Promise<{ user: SafeUser; tokens: AuthTokens }> {
    // Verificar se email já existe
    const [existingUser] = await db
      .select()
      .from(users)
      .where(and(eq(users.email, data.email), isNull(users.deletedAt)));

    if (existingUser) {
      throw new ValidationError("E-mail já está em uso");
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Criar usuário
    const newUser: NewUser = {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    };

    const [user] = await db.insert(users).values(newUser).returning();

    // Gerar tokens
    const tokens = generateTokens(user);

    // Salvar refresh token
    await db
      .update(users)
      .set({ refreshToken: tokens.refreshToken })
      .where(eq(users.id, user.id));

    return {
      user: sanitizeUser(user),
      tokens,
    };
  },

  async login(
    data: LoginInput
  ): Promise<{ user: SafeUser; tokens: AuthTokens }> {
    // Buscar usuário
    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.email, data.email), isNull(users.deletedAt)));

    if (!user) {
      throw new UnauthorizedError("Credenciais inválidas");
    }

    if (!user.isActive) {
      throw new UnauthorizedError("Conta desativada");
    }

    // Verificar senha
    const isValidPassword = await bcrypt.compare(data.password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedError("Credenciais inválidas");
    }

    // Gerar tokens
    const tokens = generateTokens(user);

    // Salvar refresh token
    await db
      .update(users)
      .set({ refreshToken: tokens.refreshToken, updatedAt: new Date() })
      .where(eq(users.id, user.id));

    return {
      user: sanitizeUser(user),
      tokens,
    };
  },

  async refreshToken(token: string): Promise<AuthTokens> {
    try {
      const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;

      // Buscar usuário e verificar refresh token
      const [user] = await db
        .select()
        .from(users)
        .where(and(eq(users.id, decoded.userId), isNull(users.deletedAt)));

      if (!user || user.refreshToken !== token) {
        throw new UnauthorizedError("Token inválido");
      }

      if (!user.isActive) {
        throw new UnauthorizedError("Conta desativada");
      }

      // Gerar novos tokens
      const tokens = generateTokens(user);

      // Salvar novo refresh token
      await db
        .update(users)
        .set({ refreshToken: tokens.refreshToken, updatedAt: new Date() })
        .where(eq(users.id, user.id));

      return tokens;
    } catch (error) {
      if (error instanceof UnauthorizedError) throw error;
      throw new UnauthorizedError("Token inválido ou expirado");
    }
  },

  async logout(userId: number): Promise<void> {
    await db
      .update(users)
      .set({ refreshToken: null, updatedAt: new Date() })
      .where(eq(users.id, userId));
  },

  async getProfile(userId: number): Promise<SafeUser> {
    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, userId), isNull(users.deletedAt)));

    if (!user) {
      throw new NotFoundError("Usuário");
    }

    return sanitizeUser(user);
  },

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const [user] = await db.select().from(users).where(eq(users.id, userId));

    if (!user) {
      throw new NotFoundError("Usuário");
    }

    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isValidPassword) {
      throw new UnauthorizedError("Senha atual incorreta");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await db
      .update(users)
      .set({ password: hashedPassword, updatedAt: new Date() })
      .where(eq(users.id, userId));
  },

  verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch {
      throw new UnauthorizedError("Token inválido ou expirado");
    }
  },

  async forgotPassword(email: string): Promise<void> {
    // Buscar usuário pelo email
    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), isNull(users.deletedAt)));

    // Não revelar se o email existe ou não (segurança)
    if (!user) {
      return;
    }

    // Gerar token aleatório
    const { randomBytes, createHash } = await import("crypto");
    const resetToken = randomBytes(32).toString("hex");

    // Hash do token para armazenar no banco (não armazenar token puro)
    const hashedToken = createHash("sha256").update(resetToken).digest("hex");

    // Token expira em 1 hora
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    // Salvar token hasheado no banco
    await db
      .update(users)
      .set({
        passwordResetToken: hashedToken,
        passwordResetExpires: expiresAt,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    // Construir URL de reset
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/redefinir-senha?token=${resetToken}`;

    // Enviar email
    const { emailService } = await import("../../services/email.service.js");
    await emailService.sendPasswordReset(user.email, resetUrl);
  },

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const { createHash } = await import("crypto");

    // Hash do token recebido para comparar com o armazenado
    const hashedToken = createHash("sha256").update(token).digest("hex");

    // Buscar usuário com token válido e não expirado
    const [user] = await db
      .select()
      .from(users)
      .where(
        and(eq(users.passwordResetToken, hashedToken), isNull(users.deletedAt))
      );

    if (!user) {
      throw new ValidationError("Token inválido ou expirado");
    }

    // Verificar se token expirou
    if (!user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      throw new ValidationError(
        "Token expirado. Solicite um novo link de redefinição."
      );
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Atualizar senha e limpar token
    await db
      .update(users)
      .set({
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        refreshToken: null, // Invalidar refresh tokens existentes
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));
  },
};
