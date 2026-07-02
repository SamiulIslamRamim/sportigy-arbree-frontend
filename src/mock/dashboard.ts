import type { DashboardResponse } from "#/features/player/types";
import { mockCareer } from "./career";
import { mockEarnings, mockMatchOverview } from "./earnings";
import { mockLatestResults, mockRecentMatches, mockUpcomingMatch } from "./matches";
import { mockNotifications } from "./notifications";
import { mockPlayer } from "./player";
import { mockTeams } from "./teams";

export const mockDashboard: DashboardResponse = {
  profile: mockPlayer,
  earnings: mockEarnings,
  matchOverview: mockMatchOverview,
  recentMatches: mockRecentMatches,
  career: mockCareer,
  latestResults: mockLatestResults,
  upcomingMatch: mockUpcomingMatch,
  teams: mockTeams,
  notifications: mockNotifications,
  sport: "cricket",
};
