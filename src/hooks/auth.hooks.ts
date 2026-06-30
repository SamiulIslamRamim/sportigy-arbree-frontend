import { useMutation } from "@tanstack/react-query";
import { extractApiError } from "@/lib/api/axios";
import { toast } from "sonner";

import { useAuthStore } from "#/features/auth/store/auth.store";
import { authApi } from "#/features/auth/api/auth.api";
import type { ForgotPasswordPayload, LoginPayload, OrganizationRegistrationPayload, PlayerRegistrationPayload, ResetPasswordPayload, VerifyOtpPayload } from "#/features/auth/types/auth.types";

export function useLogin() {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => {
      setSession({ access: data.access, refresh: data.refresh, user: data.user });
      toast.success("Welcome back");
    },
    onError: (err) => toast.error(extractApiError(err, "Login failed")),
  });
}

export function useRegisterPlayer() {
  return useMutation({
    mutationFn: (payload: PlayerRegistrationPayload) =>
      authApi.registerPlayer(payload),
    onError: (err) => toast.error(extractApiError(err, "Registration failed")),
  });
}

export function useRegisterOrganization() {
  return useMutation({
    mutationFn: (payload: OrganizationRegistrationPayload) =>
      authApi.registerOrganization(payload),
    onError: (err) => toast.error(extractApiError(err, "Registration failed")),
  });
}

export function useVerifyOtp() {
  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => authApi.verifyOtp(payload),
    onError: (err) => toast.error(extractApiError(err, "Verification failed")),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) => authApi.forgotPassword(payload),
    onError: (err) => toast.error(extractApiError(err, "Request failed")),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) => authApi.resetPassword(payload),
    onError: (err) => toast.error(extractApiError(err, "Reset failed")),
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  return () => {
    logout();
    toast.success("Signed out");
  };
}
