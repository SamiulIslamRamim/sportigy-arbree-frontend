import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard.api";

export const dashboardKeys = {
  all: ["player-dashboard"] as const,
  dashboard: () => [...dashboardKeys.all, "overview"] as const,
  career: () => [...dashboardKeys.all, "career"] as const,
  recent: () => [...dashboardKeys.all, "recent"] as const,
  upcoming: () => [...dashboardKeys.all, "upcoming"] as const,
};

export function useDashboard() {
  return useQuery({ queryKey: dashboardKeys.dashboard(), queryFn: dashboardApi.getDashboard });
}
export function useCareerStats() {
  return useQuery({ queryKey: dashboardKeys.career(), queryFn: dashboardApi.getCareer });
}
export function useRecentMatches() {
  return useQuery({ queryKey: dashboardKeys.recent(), queryFn: dashboardApi.getRecentMatches });
}
export function useUpcomingMatches() {
  return useQuery({ queryKey: dashboardKeys.upcoming(), queryFn: dashboardApi.getUpcomingMatch });
}
