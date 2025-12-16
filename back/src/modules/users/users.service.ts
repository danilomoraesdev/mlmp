import { eq } from "drizzle-orm"
import { db } from "../../db/index.js"
import { users, type User, type NewUser } from "../../db/schema.js"
import { NotFoundError } from "../../lib/errors.js"

export const usersService = {
  async findAll(): Promise<User[]> {
    return db.select().from(users)
  },

  async findById(id: number): Promise<User> {
    const [user] = await db.select().from(users).where(eq(users.id, id))

    if (!user) {
      throw new NotFoundError("Usuário")
    }

    return user
  },

  async findByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email))
    return user || null
  },

  async create(data: NewUser): Promise<User> {
    const [user] = await db.insert(users).values(data).returning()
    return user
  },

  async update(id: number, data: Partial<NewUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning()

    if (!user) {
      throw new NotFoundError("Usuário")
    }

    return user
  },

  async delete(id: number): Promise<void> {
    const [deleted] = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id })

    if (!deleted) {
      throw new NotFoundError("Usuário")
    }
  },
}
