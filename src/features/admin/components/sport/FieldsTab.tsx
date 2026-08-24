import { useMemo, useState } from "react";
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
import { ConfirmDeleteDialog } from "./ConfirmDeleteDialog";
import { FIELD_TYPE_LABELS} from "../../types/admin-sport.types";
import type { AdminSportField, FieldPayload, FieldSection } from "../../types/admin-sport.types";
import { useCreateSportField, useDeleteSportField, useSportFields, useSportMetrics, useUpdateSportField } from "../../hooks/useAdminSport";
import { FieldFormDialog } from "./FieldFormDialog";

export function FieldsTab({
  sportId,
  section,
}: {
  sportId: string;
  section: FieldSection;
}) {
  const { data: fields, isLoading } = useSportFields(sportId, section);
  const { data: allFields } = useSportFields(sportId);
  const { data: metrics } = useSportMetrics(sportId);
  const create = useCreateSportField(sportId);
  const update = useUpdateSportField(sportId);
  const remove = useDeleteSportField(sportId);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AdminSportField | null>(null);
  const [deleting, setDeleting] = useState<AdminSportField | null>(null);

  const numberFields = useMemo(
    () => (allFields ?? []).filter((f) => f.type === "NUMBER"),
    [allFields],
  );

  const sorted = useMemo(
    () =>
      [...(fields ?? [])].sort(
        (a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name),
      ),
    [fields],
  );

  const handleSubmit = (payload: FieldPayload) => {
    if (editing) {
      update.mutate(
        { fieldId: editing.id, payload },
        { onSuccess: () => setDialogOpen(false) },
      );
    } else {
      create.mutate(payload, { onSuccess: () => setDialogOpen(false) });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {section === "PROFILE"
            ? "Profile fields appear on player profiles for this sport."
            : "Match fields are captured per match, including computed statistics."}
        </p>
        <Button
          size="sm"
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add field
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Metric</TableHead>
              <TableHead>Flags</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            )}
            {!isLoading && !sorted.length && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-sm text-muted-foreground">
                  No {section.toLowerCase()} fields yet.
                </TableCell>
              </TableRow>
            )}
            {sorted.map((field) => (
              <TableRow key={field.id}>
                <TableCell className="font-medium">
                  {field.name}
                  {field.isComputed && (
                    <Badge variant="outline" className="ml-2">
                      Computed
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">{field.slug}</TableCell>
                <TableCell>{FIELD_TYPE_LABELS[field.type]}</TableCell>
                <TableCell className="text-muted-foreground">
                  {field.metric?.name ?? "--"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {field.required && <Badge variant="secondary">Required</Badge>}
                    {field.searchable && <Badge variant="secondary">Search</Badge>}
                    {field.filterable && <Badge variant="secondary">Filter</Badge>}
                    {field.sortable && <Badge variant="secondary">Sort</Badge>}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={field.isActive ? "default" : "secondary"}>
                    {field.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditing(field);
                      setDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleting(field)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <FieldFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        field={editing}
        metrics={metrics ?? []}
        numberFields={numberFields}
        isPending={create.isPending || update.isPending}
        onSubmit={handleSubmit}
      />

      <ConfirmDeleteDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete ${deleting?.name ?? "field"}?`}
        description="Deleting a field removes its options and formula components."
        onConfirm={() => {
          if (deleting) remove.mutate(deleting.id);
          setDeleting(null);
        }}
      />
    </div>
  );
}
