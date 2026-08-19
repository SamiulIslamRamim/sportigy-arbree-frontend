export * from "./baiscProfile.types";
export * from "./careerStats.types";
export * from "./sportProfile.types";
export * from "./match.types";
export * from "./dashboard.types";

export type SportKey = "cricket" | "football" | "basketball";

export interface EarningsSummary {
  thisMonth: number;
  lastThreeMonths: number;
  thisYear: number;
  currency: string;
}

export interface MatchOverview {
  thisMonth: number;
  lastThreeMonths: number;
  thisYear: number;
}

export interface TransactionSummary {
  id: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
  type: "CREDIT" | "DEBIT";
}
