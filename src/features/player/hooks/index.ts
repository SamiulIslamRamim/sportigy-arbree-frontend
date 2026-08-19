import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard.api";

export const dashboardKeys = {
  all: ["player", "dashboard"] as const,
  overview: (sportId: string) => [...dashboardKeys.all, sportId] as const,
};

export function useDashboard(sportId: string) {
  return useQuery({
    queryKey: dashboardKeys.overview(sportId),
    queryFn: () => dashboardApi.getDashboard(sportId),
    enabled: !!sportId,
  });
}
