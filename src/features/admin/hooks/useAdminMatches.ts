import { extractAdminApiError } from "../api/admin-auth.api";
import { adminMatchApi } from "../api/adminMatch.api";
import type { ApprovalStatus } from "#/features/player/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const adminMatchKeys = {
  all: ["admin", "matches"] as const,
  list: (status?: ApprovalStatus) => ["admin", "matches", status ?? "all"] as const,
  one: (id: string) => ["admin", "matches", "detail", id] as const,
};

export function useAdminMatchReview(status?: ApprovalStatus) {
  return useQuery({
    queryKey: adminMatchKeys.list(status),
    queryFn: () => adminMatchApi.list(status),
  });
}

export function useAdminMatch(matchId: string) {
  return useQuery({
    queryKey: adminMatchKeys.one(matchId),
    queryFn: () => adminMatchApi.get(matchId),
    enabled: !!matchId,
  });
}

export function useAdminApproveMatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (matchId: string) => adminMatchApi.approve(matchId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminMatchKeys.all });
      toast.success("Match approved");
    },
    onError: (err) => toast.error(extractAdminApiError(err, "Failed to approve match")),
  });
}

export function useAdminRejectMatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ matchId, reason }: { matchId: string; reason: string }) => adminMatchApi.reject(matchId, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: adminMatchKeys.all });
      toast.success("Match rejected");
    },
    onError: (err) => toast.error(extractAdminApiError(err, "Failed to reject match")),
  });
}
