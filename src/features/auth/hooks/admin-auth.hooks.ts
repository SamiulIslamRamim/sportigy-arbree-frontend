import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth.store";
import { extractApiError } from "#/lib/api/axios";
import type { AdminLoginPayload } from "../types/auth.types";
import { adminAuthApi } from "../api/admin-auth.api";
import { toast } from "sonner";




export function useAdminLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: (payload: AdminLoginPayload) => adminAuthApi.login(payload),
    onSuccess: (data) => {
      setSession({
        access: data.access,
        user: data.admin ?? null,
      });
      toast.success("Welcome back, admin");
    },
    onError: (err) => toast.error(extractApiError(err, "Admin login failed")),
  });
}

export function useAdminLogout() {
  const logout = useAuthStore((s) => s.logout);
  return async () => {
    try {
      await adminAuthApi.logout();
    } catch {
      /* ignore — clear the local session regardless */
    }
    logout();
    toast.success("Signed out");
  };
}
