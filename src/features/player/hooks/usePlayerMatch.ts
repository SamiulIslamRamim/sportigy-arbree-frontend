import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { playerMatchApi } from "../api/playerMatch.api";
import { extractApiError } from "@/lib/api/axios";
import type {
  ApprovalStatus,
  CreateMatchPayload,
  MatchStatusFilter,
} from "../types/match.types";

export const playerMatchKeys = {
  all: ["player-matches"] as const,
  lists: ["player-matches", "list"] as const,
  list: (status: MatchStatusFilter) => ["player-matches", "list", status] as const,
  sportProfiles: ["player-sport-profiles"] as const,
  fields: (sportId: string) => ["player-sport-fields", sportId] as const,
  categories: (sportId: string) => ["player-sport-categories", sportId] as const,
};

export function usePlayerSportProfiles() {
  return useQuery({
    queryKey: playerMatchKeys.sportProfiles,
    queryFn: playerMatchApi.listSportProfiles,
  });
}

export function useSportMatchFields(sportId: string | undefined) {
  return useQuery({
    queryKey: playerMatchKeys.fields(sportId ?? "none"),
    queryFn: () => playerMatchApi.listSportFields(sportId as string),
    enabled: Boolean(sportId),
  });
}

export function useSportCategories(sportId: string | undefined) {
  return useQuery({
    queryKey: playerMatchKeys.categories(sportId ?? "none"),
    queryFn: () => playerMatchApi.listSportCategories(sportId as string),
    enabled: Boolean(sportId),
  });
}

export function usePlayerMatchList(status: MatchStatusFilter) {
  return useQuery({
    queryKey: playerMatchKeys.list(status),
    queryFn: () =>
      playerMatchApi.listMatches(
        status === "ALL" ? undefined : (status as ApprovalStatus),
      ),
  });
}

export function useCreateMatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateMatchPayload) => playerMatchApi.createMatch(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: playerMatchKeys.all });
      toast.success("Match submitted for approval");
    },
    onError: (err) => toast.error(extractApiError(err, "Failed to submit match")),
  });
}

export function useDeleteMatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (matchId: string) => playerMatchApi.deleteMatch(matchId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: playerMatchKeys.all });
      toast.success("Match submission withdrawn");
    },
    onError: (err) => toast.error(extractApiError(err, "Failed to withdraw match")),
  });
}
