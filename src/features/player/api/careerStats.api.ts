import { api } from "#/lib/api/axios";
import type { CareerByTeamResponse, CareerStatsResponse, TeamVisibilityInput } from "../types";


export const careerStatsApi = {
  // sportId is a REQUIRED uuid query param (sportQuerySchema); unknown/inactive sport → 404
  getCareerStats: async (sportId: string): Promise<CareerStatsResponse> => {
    const { data } = await api.get<CareerStatsResponse>(
      `/player/matches/stats/career/?sportId=${sportId}`,
    );
    return data; // { sportId, categories }
  },
  getCareerByTeam: async (sportId: string, hidden: "include" | "exclude" = "include"): Promise<CareerByTeamResponse> => {
    const { data } = await api.get<CareerByTeamResponse>(
      `/player/matches/stats/by-team/?sportId=${sportId}&hidden=${hidden}`,
    );
    return data; // { sportId, hidden, teams }
  },
  // Backend requires sportId + EXACTLY ONE of teamOrgId | teamName (superRefine)
  hideTeam: async (input: TeamVisibilityInput): Promise<{ teamKey: string }> => {
    const { data } = await api.post<{ teamKey: string }>("/player/matches/team-visibility/", input);
    return data;
  },
  unhideTeam: async (input: TeamVisibilityInput): Promise<{ teamKey: string }> => {
    const { data } = await api.delete<{ teamKey: string }>("/player/matches/team-visibility/", { data: input });
    return data;
  },
};
