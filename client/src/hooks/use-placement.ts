import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { InsertCompany, InsertPlacementEvent, InsertMaterial, InsertTestResult } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

// === COMPANIES ===
export function useCompanies() {
  return useQuery({
    queryKey: [api.companies.list.path],
    queryFn: async () => {
      const res = await fetch(api.companies.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch companies");
      return api.companies.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: InsertCompany) => {
      const res = await fetch(api.companies.create.path, {
        method: api.companies.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create company");
      return api.companies.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.companies.list.path] });
      toast({ title: "Company Created", description: "The company profile has been added." });
    },
  });
}

// === PLACEMENT EVENTS ===
export function usePlacementEvents() {
  return useQuery({
    queryKey: [api.placementEvents.list.path],
    queryFn: async () => {
      const res = await fetch(api.placementEvents.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch events");
      return api.placementEvents.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreatePlacementEvent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: InsertPlacementEvent) => {
      const res = await fetch(api.placementEvents.create.path, {
        method: api.placementEvents.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create event");
      return api.placementEvents.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.placementEvents.list.path] });
      toast({ title: "Event Created", description: "The placement event has been scheduled." });
    },
  });
}

// === MATERIALS ===
export function useMaterials(role?: string) {
  return useQuery({
    queryKey: [api.materials.list.path, role],
    queryFn: async () => {
      const url = role ? `${api.materials.list.path}?role=${encodeURIComponent(role)}` : api.materials.list.path;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch materials");
      return api.materials.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateMaterial() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: InsertMaterial) => {
      const res = await fetch(api.materials.create.path, {
        method: api.materials.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to add material");
      return api.materials.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.materials.list.path] });
      toast({ title: "Material Added", description: "Study material has been uploaded." });
    },
  });
}

// === TEST RESULTS ===
export function useTestResults() {
  return useQuery({
    queryKey: [api.testResults.list.path],
    queryFn: async () => {
      const res = await fetch(api.testResults.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch results");
      return api.testResults.list.responses[200].parse(await res.json());
    },
  });
}

export function useSubmitTestResult() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (data: InsertTestResult) => {
      const res = await fetch(api.testResults.create.path, {
        method: api.testResults.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to submit test");
      return api.testResults.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.testResults.list.path] });
      toast({ title: "Test Completed", description: "Your results have been saved successfully." });
    },
  });
}

// === CHAT ===
export function useChatQuery() {
  return useMutation({
    mutationFn: async (message: string) => {
      const res = await fetch(api.chat.query.path, {
        method: api.chat.query.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Chat request failed");
      return api.chat.query.responses[200].parse(await res.json());
    },
  });
}
