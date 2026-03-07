import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import {
  users, companies, placementEvents, materials, testResults,
  type User, type InsertUser,
  type Company, type InsertCompany,
  type PlacementEvent, type InsertPlacementEvent,
  type Material, type InsertMaterial,
  type TestResult, type InsertTestResult
} from "@shared/schema";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getCompanies(): Promise<Company[]>;
  createCompany(company: InsertCompany): Promise<Company>;

  getPlacementEvents(): Promise<(PlacementEvent & { company: Company })[]>;
  createPlacementEvent(event: InsertPlacementEvent): Promise<PlacementEvent>;

  getMaterials(role?: string): Promise<Material[]>;
  createMaterial(material: InsertMaterial): Promise<Material>;

  getTestResults(userId?: number): Promise<TestResult[]>;
  createTestResult(result: InsertTestResult): Promise<TestResult>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getCompanies(): Promise<Company[]> {
    return await db.select().from(companies);
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const [company] = await db.insert(companies).values(insertCompany).returning();
    return company;
  }

  async getPlacementEvents(): Promise<(PlacementEvent & { company: Company })[]> {
    const events = await db
      .select({
        event: placementEvents,
        company: companies,
      })
      .from(placementEvents)
      .innerJoin(companies, eq(placementEvents.companyId, companies.id));
      
    return events.map(({ event, company }) => ({ ...event, company }));
  }

  async createPlacementEvent(insertEvent: InsertPlacementEvent): Promise<PlacementEvent> {
    const [event] = await db.insert(placementEvents).values(insertEvent).returning();
    return event;
  }

  async getMaterials(role?: string): Promise<Material[]> {
    if (role) {
      return await db.select().from(materials).where(eq(materials.role, role));
    }
    return await db.select().from(materials);
  }

  async createMaterial(insertMaterial: InsertMaterial): Promise<Material> {
    const [material] = await db.insert(materials).values(insertMaterial).returning();
    return material;
  }

  async getTestResults(userId?: number): Promise<TestResult[]> {
    if (userId) {
      return await db.select().from(testResults).where(eq(testResults.userId, userId));
    }
    return await db.select().from(testResults);
  }

  async createTestResult(insertResult: InsertTestResult): Promise<TestResult> {
    const [result] = await db.insert(testResults).values(insertResult).returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
