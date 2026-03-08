import { z } from "zod";

export const insertUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["student", "admin"]).default("student"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = InsertUser & { id: string, createdAt: Date };

export const insertCompanySchema = z.object({
  name: z.string().min(1, "Company name is required"),
  roles: z.array(z.string()).min(1, "At least one role is required"),
  eligibility: z.string().min(1, "Eligibility criteria is required"),
  packageInfo: z.string().min(1, "Package info is required"),
  selectionProcess: z.string().min(1, "Selection process is required"),
});

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = InsertCompany & { id: string };

export const insertPlacementEventSchema = z.object({
  companyId: z.string().min(1, "Company ID is required"),
  role: z.string().min(1, "Role is required"),
});

export const insertPlacementEventSchemaExtended = insertPlacementEventSchema.extend({
  date: z.coerce.date(),
  deadline: z.coerce.date(),
});

export type InsertPlacementEvent = z.infer<typeof insertPlacementEventSchemaExtended>;
export type PlacementEvent = InsertPlacementEvent & { id: string };

export const insertMaterialSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  role: z.string().min(1, "Role is required"),
  link: z.string().url("Must be a valid URL"),
  tags: z.array(z.string()),
});

export type InsertMaterial = z.infer<typeof insertMaterialSchema>;
export type Material = InsertMaterial & { id: string };

export const insertTestResultSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  testType: z.string().min(1, "Test type is required"),
  score: z.number().min(0),
  accuracy: z.number().min(0).max(100),
  timeTaken: z.number().min(0), // in seconds
});

export type InsertTestResult = z.infer<typeof insertTestResultSchema>;
export type TestResult = InsertTestResult & { id: string, createdAt: Date };

export const insertConversationSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = InsertConversation & { id: string, createdAt: Date };

export const insertMessageSchema = z.object({
  conversationId: z.string().min(1, "Conversation ID is required"),
  role: z.string().min(1, "Role is required"),
  content: z.string().min(1, "Content is required"),
  recommendedMaterials: z.array(z.string()).optional(),
  recommendedQuizzes: z.array(z.string()).optional(),
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = InsertMessage & { id: string, createdAt: Date };
