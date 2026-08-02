import { useMutation } from "@tanstack/react-query";
import { useAdminAuthStore } from "../auth/admin-auth.store";
import type { AdminLoginPayload } from "../types/admin-auth.types";
import { toast } from "sonner";
import { adminAuthApi, extractAdminApiError } from "../api/admin-auth.api";


export function useAdminLogin() {
  const setSession = useAdminAuthStore((s) => s.setSession);
  const setHasVerified = useAdminAuthStore((s) => s.setHasVerified);

  return useMutation({
    mutationFn: (payload: AdminLoginPayload) => adminAuthApi.login(payload),
    onSuccess: (data) => {
      setSession({ admin: data.admin, accessToken: data.accessToken });
      setHasVerified(true);
      toast.success(`Welcome back, ${data.admin.username}`);
    },
    onError: (err) => {
      toast.error(extractAdminApiError(err, "Sign in failed"));
    },
  });
}