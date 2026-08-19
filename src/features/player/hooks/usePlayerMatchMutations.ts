import { useMutation, useQueryClient } from "@tanstack/react-query";
import { playerMatchApi } from "../api/match.api";
import { playerMatchKeys } from "./usePlayerMatches";
import type { UpdateMatchInput } from "../types/match.types";
import { toast } from "sonner";
import { extractApiError } from "#/lib/api/axios";

export function useCreateMatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: playerMatchApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: playerMatchKeys.all() });
      toast.success("Match submitted for approval");
    },
    onError: (err) => toast.error(extractApiError(err, "Failed to submit match")),
  });
}

export function useUpdateMatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ matchId, input }: { matchId: string; input: UpdateMatchInput }) =>
      playerMatchApi.update(matchId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: playerMatchKeys.all() });
      toast.success("Match updated");
    },
    onError: (err) => toast.error(extractApiError(err, "Failed to update match")),
  });
}

export function useDeleteMatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: playerMatchApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: playerMatchKeys.all() });
      toast.success("Match deleted");
    },
    onError: (err) => toast.error(extractApiError(err, "Failed to delete match")),
  });
}
