import { z } from 'zod';
import {
  insertUserSchema, type User,
  insertCompanySchema, type Company,
  insertPlacementEventSchemaExtended, type PlacementEvent,
  insertMaterialSchema, type Material,
  insertTestResultSchema, type TestResult
} from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
  unauthorized: z.object({ message: z.string() }),
};

export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/auth/login' as const,
      input: z.object({ email: z.string().email(), password: z.string() }),
      responses: {
        200: z.custom<User>(),
        401: errorSchemas.unauthorized,
      },
    },
    register: {
      method: 'POST' as const,
      path: '/api/auth/register' as const,
      input: insertUserSchema,
      responses: {
        201: z.custom<User>(),
        400: errorSchemas.validation,
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/auth/me' as const,
      responses: {
        200: z.custom<User>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/auth/logout' as const,
      responses: { 200: z.object({ message: z.string() }) },
    },
  },
  companies: {
    list: {
      method: 'GET' as const,
      path: '/api/companies' as const,
      responses: { 200: z.array(z.custom<Company>()) },
    },
    create: {
      method: 'POST' as const,
      path: '/api/companies' as const,
      input: insertCompanySchema,
      responses: { 201: z.custom<Company>(), 400: errorSchemas.validation },
    },
  },
  placementEvents: {
    list: {
      method: 'GET' as const,
      path: '/api/placement-events' as const,
      responses: { 200: z.array(z.custom<PlacementEvent & { company: Company }>()) },
    },
    create: {
      method: 'POST' as const,
      path: '/api/placement-events' as const,
      input: insertPlacementEventSchemaExtended,
      responses: { 201: z.custom<PlacementEvent>(), 400: errorSchemas.validation },
    },
  },
  materials: {
    list: {
      method: 'GET' as const,
      path: '/api/materials' as const,
      input: z.object({ role: z.string().optional() }).optional(),
      responses: { 200: z.array(z.custom<Material>()) },
    },
    create: {
      method: 'POST' as const,
      path: '/api/materials' as const,
      input: insertMaterialSchema,
      responses: { 201: z.custom<Material>(), 400: errorSchemas.validation },
    },
  },
  testResults: {
    list: {
      method: 'GET' as const,
      path: '/api/test-results' as const,
      responses: { 200: z.array(z.custom<TestResult>()) },
    },
    create: {
      method: 'POST' as const,
      path: '/api/test-results' as const,
      input: insertTestResultSchema,
      responses: { 201: z.custom<TestResult>(), 400: errorSchemas.validation },
    },
  },
  chat: {
    query: {
      method: 'POST' as const,
      path: '/api/chat/query' as const,
      input: z.object({ message: z.string() }),
      responses: {
        200: z.object({
          response: z.string(),
          recommendedMaterials: z.array(z.string()).optional(),
          recommendedQuizzes: z.array(z.string()).optional(),
        }),
      },
    },
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
