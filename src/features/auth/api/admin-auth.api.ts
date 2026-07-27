import { api } from "#/lib/api/axios";
import type { AdminLoginPayload, AdminLoginResponse } from "../types/auth.types";







export const adminAuthApi = {
  login: async (payload: AdminLoginPayload): Promise<AdminLoginResponse> => {
    const { data } = await api.post<AdminLoginResponse>(
      "/admin/token/",
      { username: payload.username, password: payload.password },
      { withCredentials: true },
    );
    return data;
  },
  refresh: async (): Promise<AdminLoginResponse> => {
    const { data } = await api.post<AdminLoginResponse>(
      "/admin/token/refresh/",
      {},
      { withCredentials: true },
    );
    return data;
  },
  verify: async () => {
    const { data } = await api.get("/admin/token/verify/", {
      withCredentials: true,
    });
    return data;
  },
  logout: async () => {
    const { data } = await api.post(
      "/admin/token/logout/",
      {},
      { withCredentials: true },
    );
    return data;
  },
};
