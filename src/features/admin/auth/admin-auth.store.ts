import { create } from "zustand";
import type { AdminUser } from "../types/admin-auth.types";


interface AdminAuthState {
  admin: AdminUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isVerifying: boolean;
  hasVerified: boolean;
  setSession: (data: { admin: AdminUser; accessToken: string }) => void;
  setAccessToken: (token: string) => void;
  setAdmin: (admin: AdminUser | null) => void;
  setVerifying: (v: boolean) => void;
  setHasVerified: (v: boolean) => void;
  clear: () => void;
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  admin: null,
  accessToken: null,
  isAuthenticated: false,
  isVerifying: false,
  hasVerified: false,
  setSession: ({ admin, accessToken }) =>
    set({ admin, accessToken, isAuthenticated: true }),
  setAccessToken: (accessToken) =>
    set((s) => ({ accessToken, isAuthenticated: !!s.admin || !!accessToken })),
  setAdmin: (admin) => set({ admin }),
  setVerifying: (isVerifying) => set({ isVerifying }),
  setHasVerified: (hasVerified) => set({ hasVerified }),
  clear: () =>
    set({
      admin: null,
      accessToken: null,
      isAuthenticated: false,
      hasVerified: true,
    }),
}));