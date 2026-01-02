import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { dashboardService } from "../services/dashboardService";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: queryKeys.provider.dashboard(),
    queryFn: dashboardService.getStats,
  });
};
