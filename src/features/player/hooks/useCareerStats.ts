import { useQuery } from "@tanstack/react-query";
import { playerApi } from "../api/player.api";

export const careerStatsKeys = {
  all: ["player-career-stats"] as const,
  career: (sportId: string | null) =>
    [...careerStatsKeys.all, "career", sportId ?? "none"] as const,
};

export function useCareerStats(sportId: string | null) {
  return useQuery({
    queryKey: careerStatsKeys.career(sportId),
    queryFn: () => playerApi.getCareerStats(sportId as string),
    enabled: Boolean(sportId),
  });
}
