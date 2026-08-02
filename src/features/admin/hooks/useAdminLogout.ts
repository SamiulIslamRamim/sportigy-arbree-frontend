import { useNavigate } from "@tanstack/react-router";
import { useAdminAuthStore } from "../auth/admin-auth.store";
import { adminAuthApi } from "../api/admin-auth.api";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

export function useAdminLogout() {
  const clear = useAdminAuthStore((s) => s.clear);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => adminAuthApi.logout(),
    onSettled: () => {
      clear();
      navigate({ to: "/admin/login" });
    },
    onSuccess: (data) => {
      toast.success(data?.message ?? "Logged out successfully.");
    },
  });
}
