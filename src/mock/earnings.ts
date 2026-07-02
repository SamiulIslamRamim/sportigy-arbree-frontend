import type { EarningsSummary, MatchOverview, TransactionSummary } from "#/features/player/types";

export const mockEarnings: EarningsSummary = {
  thisMonth: 10000,
  lastThreeMonths: 20000,
  thisYear: 60000,
  currency: "BDT",
};

export const mockMatchOverview: MatchOverview = {
  thisMonth: 2,
  lastThreeMonths: 7,
  thisYear: 14,
};

export const mockTransactions: TransactionSummary[] = [
  { id: "tx_001", amount: 4500, currency: "BDT", description: "Match fee — T20 Series", date: "2024-11-22", type: "CREDIT" },
  { id: "tx_002", amount: 5500, currency: "BDT", description: "Sponsorship payout", date: "2024-11-14", type: "CREDIT" },
];
