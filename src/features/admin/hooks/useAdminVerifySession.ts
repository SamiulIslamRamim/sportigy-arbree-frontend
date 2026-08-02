import { useEffect } from "react";
import { adminAuthApi } from "../api/admin-auth.api";
import { useAdminAuthStore } from "../auth/admin-auth.store";


let inflight: Promise<void> | null = null;

export function verifyAdminSession(): Promise<void> {
  if (inflight) return inflight;
  const store = useAdminAuthStore.getState();
  store.setVerifying(true);
  inflight = adminAuthApi
    .verifySession()
    .then((data) => {
      useAdminAuthStore
        .getState()
        .setSession({ admin: data.admin, accessToken: data.accessToken });
    })
    .catch(() => {
      useAdminAuthStore.getState().clear();
    })
    .finally(() => {
      useAdminAuthStore.getState().setVerifying(false);
      useAdminAuthStore.getState().setHasVerified(true);
      inflight = null;
    });
  return inflight;
}

export function useAdminVerifySession() {
  const hasVerified = useAdminAuthStore((s) => s.hasVerified);
  const isVerifying = useAdminAuthStore((s) => s.isVerifying);
  const isAuthenticated = useAdminAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!hasVerified && !isVerifying) {
      void verifyAdminSession();
    }
  }, [hasVerified, isVerifying]);

  return { isAuthenticated, isVerifying, hasVerified };
}