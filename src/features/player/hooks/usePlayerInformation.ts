import { useQuery } from "@tanstack/react-query";
import { playerApi } from "../api/player.api";

export const playerInformationKey = ["player-information"] as const;

export function usePlayerInformation() {
  return useQuery({
    queryKey: playerInformationKey,
    queryFn: playerApi.getPlayerInformation,
  });
}