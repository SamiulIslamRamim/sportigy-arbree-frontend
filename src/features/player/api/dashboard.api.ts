import type { DashboardData } from "../types";
import { basicProfileApi } from "./basicProfile.api";
import { careerStatsApi } from "./careerStats.api";
import { playerMatchApi } from "./match.api";


export const dashboardApi = {
  getDashboard: async (sportId: string): Promise<DashboardData> => {
    const [profile, career, approved] = await Promise.all([
      basicProfileApi.get(),
      careerStatsApi.getCareerStats(sportId),
      playerMatchApi.listApproved(),
    ]);
    const matches = approved.matches.filter((m) => m.sportId === sportId);
    const today = new Date().toISOString();
    return {
      profile,
      career,
      recentMatches: matches.slice(0, 5),
      upcomingMatch: matches.find((m) => m.matchDate >= today) ?? null,
      latestResults: matches.filter((m) => m.result && m.result !== "NO_RESULT").slice(0, 5),
    };
  },
};
