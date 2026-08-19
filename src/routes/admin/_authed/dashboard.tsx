import { SportsManagement } from "#/features/admin/components/SportsManagement";
import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";

export const Route = createFileRoute("/admin/_authed/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Spotig" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl">Admin overview</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Link to="/admin/sports">
          <Card className="transition-colors hover:bg-muted/40">
            <CardHeader>
              <CardTitle>Sports builder</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">Create sports, categories, fields, and metrics.</CardContent>
          </Card>
        </Link>
        <Link to="/admin/matches">
          <Card className="transition-colors hover:bg-muted/40">
            <CardHeader>
              <CardTitle>Match review</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">Approve or reject player match submissions.</CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
