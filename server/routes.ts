import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Set up authentication routes and session
  setupAuth(app);

  // Companies
  app.get(api.companies.list.path, async (req, res) => {
    const companiesList = await storage.getCompanies();
    res.json(companiesList);
  });

  app.post(api.companies.create.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const input = api.companies.create.input.parse(req.body);
      const company = await storage.createCompany(input);
      res.status(201).json(company);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      } else {
        throw err;
      }
    }
  });

  // Placement Events
  app.get(api.placementEvents.list.path, async (req, res) => {
    const events = await storage.getPlacementEvents();
    res.json(events);
  });

  app.post(api.placementEvents.create.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const input = api.placementEvents.create.input.parse(req.body);
      const event = await storage.createPlacementEvent(input);
      res.status(201).json(event);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      } else {
        throw err;
      }
    }
  });

  // Materials
  app.get(api.materials.list.path, async (req, res) => {
    const role = req.query.role as string | undefined;
    const materialsList = await storage.getMaterials(role);
    res.json(materialsList);
  });

  app.post(api.materials.create.path, async (req, res) => {
    if (!req.isAuthenticated() || req.user.role !== "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const input = api.materials.create.input.parse(req.body);
      const material = await storage.createMaterial(input);
      res.status(201).json(material);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      } else {
        throw err;
      }
    }
  });

  // Test Results
  app.get(api.testResults.list.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.user.role === "admin" ? undefined : req.user.id;
    const results = await storage.getTestResults(userId);
    res.json(results);
  });

  app.post(api.testResults.create.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const input = api.testResults.create.input.parse(req.body);
      // Ensure users can only submit tests for themselves unless admin
      if (req.user.role !== "admin" && input.userId !== req.user.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const result = await storage.createTestResult(input);
      res.status(201).json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message, field: err.errors[0].path.join('.') });
      } else {
        throw err;
      }
    }
  });

  // Chatbot Query
  app.post(api.chat.query.path, async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const input = api.chat.query.input.parse(req.body);
      
      const response = await openai.chat.completions.create({
        model: "gpt-5.2",
        messages: [
          { 
            role: "system", 
            content: `You are an AI assistant for a college placement preparation platform. 
            
            Your responses must always follow these rules:
            1. Provide clear, structured answers using headings and bullet points.
            2. Explain preparation strategies step-by-step.
            3. Highlight the most important topics first.
            4. Give practical study plans when relevant.
            5. Keep responses concise but informative.
            6. Ask 2–3 follow-up questions to personalize preparation.
            7. Avoid long paragraphs. Use bullet points and sections.
            8. Focus on actionable guidance students can follow.

            Response format must always follow this structure:
            1. Short introduction
            2. Key sections with headings
            3. Step-by-step preparation strategy
            4. Practical study tips
            5. Personalized follow-up questions`
          },
          { role: "user", content: input.message }
        ],
      });

      res.status(200).json({
        response: response.choices[0]?.message?.content || "I'm sorry, I couldn't understand that.",
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ message: err.errors[0].message });
      } else {
        console.error("Chatbot error:", err);
        res.status(500).json({ message: "Failed to generate response" });
      }
    }
  });

  return httpServer;
}

// Seed function to initialize database with mock data
export async function seedDatabase() {
  const companiesList = await storage.getCompanies();
  if (companiesList.length === 0) {
    // Admin user will be created separately if needed, but we seed public data
    const msft = await storage.createCompany({
      name: "Microsoft",
      roles: ["Software Engineer", "Product Manager"],
      eligibility: "CGPA 8.0+, No backlogs",
      packageInfo: "45 LPA",
      selectionProcess: "Online Assessment -> 3 Technical Interviews -> 1 HR Interview"
    });
    
    const amzn = await storage.createCompany({
      name: "Amazon",
      roles: ["SDE-1", "Data Analyst"],
      eligibility: "CGPA 7.5+",
      packageInfo: "40 LPA",
      selectionProcess: "OA -> 2 Technical -> Bar Raiser"
    });

    // Event dates next week
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 5);

    await storage.createPlacementEvent({
      companyId: msft.id,
      date: nextWeek,
      deadline: deadline,
      role: "Software Engineer"
    });

    await storage.createPlacementEvent({
      companyId: amzn.id,
      date: nextWeek,
      deadline: deadline,
      role: "SDE-1"
    });

    await storage.createMaterial({
      title: "Top 100 DSA Problems",
      category: "coding practice",
      role: "Software Engineer",
      link: "https://leetcode.com",
      tags: ["DSA", "Arrays", "Graphs"]
    });

    await storage.createMaterial({
      title: "System Design Primer",
      category: "architecture",
      role: "Software Engineer",
      link: "https://github.com/donnemartin/system-design-primer",
      tags: ["System Design", "Scalability"]
    });
    
    await storage.createMaterial({
      title: "Data Science Interview Guide",
      category: "interview prep",
      role: "Data Analyst",
      link: "https://example.com/ds-guide",
      tags: ["SQL", "Python", "Statistics"]
    });
  }
}
