export type FieldType =
  | "TEXT"
  | "NUMBER"
  | "BOOLEAN"
  | "DATE"
  | "SELECT"
  | "MULTI_SELECT";

export type MatchResultValue = "WIN" | "LOSS" | "DRAW" | "TIE" | "NO_RESULT";
export type PlayerSide = "HOME" | "AWAY";
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export const MATCH_RESULTS: MatchResultValue[] = [
  "WIN",
  "LOSS",
  "DRAW",
  "TIE",
  "NO_RESULT",
];

export const MATCH_RESULT_LABELS: Record<MatchResultValue, string> = {
  WIN: "Win",
  LOSS: "Loss",
  DRAW: "Draw",
  TIE: "Tie",
  NO_RESULT: "No result",
};

export const MATCH_RESULT_TONE: Record<MatchResultValue, string> = {
  WIN: "bg-emerald-100 text-emerald-700 border-emerald-200",
  LOSS: "bg-rose-100 text-rose-700 border-rose-200",
  DRAW: "bg-amber-100 text-amber-700 border-amber-200",
  TIE: "bg-sky-100 text-sky-700 border-sky-200",
  NO_RESULT: "bg-muted text-muted-foreground border-border",
};

export const STATUS_LABELS: Record<ApprovalStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export const STATUS_TONE: Record<ApprovalStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  APPROVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  REJECTED: "bg-rose-100 text-rose-700 border-rose-200",
};

export type MatchStatusFilter = "ALL" | ApprovalStatus;

export interface PlayerSportProfileSummary {
  id: string;
  sportId: string;
  academy: string | null;
  sport: { id: string; name: string; slug: string };
}

export interface SportFieldOptionLite {
  id: string;
  label: string;
  value: string;
  isDefault?: boolean;
  isActive?: boolean;
}

export interface PlayerSportField {
  id: string;
  sportId: string;
  name: string;
  slug: string;
  section: "PROFILE" | "MATCH";
  type: FieldType;
  description: string | null;
  required: boolean;
  displayOrder: number;
  isActive: boolean;
  isComputed: boolean;
  metric?: { id: string; name: string; slug: string } | null;
  options: SportFieldOptionLite[];
}

export interface PlayerSportCategoryLite {
  id: string;
  name: string;
  slug: string;
  isActive?: boolean;
}

export interface MatchFieldValuePayload {
  fieldId: string;
  optionId?: string | null;
  valueText?: string | null;
  valueNumber?: number | null;
  valueBoolean?: boolean | null;
  valueDate?: string | null;
}

export interface CreateMatchPayload {
  sportId: string;
  sportCategoryId?: string | null;
  title?: string;
  tournament?: string;
  matchType?: string;
  venue?: string;
  homeTeam?: string;
  awayTeam?: string;
  playerSide?: PlayerSide;
  matchDate: string;
  result: MatchResultValue;
  isCaptain?: boolean;
  isSubstitute?: boolean;
  minutesPlayed?: number;
  notes?: string;
  values?: MatchFieldValuePayload[];
}

export interface PlayerMatchValue {
  id: string;
  fieldId: string;
  optionId: string | null;
  valueText: string | null;
  valueNumber: string | number | null;
  valueBoolean: boolean | null;
  valueDate: string | null;
  field?: { id: string; name: string; slug: string; type: FieldType } | null;
  option?: { id: string; label: string; value: string } | null;
}

export interface PlayerMatch {
  id: string;
  sportId: string;
  sportCategoryId: string | null;
  title: string | null;
  tournament: string | null;
  matchType: string | null;
  venue: string | null;
  homeTeam: string | null;
  awayTeam: string | null;
  playerSide: PlayerSide | null;
  matchDate: string;
  result: MatchResultValue;
  isCaptain: boolean;
  isSubstitute: boolean;
  minutesPlayed: number | null;
  notes: string | null;
  status: ApprovalStatus;
  rejectReason: string | null;
  sport?: { id: string; name: string; slug: string } | null;
  sportCategory?: { id: string; name: string; slug: string } | null;
  values: PlayerMatchValue[];
  createdAt?: string;
}
