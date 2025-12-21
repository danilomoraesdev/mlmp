import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core"

// Exemplo de tabela - customize conforme necessário
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// Exporte os tipos inferidos
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
