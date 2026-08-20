import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractApiError } from "#/lib/api/axios";
import { playerApi } from "../api/player.api";
import type { UpdateBasicProfileInput } from "../types/player.types";

export const playerProfileKeys = {
  basic: ["player-profile", "basic"] as const,
  sports: ["player-profile", "sports"] as const,
  sportProfiles: ["player-profile", "sport-profiles"] as const,
  sportProfile: (sportId: string) => ["player-profile", "sport-profiles", sportId] as const,
};

export function useBasicProfile() {
  return useQuery({ queryKey: playerProfileKeys.basic, queryFn: playerApi.getBasicProfile });
}

export function useSports() {
  return useQuery({ queryKey: playerProfileKeys.sports, queryFn: playerApi.listSports });
}

export function useSportProfiles() {
  return useQuery({ queryKey: playerProfileKeys.sportProfiles, queryFn: playerApi.listSportProfiles });
}

export function useSportProfile(sportId: string | null) {
  return useQuery({
    queryKey: playerProfileKeys.sportProfile(sportId ?? "none"),
    queryFn: () => playerApi.getSportProfile(sportId as string),
    enabled: !!sportId,
  });
}

export function useUpdateBasicProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateBasicProfileInput) => playerApi.updateBasicProfile(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: playerProfileKeys.basic });
      toast.success("Profile updated");
    },
    onError: (err) => toast.error(extractApiError(err, "Failed to update profile")),
  });
}

export function useUpdateSportProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sportId, input }: { sportId: string; input: { academy?: string | null } }) =>
      playerApi.updateSportProfile(sportId, input),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: playerProfileKeys.sportProfiles });
      qc.invalidateQueries({ queryKey: playerProfileKeys.sportProfile(vars.sportId) });
      toast.success("Sport profile updated");
    },
    onError: (err) => toast.error(extractApiError(err, "Failed to update sport profile")),
  });
}

export function useAddSportProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: { sportId: string; academy?: string }) => playerApi.addSportProfile(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: playerProfileKeys.sportProfiles });
      toast.success("Sport profile added");
    },
    onError: (err) => toast.error(extractApiError(err, "Failed to add sport profile")),
  });
}