import { Link, Outlet, createRootRoute, useRouter } from '@tanstack/react-router'
import { QueryClientProvider } from "@tanstack/react-query";
import '../styles.css'
import { useEffect } from 'react'
import { reportCustomError } from '#/lib/error-reporting'
import useCustomQueryClient from '#/hooks/useQueryClient';
import { Toaster } from '#/components/ui/sonner';
import { useAuthStore } from '#/features/auth/store/auth.store';
import { authApi } from '#/features/auth/api/auth.api';


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}


function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportCustomError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent, 
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
})




function RootComponent() {
    const setSession = useAuthStore((s) => s.setSession);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    // Only attempt to restore session if we don't already have one
    if (!isAuthenticated) {
      authApi.verifySession()
        .then((data) => {
          setSession({ access: data.accessToken, user: data.user });
        })
        .catch(() => {
          // No valid session — user stays logged out
        });
    }
  }, []); 
  return (
    <>
    
    <QueryClientProvider client={useCustomQueryClient}>

      <Outlet />
      <Toaster richColors position="top-right" />
      {/* <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'TanStack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      /> */}
    </QueryClientProvider>
    </>
  )
}
