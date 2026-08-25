export type CareerResultKey = "WIN" | "LOSS" | "DRAW" | "TIE" | "NO_RESULT";

export interface CareerFieldStat {
  fieldId: string;
  name: string;
  slug: string;
  metricId: string | null;
  isComputed: boolean;
  total?: number;
  value?: number | null;
}

export interface CareerMetricGroup {
  metric: string;
  metricId: string | null;
  fields: CareerFieldStat[];
}

export interface CareerCategoryStats {
  categoryId: string | null;
  categoryName: string | null;
  matchesPlayed: number;
  resultBreakdown: Record<CareerResultKey, number>;
  metrics: CareerMetricGroup[];
}

export interface CareerStatsResponse {
  sportId: string;
  categories: CareerCategoryStats[];
}

export interface CareerTeamStats {
  teamKey: string;
  teamLabel: string;
  teamOrgId: string | null;
  isHidden: boolean;
  matchesPlayed: number;
  resultBreakdown: Record<CareerResultKey, number>;
  metrics: CareerMetricGroup[];
}

export interface CareerByTeamResponse {
  sportId: string;
  hidden: "include" | "exclude";
  teams: CareerTeamStats[];
}

export interface SportCategoryOption {
  id: string;
  name: string;
}
