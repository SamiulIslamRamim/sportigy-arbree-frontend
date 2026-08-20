import type { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import type { AdminLoginPayload, AdminLoginResponse, AdminVerifyResponse } from "../types/admin-auth.types";
import { useAdminAuthStore } from "../auth/admin-auth.store";
import { unwrap } from "@/lib/api/axios";
import type { ApiEnvelope } from "@/lib/api/axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export const adminApi: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAdminAccessToken(): Promise<string | null> {
  try {
    const res = await axios.post<ApiEnvelope<{ accessToken?: string }>>(
      `${BASE_URL}/admin/token/refresh/`,
      {},
      { withCredentials: true },
    );
    const token = res.data.data.accessToken;
    if (!token) {
      throw new Error("No access token in refresh response");
    }
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
  if (token) {
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
    const res = await adminApi.post<ApiEnvelope<AdminLoginResponse>>("/admin/token/", payload);
    return unwrap(res);
  },
  verifySession: async () => {
    const res = await adminApi.get<ApiEnvelope<AdminVerifyResponse>>("/admin/token/verify/");
    return unwrap(res);
  },
  logout: async () => {
    const res = await adminApi.post<ApiEnvelope<{ message: string }>>("/admin/logout");
    return unwrap(res);
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
