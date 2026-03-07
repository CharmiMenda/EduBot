import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("student"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  roles: text("roles").array().notNull(),
  eligibility: text("eligibility").notNull(),
  packageInfo: text("package_info").notNull(),
  selectionProcess: text("selection_process").notNull(),
});

export const placementEvents = pgTable("placement_events", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").references(() => companies.id).notNull(),
  date: timestamp("date").notNull(),
  deadline: timestamp("deadline").notNull(),
  role: text("role").notNull(),
});

export const materials = pgTable("materials", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  role: text("role").notNull(),
  link: text("link").notNull(),
  tags: text("tags").array().notNull(),
});

export const testResults = pgTable("test_results", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  testType: text("test_type").notNull(),
  score: integer("score").notNull(),
  accuracy: integer("accuracy").notNull(),
  timeTaken: integer("time_taken").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const insertCompanySchema = createInsertSchema(companies).omit({ id: true });
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;

export const insertPlacementEventSchema = createInsertSchema(placementEvents).omit({ id: true });
export const insertPlacementEventSchemaExtended = insertPlacementEventSchema.extend({
  date: z.coerce.date(),
  deadline: z.coerce.date(),
});
export type InsertPlacementEvent = z.infer<typeof insertPlacementEventSchemaExtended>;
export type PlacementEvent = typeof placementEvents.$inferSelect;

export const insertMaterialSchema = createInsertSchema(materials).omit({ id: true });
export type InsertMaterial = z.infer<typeof insertMaterialSchema>;
export type Material = typeof materials.$inferSelect;

export const insertTestResultSchema = createInsertSchema(testResults).omit({ id: true, createdAt: true });
export type InsertTestResult = z.infer<typeof insertTestResultSchema>;
export type TestResult = typeof testResults.$inferSelect;
