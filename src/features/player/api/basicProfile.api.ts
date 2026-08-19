import { api } from "#/lib/api/axios";
import type { BasicProfile, UpdateBasicProfileInput } from "../types";


export const basicProfileApi = {
  get: async (): Promise<BasicProfile> => {
    const { data } = await api.get<{ profile: BasicProfile }>("/player/profile");
    return data.profile;
  },
  update: async (input: UpdateBasicProfileInput): Promise<BasicProfile> => {
    const { data } = await api.patch<{ profile: BasicProfile }>("/player/profile", input);
    return data.profile;
  },
};
