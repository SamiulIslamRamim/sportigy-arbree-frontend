import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "#/components/ui/card";
import { ConfirmDeleteDialog } from "#/features/admin/components/sport/ConfirmDeleteDialog";
import { SportFormDialog } from "#/features/admin/components/sport/SportFormDialog";
import { useCreateSport, useDeleteSport, useSports, useUpdateSport } from "#/features/admin/hooks/useAdminSport";
import type { AdminSport, SportPayload } from "#/features/admin/types/admin-sport.types";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";


export const Route = createFileRoute("/admin/_authed/sports/")({
  head: () => ({
    meta: [
      { title: "Manage Sports — Spotig Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminSportsPage,
});

function AdminSportsPage() {
  const { data: sports, isLoading } = useSports();
  const create = useCreateSport();
  const update = useUpdateSport();
  const remove = useDeleteSport();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminSport | null>(null);
  const [deleting, setDeleting] = useState<AdminSport | null>(null);

  const handleSubmit = (payload: SportPayload) => {
    if (editing) {
      update.mutate(
        { sportId: editing.id, payload },
        { onSuccess: () => setDialogOpen(false) },
      );
    } else {
      create.mutate(payload, { onSuccess: () => setDialogOpen(false) });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Manage Sports</h1>
          <p className="text-sm text-muted-foreground">
            Define sports and configure their categories, metrics and dynamic fields.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add sport
        </Button>
      </div>

      {isLoading ? (
        <div className="flex min-h-[30vh] items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : !sports?.length ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            No sports configured yet. Create your first sport to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sports.map((sport) => (
            <Card key={sport.id} className="flex flex-col">
              <CardHeader className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{sport.name}</CardTitle>
                  <Badge variant={sport.isActive ? "default" : "secondary"}>
                    {sport.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {sport.description || sport.slug}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto flex items-center gap-2">
                <Button asChild size="sm" variant="secondary">
                  <Link to="/admin/sports/$sportId" params={{ sportId: sport.id }}>
                    Configure
                  </Link>
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setEditing(sport);
                    setDialogOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setDeleting(sport)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <SportFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        sport={editing}
        isPending={create.isPending || update.isPending}
        onSubmit={handleSubmit}
      />

      <ConfirmDeleteDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete ${deleting?.name ?? "sport"}?`}
        description="This removes the sport along with its categories, metrics and fields."
        onConfirm={() => {
          if (deleting) remove.mutate(deleting.id);
          setDeleting(null);
        }}
      />
    </div>
  );
}
