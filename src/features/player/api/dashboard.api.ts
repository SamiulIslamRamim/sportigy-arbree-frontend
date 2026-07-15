import { mockCareer } from "#/mock/career";
import { mockDashboard } from "#/mock/dashboard";
import { mockRecentMatches, mockUpcomingMatch } from "#/mock/matches";
import type { CareerStatistics, DashboardResponse, RecentMatch, UpcomingMatch } from "../types";

const delay = <T>(data: T, ms = 250): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

export const dashboardApi = {
  getDashboard: (): Promise<DashboardResponse> => delay(mockDashboard),
  getCareer: (): Promise<CareerStatistics> => delay(mockCareer),
  getRecentMatches: (): Promise<RecentMatch[]> => delay(mockRecentMatches),
  getUpcomingMatch: (): Promise<UpcomingMatch> => delay(mockUpcomingMatch),
};