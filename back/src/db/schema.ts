import {
  pgTable,
  serial,
  timestamp,
  varchar,
  text,
  boolean,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum("user_role", [
  "owner",
  "admin",
  "user",
  "guest",
]);
export const companyStatusEnum = pgEnum("company_status", [
  "active",
  "trial",
  "suspended",
  "cancelled",
]);

// ============================================
// COMPANIES (Multi-tenant)
// ============================================
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(), // URL-friendly identifier
  document: varchar("document", { length: 20 }), // CNPJ/CPF
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  status: companyStatusEnum("status").default("trial").notNull(),
  // Configurações
  settings: text("settings"), // JSON string para configurações customizadas
  // Assinatura
  trialEndsAt: timestamp("trial_ends_at"),
  subscriptionEndsAt: timestamp("subscription_ends_at"),
  // Auditoria
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

// ============================================
// USERS
// ============================================
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").references(() => companies.id),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: userRoleEnum("role").default("user").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  emailVerifiedAt: timestamp("email_verified_at"),
  refreshToken: text("refresh_token"),
  // Avatar
  avatarUrl: varchar("avatar_url", { length: 500 }),
  // Auditoria
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
  createdBy: integer("created_by"),
  updatedBy: integer("updated_by"),
});

// ============================================
// RELATIONS
// ============================================
export const companiesRelations = relations(companies, ({ many }) => ({
  users: many(users),
}));

export const usersRelations = relations(users, ({ one }) => ({
  company: one(companies, {
    fields: [users.companyId],
    references: [companies.id],
  }),
}));

// ============================================
// TYPES
// ============================================

// Companies
export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
export type CompanyStatus = "active" | "trial" | "suspended" | "cancelled";

// Users
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserRole = "owner" | "admin" | "user" | "guest";

// Tipo sem campos sensíveis para retorno em APIs
export type SafeUser = Omit<User, "password" | "refreshToken">;
