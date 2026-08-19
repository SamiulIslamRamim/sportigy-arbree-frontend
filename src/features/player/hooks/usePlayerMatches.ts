import { useQuery } from "@tanstack/react-query";
import { playerMatchApi } from "../api/match.api";

export const playerMatchKeys = {
  all: () => ["player", "matches"] as const,
  approved: () => [...playerMatchKeys.all(), "approved"] as const,
  pending: () => [...playerMatchKeys.all(), "pending"] as const,
  rejected: () => [...playerMatchKeys.all(), "rejected"] as const,
  detail: (matchId: string) => ["player", "matches", "detail", matchId] as const,
};

// Backend has NO ?status= query support — use literal-route APIs directly.
export function usePlayerMatches(status: "all" | "approved" | "pending" | "rejected") {
  const apiFn =
    status === "approved" ? playerMatchApi.listApproved
    : status === "pending" ? playerMatchApi.listPending
    : status === "rejected" ? playerMatchApi.listRejected
    : playerMatchApi.listAll;
  const key = status === "all" ? playerMatchKeys.all() : playerMatchKeys[status]();
  return useQuery({ queryKey: key, queryFn: apiFn });
}
