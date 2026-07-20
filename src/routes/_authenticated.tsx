import { authApi } from '#/features/auth/api/auth.api';
import { useAuthStore } from '#/features/auth/store/auth.store';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated')({
  ssr: false,
// In your route definition
beforeLoad: async ({ location }) => {
  const { isAuthenticated } = useAuthStore.getState();

  if (!isAuthenticated) {
    // Option A: Try to restore session before redirecting
    try {
      const data = await authApi.verifySession();
      useAuthStore.getState().setSession({
        access: data.accessToken,
        user: data.user,
      });
      // Continue to the protected route
      return;
    } catch {
throw redirect({ 
        to: '/login',
        search: { redirect: location.href }, // Preserves post-login target
      });
    }
  }
},
  component: () => <Outlet />,
});