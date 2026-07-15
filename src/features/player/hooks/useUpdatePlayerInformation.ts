import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdatePlayerInformationInput } from "../types/player.types";
import { playerApi } from "../api/player.api";
import { playerInformationKey } from "./usePlayerInformation";
import { toast } from "sonner";
import { extractApiError } from "#/lib/api/axios";

export function useUpdatePlayerInformation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdatePlayerInformationInput) =>
      playerApi.updatePlayerInformation(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: playerInformationKey });
      toast.success("Player information updated");
    },
    onError: (err) => {
      toast.error(extractApiError(err, "Failed to update player information"));
    },
  });
}