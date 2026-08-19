import { api } from "#/lib/api/axios";
import type { CreateMatchInput, PlayerMatch, SportFieldWithOptions, UpdateMatchInput } from "../types";


export const playerMatchApi = {
  create: async (input: CreateMatchInput): Promise<PlayerMatch> => {
    const { data } = await api.post<{ submission: PlayerMatch }>("/player/matches/", input);
    return data.submission;
  },
  // Backend uses LITERAL routes — no ?status= query param support.
  listAll: async (): Promise<{ matches: PlayerMatch[] }> => {
    const { data } = await api.get<{ matches: PlayerMatch[] }>("/player/matches/");
    return data;
  },
  listApproved: async (): Promise<{ matches: PlayerMatch[] }> => {
    const { data } = await api.get<{ matches: PlayerMatch[] }>("/player/matches/approved/");
    return data;
  },
  listPending: async (): Promise<{ matches: PlayerMatch[] }> => {
    const { data } = await api.get<{ matches: PlayerMatch[] }>("/player/matches/pending/");
    return data;
  },
  listRejected: async (): Promise<{ matches: PlayerMatch[] }> => {
    const { data } = await api.get<{ matches: PlayerMatch[] }>("/player/matches/rejected/");
    return data;
  },
  get: async (matchId: string): Promise<PlayerMatch> => {
    const { data } = await api.get<{ match: PlayerMatch }>(`/player/matches/${matchId}/`);
    return data.match;
  },
  update: async (matchId: string, input: UpdateMatchInput): Promise<PlayerMatch> => {
    const { data } = await api.patch<{ submission: PlayerMatch }>(`/player/matches/${matchId}/`, input);
    return data.submission;
  },
  delete: async (matchId: string): Promise<void> => {
    await api.delete(`/player/matches/${matchId}/`);
  },
  // Fields for dynamic form — REQUIRES backend endpoint (gap #1).
  // Backend match-entry validation excludes isComputed fields, so filter them out here too.
  getMatchFields: async (sportId: string): Promise<SportFieldWithOptions[]> => {
    try {
      const { data } = await api.get<{ fields: SportFieldWithOptions[] }>(`/sports/${sportId}/fields/?section=MATCH`);
      return data.fields.filter((f) => !f.isComputed);
    } catch {
      return [];
    }
  },
};
