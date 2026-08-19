import { adminApi } from "./admin-auth.api";
import type { AdminMatchDetail, AdminMatchListRow } from "../types/admin-match.types";
import type { ApprovalStatus } from "#/features/player/types";

export const adminMatchApi = {
  list: async (status?: ApprovalStatus): Promise<AdminMatchListRow[]> => {
    const q = status ? `?status=${status}` : "";
    const { data } = await adminApi.get<{ submissions: AdminMatchListRow[] }>(`/admin/matches/${q}`);
    return data.submissions;
  },
  get: async (matchId: string): Promise<AdminMatchDetail> => {
    const { data } = await adminApi.get<{ submission: AdminMatchDetail }>(`/admin/matches/${matchId}/`);
    return data.submission;
  },
  approve: async (matchId: string): Promise<AdminMatchDetail> => {
    const { data } = await adminApi.patch<{ submission: AdminMatchDetail }>(`/admin/matches/${matchId}/approve/`);
    return data.submission;
  },
  reject: async (matchId: string, reason: string): Promise<AdminMatchDetail> => {
    const { data } = await adminApi.patch<{ submission: AdminMatchDetail }>(`/admin/matches/${matchId}/reject/`, { reason });
    return data.submission;
  },
};
