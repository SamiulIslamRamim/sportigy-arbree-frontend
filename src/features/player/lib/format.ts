import type { CricketFormat, MatchResult } from "../types";


export const formatLabels: Record<CricketFormat, string> = {
  TEST: "Test",
  ODI: "ODI",
  T20I: "T20I",
  LIST_A: "List A",
  FIRST_CLASS: "First Class",
  T20: "T20",
};

export const resultLabels: Record<MatchResult, string> = {
  WIN: "Win",
  LOSS: "Loss",
  DRAW: "Draw",
  NO_RESULT: "No result",
};

export const resultTone: Record<MatchResult, string> = {
  WIN: "bg-emerald-100 text-emerald-700 border-emerald-200",
  LOSS: "bg-rose-100 text-rose-700 border-rose-200",
  DRAW: "bg-amber-100 text-amber-700 border-amber-200",
  NO_RESULT: "bg-muted text-muted-foreground border-border",
};

export function formatCurrency(amount: number, currency: string) {
  const symbol = currency === "BDT" ? "৳" : currency;
  return `${symbol} ${amount.toLocaleString("en-US")}`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function countdown(toIso: string, fromDate = new Date()): string {
  const diff = new Date(toIso).getTime() - fromDate.getTime();
  if (diff <= 0) return "Started";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  return `${days}d ${hours}h later`;
}
