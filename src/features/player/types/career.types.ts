export type CareerResultKey = "WIN" | "LOSS" | "DRAW" | "TIE" | "NO_RESULT";

export interface CareerFieldStat {
  fieldId: string;
  name: string;
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
