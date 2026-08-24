import { useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCreateSportMetric, useDeleteSportMetric, useSportMetrics, useUpdateSportMetric } from "../../hooks/useAdminSport";
import type { AdminSportMetric } from "../../types/admin-sport.types";
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { SimpleEntityDialog } from "./SimpleEntryDialog";
import type { SimpleEntityValues } from "./SimpleEntryDialog";


export function MetricsTab({ sportId }: { sportId: string }) {
  const { data: metrics, isLoading } = useSportMetrics(sportId);
  const create = useCreateSportMetric(sportId);
  const update = useUpdateSportMetric(sportId);
  const remove = useDeleteSportMetric(sportId);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminSportMetric | null>(null);
  const [deleting, setDeleting] = useState<AdminSportMetric | null>(null);

  const handleSubmit = (values: SimpleEntityValues) => {
    const payload = {
      name: values.name,
      slug: values.slug,
      displayOrder: values.displayOrder ?? 0,
      isActive: values.isActive,
    };
    if (editing) {
      update.mutate({ metricId: editing.id, payload }, { onSuccess: () => setDialogOpen(false) });
    } else {
      create.mutate(payload, { onSuccess: () => setDialogOpen(false) });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Metrics group match fields, e.g. Batting, Bowling or Fielding.
        </p>
        <Button
          size="sm"
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add metric
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="w-28">Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !metrics?.length && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                  No metrics yet.
                </TableCell>
              </TableRow>
            )}
            {metrics?.map((metric) => (
              <TableRow key={metric.id}>
                <TableCell className="font-medium">{metric.name}</TableCell>
                <TableCell className="text-muted-foreground">{metric.slug}</TableCell>
                <TableCell>{metric.displayOrder}</TableCell>
                <TableCell>
                  <Badge variant={metric.isActive ? "default" : "secondary"}>
                    {metric.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditing(metric);
                      setDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleting(metric)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <SimpleEntityDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editing ? "Edit metric" : "Add metric"}
        withDisplayOrder
        initial={editing}
        isPending={create.isPending || update.isPending}
        onSubmit={handleSubmit}
      />

      <ConfirmDeleteDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete ${deleting?.name ?? "metric"}?`}
        onConfirm={() => {
          if (deleting) remove.mutate(deleting.id);
          setDeleting(null);
        }}
      />
    </div>
  );
}
