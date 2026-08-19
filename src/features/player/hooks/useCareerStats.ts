import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { careerStatsApi } from "../api/careerStats.api";

export const careerStatsKeys = {
  career: (sportId: string) => ["career", "stats", sportId] as const,
  byTeam: (sportId: string, hidden: "include" | "exclude") => ["career", "byTeam", sportId, hidden] as const,
};

export function useCareerStats(sportId: string) {
  return useQuery({
    queryKey: careerStatsKeys.career(sportId),
    queryFn: () => careerStatsApi.getCareerStats(sportId),
    enabled: !!sportId,
  });
}

export function useCareerByTeam(sportId: string, hidden: "include" | "exclude" = "include") {
  return useQuery({
    queryKey: careerStatsKeys.byTeam(sportId, hidden),
    queryFn: () => careerStatsApi.getCareerByTeam(sportId, hidden),
    enabled: !!sportId,
  });
}

export function useHideTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: careerStatsApi.hideTeam,
    onSuccess: (_, { sportId }) => {
      qc.invalidateQueries({ queryKey: careerStatsKeys.byTeam(sportId, "include") });
    },
  });
}

export function useUnhideTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: careerStatsApi.unhideTeam,
    onSuccess: (_, { sportId }) => {
      qc.invalidateQueries({ queryKey: careerStatsKeys.byTeam(sportId, "include") });
    },
  });
}
