import type { ApprovalStatus, MatchResult, PlayerMatchFieldValue } from "#/features/player/types";

export interface AdminMatchListRow {
  id: string;
  status: ApprovalStatus;
  result: MatchResult;
  matchDate: string;
  venue: string | null;
  homeTeam: string | null;
  awayTeam: string | null;
  createdAt: string;
  sport?: { id: string; name: string; slug: string };
  sportCategory?: { id: string; name: string; slug: string } | null;
  user: { id: string; name: string; username: string };
}

export interface AdminMatchDetail extends AdminMatchListRow {
  notes: string | null;
  rejectReason: string | null;
  user: { id: string; name: string; username: string; email: string };
  homeTeamOrg: { id: string; name: string } | null;
  awayTeamOrg: { id: string; name: string } | null;
  values: PlayerMatchFieldValue[];
}
