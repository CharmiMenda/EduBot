import session from "express-session";
import MongoStore from "connect-mongo";
import {
  UserModel, CompanyModel, PlacementEventModel, MaterialModel, TestResultModel
} from "./models";
import {
  type User, type InsertUser,
  type Company, type InsertCompany,
  type PlacementEvent, type InsertPlacementEvent,
  type Material, type InsertMaterial,
  type TestResult, type InsertTestResult
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getCompanies(): Promise<Company[]>;
  createCompany(company: InsertCompany): Promise<Company>;

  getPlacementEvents(): Promise<(PlacementEvent & { company: Company })[]>;
  createPlacementEvent(event: InsertPlacementEvent): Promise<PlacementEvent>;

  getMaterials(role?: string): Promise<Material[]>;
  createMaterial(material: InsertMaterial): Promise<Material>;

  getTestResults(userId?: string): Promise<TestResult[]>;
  createTestResult(result: InsertTestResult): Promise<TestResult>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set");
    }
    this.sessionStore = MongoStore.create({
      mongoUrl: process.env.DATABASE_URL,
      collectionName: 'sessions'
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    const user = await UserModel.findById(id);
    return user ? user.toJSON() : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ email: username });
    return user ? user.toJSON() : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user = await UserModel.create(insertUser);
    return user.toJSON();
  }

  async getCompanies(): Promise<Company[]> {
    const companies = await CompanyModel.find();
    return companies.map(c => c.toJSON());
  }

  async createCompany(insertCompany: InsertCompany): Promise<Company> {
    const company = await CompanyModel.create(insertCompany);
    return company.toJSON();
  }

  async getPlacementEvents(): Promise<(PlacementEvent & { company: Company })[]> {
    const events = await PlacementEventModel.find();
    const companies = await CompanyModel.find({ _id: { $in: events.map(e => e.companyId) } });

    return events.map(event => {
      const company = companies.find(c => String(c._id) === event.companyId);
      return {
        ...event.toJSON(),
        company: company ? company.toJSON() : null as any
      };
    });
  }

  async createPlacementEvent(insertEvent: InsertPlacementEvent): Promise<PlacementEvent> {
    const event = await PlacementEventModel.create(insertEvent);
    return event.toJSON();
  }

  async getMaterials(role?: string): Promise<Material[]> {
    if (role) {
      const materials = await MaterialModel.find({ role });
      return materials.map(m => m.toJSON());
    }
    const materials = await MaterialModel.find();
    return materials.map(m => m.toJSON());
  }

  async createMaterial(insertMaterial: InsertMaterial): Promise<Material> {
    const material = await MaterialModel.create(insertMaterial);
    return material.toJSON();
  }

  async getTestResults(userId?: string): Promise<TestResult[]> {
    if (userId) {
      const results = await TestResultModel.find({ userId });
      return results.map(r => r.toJSON());
    }
    const results = await TestResultModel.find();
    return results.map(r => r.toJSON());
  }

  async createTestResult(insertResult: InsertTestResult): Promise<TestResult> {
    const result = await TestResultModel.create(insertResult);
    return result.toJSON();
  }
}

export const storage = new DatabaseStorage();
