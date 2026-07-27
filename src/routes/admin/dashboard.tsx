import { Button } from '#/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card';
import { useAdminLogout } from '#/features/auth/hooks/admin-auth.hooks';
import { useAuthStore } from '#/features/auth/store/auth.store';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { LogOut, ShieldCheck } from 'lucide-react';

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin dashboard — Spotig" },
      {
        name: "description",
        content: "Administrator control panel for the Spotig platform.",
      },
      { property: "og:title", content: "Admin dashboard — Spotig" },
      {
        property: "og:description",
        content: "Administrator control panel for the Spotig platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const user = useAuthStore((s) => s.user);
  const logout = useAdminLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/admin/login" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/40 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="inline-flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <span className="font-display text-xl tracking-wider">SPOTIG ADMIN</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10">
          <p className="text-sm text-muted-foreground">Admin Dashboard</p>
          <h1 className="font-display text-4xl md:text-5xl">
            Welcome <span className="text-primary">{user?.username ?? "Admin"}</span>
          </h1>
        </div>

        <Card className="border-border/60">
          <CardHeader>
            <CardTitle>Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            This page is only accessible to authenticated admins.
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
