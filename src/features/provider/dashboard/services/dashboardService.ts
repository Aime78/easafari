import { api } from "@/lib/api";
import type { DashboardStats } from "../types/dashboardTypes";

export const dashboardService = {
  getStats: (): Promise<DashboardStats> => api.get("/provider/dashboard"),
};
