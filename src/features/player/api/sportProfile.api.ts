import { api } from "#/lib/api/axios";
import type { AddSportProfileInput, SportProfile, SportProfileWithValues, UpdateSportProfileInput } from "../types/sportProfile.types";


export const sportProfileApi = {
  list: async (): Promise<SportProfile[]> => {
    const { data } = await api.get<{ profiles: SportProfile[] }>("/player/sport-profiles");
    return data.profiles;
  },
  add: async (input: AddSportProfileInput): Promise<SportProfile> => {
    const { data } = await api.post<{ profile: SportProfile }>("/player/sport-profiles", input);
    return data.profile;
  },
  get: async (sportId: string): Promise<SportProfileWithValues> => {
    const { data } = await api.get<{ profile: SportProfileWithValues }>(`/player/sport-profiles/${sportId}`);
    return data.profile;
  },
  update: async (sportId: string, input: UpdateSportProfileInput): Promise<SportProfile> => {
    const { data } = await api.patch<{ profile: SportProfile }>(`/player/sport-profiles/${sportId}`, input);
    return data.profile;
  },
};
