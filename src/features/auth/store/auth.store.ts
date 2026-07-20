import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { AuthUser } from '../types/auth.types'

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  isAuthenticated: boolean
  setSession: (data: { user?: AuthUser | null; access: string }) => void
  setAccessTokens: (token: string | null) => void
  setUser: (user: AuthUser | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setSession: (data) =>
        set({
          user: data.user ?? null,
          accessToken: data.access,
          isAuthenticated: true,
        }),
      setAccessTokens: (token) =>
        set({ accessToken: token, isAuthenticated: token !== null, }),
      setUser: (user) => set({ user }),
      logout: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        }),
    }),
)
