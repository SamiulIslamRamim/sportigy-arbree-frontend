import { useAdminAuthStore } from '#/features/admin/auth/admin-auth.store';
import { AdminLayout } from '#/features/admin/components/AdminLayout';
import { useAdminVerifySession } from '#/features/admin/hooks/useAdminVerifySession';
import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';


export const Route = createFileRoute("/admin/_authed")({
  ssr: false,
  component: AdminAuthedLayout,
});

function AdminAuthedLayout() {
  const navigate = useNavigate();
  const { hasVerified, isVerifying } = useAdminVerifySession();
  const isAuthenticated = useAdminAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (hasVerified && !isAuthenticated) {
      navigate({ to: "/admin/login", replace: true });
    }
  }, [hasVerified, isAuthenticated, navigate]);

  if (!hasVerified || isVerifying || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}