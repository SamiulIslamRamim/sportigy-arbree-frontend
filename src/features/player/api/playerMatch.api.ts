import { api } from "@/lib/api/axios";
import type {
  ApprovalStatus,
  CreateMatchPayload,
  PlayerMatch,
  PlayerSportCategoryLite,
  PlayerSportField,
  PlayerSportProfileSummary,
} from "../types/match.types";

function pick<T>(payload: unknown, keys: string[]): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    for (const key of keys) {
      if (Array.isArray(record[key])) return record[key] as T[];
    }
    // fall back to a single nested "data"/"results" envelope
    for (const key of ["data", "results", "items"]) {
      const nested = record[key];
      if (nested && typeof nested === "object") {
        const found = pick<T>(nested, keys);
        if (found.length) return found;
      }
    }
  }
  return [];
}

function unwrapMatch(payload: { submission?: PlayerMatch } | PlayerMatch): PlayerMatch {
  if (payload && typeof payload === "object" && "submission" in payload && payload.submission) {
    return payload.submission;
  }
  return payload as PlayerMatch;
}

const listPath: Record<ApprovalStatus, string> = {
  APPROVED: "/matches/approved/",
  PENDING: "/matches/pending/",
  REJECTED: "/matches/rejected/",
};

export const playerMatchApi = {
  listSportProfiles: async (): Promise<PlayerSportProfileSummary[]> => {
    const res = await api.get("/player/sport-profiles");
    return pick<PlayerSportProfileSummary>(res.data, ["profiles", "sportProfiles"]);
  },

  listSportFields: async (sportId: string): Promise<PlayerSportField[]> => {
    const res = await api.get(`/player/sports/${sportId}/fields/`, {
      params: { section: "MATCH" },
    });
    return pick<PlayerSportField>(res.data, ["fields"]);
  },

  listSportCategories: async (sportId: string): Promise<PlayerSportCategoryLite[]> => {
    const res = await api.get(`/player/sports/${sportId}/categories/`);
    return pick<PlayerSportCategoryLite>(res.data, ["categories"]);
  },

  listMatches: async (status?: ApprovalStatus): Promise<PlayerMatch[]> => {
    const res = await api.get(status ? `/player${listPath[status]}` : "/player/matches/");
    return pick<PlayerMatch>(res.data, ["submissions", "matches"]);
  },

  createMatch: async (payload: CreateMatchPayload): Promise<PlayerMatch> => {
    const res = await api.post<{ submission?: PlayerMatch } | PlayerMatch>(
      "/player/matches/",
      payload,
    );
    return unwrapMatch(res.data);
  },

  updateMatch: async (
    matchId: string,
    payload: Partial<CreateMatchPayload>,
  ): Promise<PlayerMatch> => {
    const res = await api.patch<{ submission?: PlayerMatch } | PlayerMatch>(
      `/player/matches/${matchId}/`,
      payload,
    );
    return unwrapMatch(res.data);
  },

  deleteMatch: async (matchId: string): Promise<string> => {
    await api.delete(`/player/matches/${matchId}/`);
    return matchId;
  },
};
