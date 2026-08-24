import { api, unwrap } from "#/lib/api/axios";
import type { ApiEnvelope } from "#/lib/api/axios";
import type { CareerStatsResponse } from "../types/career.types";
import type {
  BasicProfile,
  SportProfile,
  SportSummary,
  UpdateBasicProfileInput,
} from "../types/player.types";

export const playerApi = {
  getBasicProfile: async (): Promise<BasicProfile> => {
    const res = await api.get<ApiEnvelope<{ profile: BasicProfile }>>("/player/profile");
    return unwrap(res).profile;
  },

  updateBasicProfile: async (input: UpdateBasicProfileInput): Promise<BasicProfile> => {
    const res = await api.patch<ApiEnvelope<{ profile: BasicProfile }>>("/player/profile", input);
    return unwrap(res).profile;
  },

  listSportProfiles: async (): Promise<SportProfile[]> => {
    const res = await api.get<ApiEnvelope<{ profiles: SportProfile[] }>>("/player/sport-profiles");
    return unwrap(res).profiles;
  },

  getSportProfile: async (sportId: string): Promise<SportProfile> => {
    const res = await api.get<ApiEnvelope<{ profile: SportProfile }>>(
      `/player/sport-profiles/${sportId}`,
    );
    return unwrap(res).profile;
  },

  updateSportProfile: async (
    sportId: string,
    input: { academy?: string | null; values?: { fieldId: string; optionId: string }[] },
  ): Promise<{ id: string }> => {
    const res = await api.patch<ApiEnvelope<{ profile: { id: string } }>>(
      `/player/sport-profiles/${sportId}`,
      input,
    );
    return unwrap(res).profile;
  },

  addSportProfile: async (input: { sportId: string; academy?: string }): Promise<{ id: string }> => {
    const res = await api.post<ApiEnvelope<{ profile: { id: string } }>>(
      "/player/sport-profiles",
      input,
    );
    return unwrap(res).profile;
  },

  listSports: async (): Promise<SportSummary[]> => {
    const res = await api.get<ApiEnvelope<{ sports: SportSummary[] }>>("/sports");
    return unwrap(res).sports;
  },

  getCareerStats: async (sportId: string): Promise<CareerStatsResponse> => {
    const res = await api.get<ApiEnvelope<CareerStatsResponse>>(
      "/player/matches/stats/career/",
      { params: { sportId } },
    );
    return unwrap(res);
  },
};