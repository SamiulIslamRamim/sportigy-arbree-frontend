import { extractApiError } from "#/lib/api/axios"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { sportProfileApi } from "../api/sportProfile.api"
import type { AddSportProfileInput, UpdateSportProfileInput } from "../types/sportProfile.types"


export const sportProfileKeys = {
  all: ["player", "sport-profiles"] as const,
  one: (sportId: string) => ["player", "sport-profiles", sportId] as const,
}

export function useSportProfiles() {
  return useQuery({ queryKey: sportProfileKeys.all, queryFn: sportProfileApi.list })
}

export function useSportProfile(sportId: string) {
  return useQuery({
    queryKey: sportProfileKeys.one(sportId),
    queryFn: () => sportProfileApi.get(sportId),
    enabled: !!sportId,
  })
}

export function useAddSportProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: AddSportProfileInput) => sportProfileApi.add(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: sportProfileKeys.all })
      toast.success("Sport added")
    },
    onError: (err) => toast.error(extractApiError(err, "Failed to add sport")),
  })
}

export function useUpdateSportProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ sportId, input }: { sportId: string; input: UpdateSportProfileInput }) =>
      sportProfileApi.update(sportId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: sportProfileKeys.all })
      toast.success("Sport profile updated")
    },
    onError: (err) => toast.error(extractApiError(err, "Failed to update sport profile")),
  })
}
