import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import type { AdminLoginPayload, AdminLoginResponse, AdminRefreshResponse, AdminVerifyResponse } from "../types/admin-auth.types";
import { useAdminAuthStore } from "../auth/admin-auth.store";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export const adminApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAdminAccessToken(): Promise<string | null> {
  try {
    const res = await axios.post<AdminRefreshResponse>(
      `${BASE_URL}/admin/token/refresh/`,
      {},
      { withCredentials: true },
    );
    const token = res.data.accessToken;
    useAdminAuthStore.getState().setAccessToken(token);
    return token;
  } catch {
    useAdminAuthStore.getState().clear();
    if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
      window.location.href = "/admin/login";
    }
    return null;
  }
}

adminApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAdminAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.withCredentials = true;
  return config;
});

adminApi.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;
    const status = error.response?.status;
    const isAuthEndpoint =
      original?.url?.includes("/admin/token/refresh") ||
      original?.url?.includes("/admin/token/logout");

    if (status === 401 && original && !original._retry && !isAuthEndpoint) {
      original._retry = true;
      refreshPromise ??= refreshAdminAccessToken().finally(() => {
        refreshPromise = null;
      });
      const newToken = await refreshPromise;
      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return adminApi(original);
      }
    }
    return Promise.reject(error);
  },
);

export const adminAuthApi = {
  login: async (payload: AdminLoginPayload) => {
    const res = await adminApi.post<AdminLoginResponse>("/admin/token/", payload);
    return res.data;
  },
  verifySession: async () => {
    const res = await adminApi.get<AdminVerifyResponse>("/admin/token/verify/");
    return res.data;
  },
  logout: async () => {
    const res = await adminApi.post<{ message: string }>("/admin/token/logout/");
    return res.data;
  },
};

export function extractAdminApiError(err: unknown, fallback = "Something went wrong"): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as
      | { message?: string; detail?: string; error?: string }
      | undefined;
    return data?.message ?? data?.detail ?? data?.error ?? err.message;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}
