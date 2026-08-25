import { adminApi } from "./admin-auth.api";
import { unwrap, type ApiEnvelope } from "#/lib/api/axios";
import type { MutationResult } from "./admin-sport.api";
import type { MatchSubmission } from "../types/admin-match.types";

export interface RejectMatchPayload {
  reason: string;
}

export const adminMatchApi = {
  list: async (): Promise<MatchSubmission[]> => {
    const res = await adminApi.get<
      ApiEnvelope<{ submissions: MatchSubmission[] }>
    >(`/admin/matches/`);

    return unwrap(res).submissions ?? [];
  },

  approve: async (
    matchId: string,
  ): Promise<MutationResult<MatchSubmission>> => {
    const res = await adminApi.patch<
      ApiEnvelope<{ submission: MatchSubmission }>
    >(`/admin/matches/${matchId}/approve/`);

    const data = unwrap(res);

    return {
      data: data.submission,
      message: res.data.message ?? "Match approved successfully.",
    };
  },

  reject: async (
    matchId: string,
    payload: RejectMatchPayload,
  ): Promise<MutationResult<MatchSubmission>> => {
    const res = await adminApi.patch<
      ApiEnvelope<{ submission: MatchSubmission }>
    >(`/admin/matches/${matchId}/reject/`, payload);

    const data = unwrap(res);

    return {
      data: data.submission,
      message: res.data.message ?? "Match rejected successfully.",
    };
  },
};