import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

import { useAuthStore } from "@/features/auth/store/auth.store";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});


// ─── Request Interceptor ────────────────────────────────────────────
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response Interceptor — Auto-refresh on 401 ─────────────────────
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  try {

    const res = await axios.post(
      `${BASE_URL}/token/refresh/`,
      {},                         // Empty body
      { withCredentials: true }, 
    );
    const newAccess: string = res.data.accessToken ?? res.data.access;
    useAuthStore.getState().setAccessTokens(newAccess);
    return newAccess;
  } catch {
    // Refresh failed — clear state and redirect to login
    useAuthStore.getState().logout();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }
}






api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;
    const status = error.response?.status;
    const isAuthEndpoint =
      original?.url?.includes("/token/") ||
      original?.url?.includes("/forgot-password") ||
      original?.url?.includes("/reset-password") ||
      original?.url?.includes("/logout");

    if (status === 401 && original && !original._retry && !isAuthEndpoint) {
      original._retry = true;
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
      const newToken = await refreshPromise;
      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      }
    }
    return Promise.reject(error);
  },
);


export function extractApiError(err: unknown, fallback = "Something went wrong"): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as
      | { message?: string; detail?: string; error?: string }
      | undefined;
    return data?.message ?? data?.detail ?? data?.error ?? err.message;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}