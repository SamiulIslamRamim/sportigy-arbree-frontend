import type { FieldType } from "./sportProfile.types";

export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";
export type MatchResult = "WIN" | "LOSS" | "DRAW" | "TIE" | "NO_RESULT";
export type PlayerSide = "HOME" | "AWAY";

export interface TeamSlot {
  name?: string;
  orgId?: string;
}

export interface PlayerMatch {
  id: string;
  userId: string;
  sportId: string;
  // 🟡 `sport` / `sportCategory` are OMITTED in create/update responses.
  // Present in get + list.
  sport?: { id: string; name: string; slug: string };
  sportCategoryId: string | null;
  sportCategory?: { id: string; name: string; slug: string } | null;
  title: string | null;
  tournament: string | null;
  matchType: string | null;
  venue: string | null;
  homeTeam: string | null;
  homeTeamOrgId: string | null;
  homeTeamOrg: { id: string; name: string } | null;
  awayTeam: string | null;
  awayTeamOrgId: string | null;
  awayTeamOrg: { id: string; name: string } | null;
  playerSide: PlayerSide | null;
  // Derived by backend (derivePlayerMatch) from playerSide:
  playerTeam: string | null;
  playerTeamOrgId: string | null;
  playerTeamOrg: { id: string; name: string } | null;
  matchDate: string;      // ISO datetime (backend: DateTime)
  result: MatchResult;
  isCaptain: boolean;
  isSubstitute: boolean;
  minutesPlayed: number | null;
  notes: string | null;
  status: ApprovalStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectReason: string | null;
  values?: PlayerMatchFieldValue[];   // 🟡 OMITTED in list endpoints; present in get/create/update
  createdAt: string;
  updatedAt: string;
}

export interface PlayerMatchFieldValue {
  id: string;
  playerMatchId: string;
  fieldId: string;
  field: { id: string; name: string; slug: string; type: FieldType };
  // Typed value channels (only one set per field.type)
  optionId: string | null;
  option: { id: string; label: string; value: string } | null;
  valueNumber: number | null;   // backend stores Decimal(12,2) → coerce with Number()
  valueText: string | null;
  valueBoolean: boolean | null;
  valueDate: string | null;     // date-only (backend @db.Date)
}

export interface SportFieldWithOptions {
  id: string;
  name: string;
  slug: string;
  section: "PROFILE" | "MATCH";
  type: FieldType;
  required: boolean;
  displayOrder: number;
  isComputed: boolean;
  isActive: boolean;
  options: { id: string; label: string; value: string; isActive: boolean }[];
}

export interface CreateMatchInput {
  sportId: string;
  sportCategoryId?: string | null;
  title?: string;
  tournament?: string;
  matchType?: string;
  venue?: string;
  homeTeam?: TeamSlot;
  awayTeam?: TeamSlot;
  playerSide: PlayerSide;   // optional on backend; HOME/AWAY requires that team slot
  matchDate: string;        // ISO date
  result: MatchResult;
  isCaptain?: boolean;
  isSubstitute?: boolean;
  minutesPlayed?: number;
  notes?: string;
  values: MatchFieldValueInput[];
}

export interface UpdateMatchInput {
  sportCategoryId?: string | null;
  title?: string;
  tournament?: string;
  matchType?: string;
  venue?: string;
  homeTeam?: TeamSlot;
  awayTeam?: TeamSlot;
  playerSide?: PlayerSide;
  matchDate?: string;
  result?: MatchResult;
  isCaptain?: boolean;
  isSubstitute?: boolean;
  minutesPlayed?: number;
  notes?: string;
  values?: MatchFieldValueInput[];
}

export interface MatchFieldValueInput {
  fieldId: string;
  // One of these based on field.type
  optionId?: string;           // SELECT, MULTI_SELECT
  valueNumber?: number;        // NUMBER (min -100000, max 100000)
  valueText?: string;          // TEXT (max 500)
  valueBoolean?: boolean;      // BOOLEAN
  valueDate?: string;          // DATE (ISO)
}
