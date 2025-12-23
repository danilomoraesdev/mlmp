import { eq, isNull, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "../../db/index.js";
import { users, type SafeUser, type NewUser } from "../../db/schema.js";
import { NotFoundError, ValidationError } from "../../lib/errors.js";
import type { CreateUserInput, UpdateUserInput } from "./users.schema.js";

// Helper para remover campos sensíveis
function sanitizeUser(user: typeof users.$inferSelect): SafeUser {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, refreshToken, ...safeUser } = user;
  return safeUser;
}

export const usersService = {
  async findAll(): Promise<SafeUser[]> {
    const result = await db.select().from(users).where(isNull(users.deletedAt));

    return result.map(sanitizeUser);
  },

  async findById(id: number): Promise<SafeUser> {
    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.id, id), isNull(users.deletedAt)));

    if (!user) {
      throw new NotFoundError("Usuário");
    }

    return sanitizeUser(user);
  },

  async findByEmail(email: string): Promise<SafeUser | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(and(eq(users.email, email), isNull(users.deletedAt)));

    return user ? sanitizeUser(user) : null;
  },

  async create(data: CreateUserInput): Promise<SafeUser> {
    // Verificar se email já existe
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      throw new ValidationError("E-mail já está em uso");
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(data.password, 12);

    const newUser: NewUser = {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role || "user",
    };

    const [user] = await db.insert(users).values(newUser).returning();
    return sanitizeUser(user);
  },

  async update(id: number, data: UpdateUserInput): Promise<SafeUser> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(users.id, id), isNull(users.deletedAt)))
      .returning();

    if (!user) {
      throw new NotFoundError("Usuário");
    }

    return sanitizeUser(user);
  },

  // Soft delete
  async delete(id: number): Promise<void> {
    const [deleted] = await db
      .update(users)
      .set({ deletedAt: new Date() })
      .where(and(eq(users.id, id), isNull(users.deletedAt)))
      .returning({ id: users.id });

    if (!deleted) {
      throw new NotFoundError("Usuário");
    }
  },
};
