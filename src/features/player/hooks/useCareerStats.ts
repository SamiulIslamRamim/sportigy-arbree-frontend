import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractApiError } from "#/lib/api/axios";
import { playerApi } from "../api/player.api";
import type { TeamVisibilityInput } from "../api/player.api";

export const careerStatsKeys = {
  all: ["player-career-stats"] as const,
  career: (sportId: string | null) =>
    [...careerStatsKeys.all, "career", sportId ?? "none"] as const,
  byTeam: (sportId: string | null, categoryId: string | null) =>
    [...careerStatsKeys.all, "by-team", sportId ?? "none", categoryId ?? "all"] as const,
  sportCategories: (sportId: string | null) =>
    [...careerStatsKeys.all, "sport-categories", sportId ?? "none"] as const,
};

export function useCareerStats(sportId: string | null) {
  return useQuery({
    queryKey: careerStatsKeys.career(sportId),
    queryFn: () => playerApi.getCareerStats(sportId as string),
    enabled: Boolean(sportId),
  });
}

export function useCareerByTeam(sportId: string | null, categoryId: string | null) {
  return useQuery({
    queryKey: careerStatsKeys.byTeam(sportId, categoryId),
    queryFn: () => playerApi.getCareerByTeam(sportId as string, categoryId),
    enabled: Boolean(sportId),
  });
}

export function useSportCategories(sportId: string | null) {
  return useQuery({
    queryKey: careerStatsKeys.sportCategories(sportId),
    queryFn: () => playerApi.listSportCategories(sportId as string),
    enabled: Boolean(sportId),
  });
}

export function useHideTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: TeamVisibilityInput) => playerApi.hideTeam(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: careerStatsKeys.all });
      toast.success("Team hidden");
    },
    onError: (err) => toast.error(extractApiError(err, "Failed to hide team")),
  });
}

export function useUnhideTeam() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: TeamVisibilityInput) => playerApi.unhideTeam(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: careerStatsKeys.all });
      toast.success("Team is visible again");
    },
    onError: (err) => toast.error(extractApiError(err, "Failed to unhide team")),
  });
}
