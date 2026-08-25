// Types for the admin match-review feature.
// Adjust field names here if your backend's actual shape differs slightly.

export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface MatchSport {
  id: string;
  name: string;
  slug: string;
}

export interface MatchSportCategory {
  id: string;
  name: string;
  slug: string;
}

export interface MatchUser {
  id: string;
  name: string;
  username: string;
}

export interface MatchSubmission {
  id: string;
  userId: string;
  sportId: string;
  sportCategoryId: string;
  title: string;
  tournament: string;
  matchType: string;
  venue: string;
  homeTeam: string;
  homeTeamOrgId: string | null;
  awayTeam: string;
  awayTeamOrgId: string | null;
  playerSide: "HOME" | "AWAY";
  matchDate: string;
  result: string | null;
  isCaptain: boolean;
  isSubstitute: boolean;
  minutesPlayed: number | null;
  notes: string | null;
  status: ApprovalStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectReason: string | null;
  createdAt: string;
  updatedAt: string;
  sport: MatchSport;
  sportCategory: MatchSportCategory;
  user: MatchUser;
}

export interface MatchesApiResponse {
  success: boolean;
  message: string;
  error_code: string | null;
  data: {
    submissions: MatchSubmission[];
  };
}