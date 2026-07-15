import { api } from "#/lib/api/axios";
import type { PlayerInformation, UpdatePlayerInformationInput } from "../types/player.types";

export const playerApi = {
  getPlayerInformation: async (): Promise<PlayerInformation> => {
    const res = await api.get<PlayerInformation>("/player-information");
    return res.data;
  },
  updatePlayerInformation: async (
    input: UpdatePlayerInformationInput,
  ): Promise<PlayerInformation> => {
    const res = await api.patch<PlayerInformation>("/player-information", input);
    return res.data;
  },
};