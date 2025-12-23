import { eq, isNull, and } from "drizzle-orm";
import { db } from "../../db/index.js";
import { companies, type Company, type NewCompany } from "../../db/schema.js";
import { NotFoundError, ValidationError } from "../../lib/errors.js";
import type {
  CreateCompanyInput,
  UpdateCompanyInput,
} from "./companies.schema.js";

export const companiesService = {
  async findAll(): Promise<Company[]> {
    return db.select().from(companies).where(isNull(companies.deletedAt));
  },

  async findById(id: number): Promise<Company> {
    const [company] = await db
      .select()
      .from(companies)
      .where(and(eq(companies.id, id), isNull(companies.deletedAt)));

    if (!company) {
      throw new NotFoundError("Empresa");
    }

    return company;
  },

  async findBySlug(slug: string): Promise<Company | null> {
    const [company] = await db
      .select()
      .from(companies)
      .where(and(eq(companies.slug, slug), isNull(companies.deletedAt)));

    return company || null;
  },

  async create(data: CreateCompanyInput): Promise<Company> {
    // Verificar se slug já existe
    const existingCompany = await this.findBySlug(data.slug);
    if (existingCompany) {
      throw new ValidationError("Slug já está em uso");
    }

    // Definir período de trial (7 dias)
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 7);

    const newCompany: NewCompany = {
      ...data,
      trialEndsAt,
    };

    const [company] = await db.insert(companies).values(newCompany).returning();
    return company;
  },

  async update(id: number, data: UpdateCompanyInput): Promise<Company> {
    const [company] = await db
      .update(companies)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(companies.id, id), isNull(companies.deletedAt)))
      .returning();

    if (!company) {
      throw new NotFoundError("Empresa");
    }

    return company;
  },

  async delete(id: number): Promise<void> {
    const [deleted] = await db
      .update(companies)
      .set({ deletedAt: new Date() })
      .where(and(eq(companies.id, id), isNull(companies.deletedAt)))
      .returning({ id: companies.id });

    if (!deleted) {
      throw new NotFoundError("Empresa");
    }
  },
};
