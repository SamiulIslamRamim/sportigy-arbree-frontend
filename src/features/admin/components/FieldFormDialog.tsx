import { Button } from "#/components/ui/button";
import { Checkbox } from "#/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "#/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateField } from "../hooks/useAdminSports";
import type { AdminSportDetail, FieldSection, FieldType, FormulaRole } from "../types/admin-sport.types";

const schema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    section: z.enum(["PROFILE", "MATCH"]),
    type: z.enum(["SELECT", "MULTI_SELECT", "NUMBER", "TEXT", "BOOLEAN", "DATE"]),
    required: z.boolean().optional(),
    displayOrder: z.coerce.number().int().min(0).optional(),
    metricId: z.string().optional(),
    isComputed: z.boolean().optional(),
    formulaMultiplier: z.coerce.number().optional(),
    formulaComponents: z.array(
      z.object({
        sourceFieldId: z.string().min(1),
        role: z.enum(["NUMERATOR", "DENOMINATOR"]),
      }),
    ),
    options: z.array(z.object({ label: z.string().trim().min(1) })),
  })
  .superRefine((data, ctx) => {
    if (data.isComputed) {
      if (data.type !== "NUMBER") ctx.addIssue({ code: "custom", path: ["type"], message: "Computed fields must be NUMBER" });
      if (data.section !== "MATCH") ctx.addIssue({ code: "custom", path: ["section"], message: "Computed fields must be MATCH" });
      if (data.required) ctx.addIssue({ code: "custom", path: ["required"], message: "Computed fields cannot be required" });
      const nums = data.formulaComponents.filter((c) => c.role === "NUMERATOR");
      const dens = data.formulaComponents.filter((c) => c.role === "DENOMINATOR");
      if (nums.length < 1 || dens.length < 1) {
        ctx.addIssue({ code: "custom", path: ["formulaComponents"], message: "Need at least one numerator and one denominator" });
      }
    }
  });

type Values = z.infer<typeof schema>;

export function FieldFormDialog({
  open,
  onOpenChange,
  sport,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sport: AdminSportDetail;
}) {
  const create = useCreateField(sport.id);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      section: "MATCH",
      type: "NUMBER",
      required: false,
      displayOrder: 0,
      metricId: "",
      isComputed: false,
      formulaMultiplier: 100,
      formulaComponents: [],
      options: [],
    },
  });
  const components = useFieldArray({ control: form.control, name: "formulaComponents" });
  const options = useFieldArray({ control: form.control, name: "options" });
  const isComputed = form.watch("isComputed");
  const type = form.watch("type");
  const rawNumberFields = sport.fields.filter((f) => f.section === "MATCH" && f.type === "NUMBER" && !f.isComputed);

  const onSubmit = form.handleSubmit((values) => {
    create.mutate(
      {
        name: values.name,
        section: values.section as FieldSection,
        type: values.type as FieldType,
        required: values.isComputed ? false : !!values.required,
        displayOrder: values.displayOrder,
        metricId: values.metricId || null,
        isComputed: values.isComputed,
        formulaMultiplier: values.isComputed ? values.formulaMultiplier : undefined,
        formulaComponents: values.isComputed
          ? values.formulaComponents.map((c) => ({ sourceFieldId: c.sourceFieldId, role: c.role as FormulaRole }))
          : undefined,
        options:
          values.type === "SELECT" || values.type === "MULTI_SELECT"
            ? values.options.map((o) => ({ label: o.label }))
            : undefined,
      },
      { onSuccess: () => onOpenChange(false) },
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create field</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="field-name">Name</FieldLabel>
                  <Input {...field} id="field-name" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="isComputed"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox
                      checked={!!field.value}
                      onCheckedChange={(c) => {
                        const on = !!c;
                        field.onChange(on);
                        if (on) {
                          form.setValue("type", "NUMBER");
                          form.setValue("section", "MATCH");
                          form.setValue("required", false);
                        }
                      }}
                    />
                    Computed MATCH field
                  </label>
                </Field>
              )}
            />
            <Controller
              name="section"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Section</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange} disabled={isComputed}>
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PROFILE">PROFILE</SelectItem>
                      <SelectItem value="MATCH">MATCH</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="type"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Type</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange} disabled={isComputed}>
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(["SELECT", "MULTI_SELECT", "NUMBER", "TEXT", "BOOLEAN", "DATE"] as FieldType[]).map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="required"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox checked={!!field.value} disabled={isComputed} onCheckedChange={(c) => field.onChange(!!c)} />
                    Required
                  </label>
                </Field>
              )}
            />
            <Controller
              name="metricId"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Metric</FieldLabel>
                  <Select value={field.value || "__none__"} onValueChange={(v) => field.onChange(v === "__none__" ? "" : v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">None</SelectItem>
                      {sport.metrics.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
          </FieldGroup>

          {isComputed ? (
            <div className="space-y-3 rounded-lg border p-3">
              <Controller
                name="formulaMultiplier"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Multiplier</FieldLabel>
                    <Input {...field} type="number" aria-invalid={fieldState.invalid} />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
              {components.fields.map((row, i) => (
                <div key={row.id} className="grid grid-cols-[1fr_140px_auto] gap-2">
                  <Controller
                    name={`formulaComponents.${i}.sourceFieldId`}
                    control={form.control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Source field" />
                        </SelectTrigger>
                        <SelectContent>
                          {rawNumberFields.map((f) => (
                            <SelectItem key={f.id} value={f.id}>
                              {f.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Controller
                    name={`formulaComponents.${i}.role`}
                    control={form.control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NUMERATOR">NUMERATOR</SelectItem>
                          <SelectItem value="DENOMINATOR">DENOMINATOR</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => components.remove(i)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => components.append({ sourceFieldId: "", role: "NUMERATOR" })}>
                Add component
              </Button>
              {form.formState.errors.formulaComponents?.root || form.formState.errors.formulaComponents?.message ? (
                <p className="text-sm text-destructive">
                  {form.formState.errors.formulaComponents.root?.message ?? form.formState.errors.formulaComponents.message}
                </p>
              ) : null}
            </div>
          ) : null}

          {type === "SELECT" || type === "MULTI_SELECT" ? (
            <div className="space-y-2 rounded-lg border p-3">
              <p className="text-sm font-medium">Options</p>
              {options.fields.map((row, i) => (
                <div key={row.id} className="flex gap-2">
                  <Controller
                    name={`options.${i}.label`}
                    control={form.control}
                    render={({ field }) => <Input {...field} placeholder="Label" />}
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => options.remove(i)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => options.append({ label: "" })}>
                <Plus className="mr-2 h-4 w-4" />
                Add option
              </Button>
            </div>
          ) : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Create
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
