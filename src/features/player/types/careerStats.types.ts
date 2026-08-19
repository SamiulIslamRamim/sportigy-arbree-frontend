import type { MatchResult } from "./match.types";

export type ResultBreakdown = Record<MatchResult, number>;

export type CareerFieldOutput =
  | { fieldId: string; name: string; metricId: string | null; isComputed: false; total: number }
  | { fieldId: string; name: string; metricId: string | null; isComputed: true; value: number | null };

export interface CareerMetricOutput {
  metric: string;          // metric name; "Other" when fields have no metric
  metricId: string | null;
  fields: CareerFieldOutput[];
}

export interface CareerCategoryStat {
  categoryId: string | null;
  categoryName: string | null;   // "Uncategorized" when null
  matchesPlayed: number;
  resultBreakdown: ResultBreakdown;
  metrics: CareerMetricOutput[];
}

export interface CareerStatsResponse {
  sportId: string;
  categories: CareerCategoryStat[];
}

export interface CareerTeamStat {
  teamKey: string;               // "org:<uuid>" | "name:<lowercased>"
  teamLabel: string;
  teamOrgId: string | null;
  isHidden: boolean;
  matchesPlayed: number;
  resultBreakdown: ResultBreakdown;
  metrics: CareerMetricOutput[];
}

export interface CareerByTeamResponse {
  sportId: string;
  hidden: "include" | "exclude";
  teams: CareerTeamStat[];
}

export interface TeamVisibilityInput {
  sportId: string;
  teamOrgId?: string;   // exactly ONE of teamOrgId/teamName (backend superRefine)
  teamName?: string;
}
