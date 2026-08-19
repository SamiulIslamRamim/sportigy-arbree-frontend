import type { BasicProfile } from "./baiscProfile.types";
import type { CareerStatsResponse } from "./careerStats.types";
import type { PlayerMatch } from "./match.types";


export interface DashboardData {
  profile: BasicProfile;
  career: CareerStatsResponse;
  recentMatches: PlayerMatch[];
  upcomingMatch: PlayerMatch | null;
  latestResults: PlayerMatch[];
}
