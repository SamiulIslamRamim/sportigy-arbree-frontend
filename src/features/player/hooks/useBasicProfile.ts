import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { basicProfileApi } from "../api/basicProfile.api"
import { toast } from "sonner"
import { extractApiError } from "#/lib/api/axios"
import type { UpdateBasicProfileInput } from "../types"

export const basicProfileKeys = { all: ["player", "basic-profile"] as const }

export function useBasicProfile() {
  return useQuery({ queryKey: basicProfileKeys.all, queryFn: basicProfileApi.get })
}

export function useUpdateBasicProfile() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateBasicProfileInput) => basicProfileApi.update(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: basicProfileKeys.all })
      toast.success("Profile updated")
    },
    onError: (err) => toast.error(extractApiError(err, "Failed to update profile")),
  })
}
