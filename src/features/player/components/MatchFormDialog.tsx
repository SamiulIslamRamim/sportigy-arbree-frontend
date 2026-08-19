import { Button } from "#/components/ui/button";
import { Checkbox } from "#/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";
import { Textarea } from "#/components/ui/textarea";
import { useCategories } from "#/hooks/categories.hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { playerMatchApi } from "../api/match.api";
import { useCreateMatch, useUpdateMatch } from "../hooks/usePlayerMatchMutations";
import { buildMatchFormSchema, type MatchFormValues } from "../lib/buildMatchFormSchema";
import type { CreateMatchInput, MatchFieldValueInput, PlayerMatch, SportFieldWithOptions, TeamSlot } from "../types";
import { FieldComponents } from "./FieldRegistry";
import { TeamOrgInput } from "./TeamOrgInput";

function teamSlot(name?: string, orgId?: string): TeamSlot | undefined {
  if (orgId) return { orgId };
  if (name?.trim()) return { name: name.trim() };
  return undefined;
}

function packValues(fields: SportFieldWithOptions[], values: Record<string, unknown> | undefined): MatchFieldValueInput[] {
  if (!values) return [];
  return fields.flatMap((field) => {
    const raw = values[field.id];
    if (raw === undefined || raw === "" || raw === null) return [];
    if (field.type === "NUMBER") return [{ fieldId: field.id, valueNumber: Number(raw) }];
    if (field.type === "TEXT") return [{ fieldId: field.id, valueText: String(raw) }];
    if (field.type === "BOOLEAN") return [{ fieldId: field.id, valueBoolean: Boolean(raw) }];
    if (field.type === "DATE") return [{ fieldId: field.id, valueDate: String(raw) }];
    return [{ fieldId: field.id, optionId: String(raw) }];
  });
}

export function MatchFormDialog({
  open,
  onOpenChange,
  match,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  match?: PlayerMatch | null;
}) {
  const { data: sports = [] } = useCategories();
  const [sportId, setSportId] = useState(match?.sportId ?? "");
  const fieldsQuery = useQuery({
    queryKey: ["match-fields", sportId],
    queryFn: () => playerMatchApi.getMatchFields(sportId),
    enabled: !!sportId && open,
  });
  const fields = fieldsQuery.data ?? [];
  const schema = useMemo(() => buildMatchFormSchema(fields), [fields]);
  const create = useCreateMatch();
  const update = useUpdateMatch();

  const form = useForm<MatchFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      matchDate: match?.matchDate?.slice(0, 10) ?? "",
      result: match?.result ?? "WIN",
      playerSide: match?.playerSide ?? undefined,
      venue: match?.venue ?? "",
      homeTeam: match?.homeTeam ?? "",
      homeTeamOrgId: match?.homeTeamOrgId ?? undefined,
      awayTeam: match?.awayTeam ?? "",
      awayTeamOrgId: match?.awayTeamOrgId ?? undefined,
      isCaptain: match?.isCaptain ?? false,
      isSubstitute: match?.isSubstitute ?? false,
      notes: match?.notes ?? "",
      values: {},
    },
  });

  useEffect(() => {
    if (!open) return;
    setSportId(match?.sportId ?? "");
    form.reset({
      matchDate: match?.matchDate?.slice(0, 10) ?? "",
      result: match?.result ?? "WIN",
      playerSide: match?.playerSide ?? undefined,
      venue: match?.venue ?? "",
      homeTeam: match?.homeTeam ?? "",
      homeTeamOrgId: match?.homeTeamOrgId ?? undefined,
      awayTeam: match?.awayTeam ?? "",
      awayTeamOrgId: match?.awayTeamOrgId ?? undefined,
      isCaptain: match?.isCaptain ?? false,
      isSubstitute: match?.isSubstitute ?? false,
      notes: match?.notes ?? "",
      values: {},
    });
  }, [open, match, form]);

  const submitting = create.isPending || update.isPending;

  const onSubmit = form.handleSubmit((values) => {
    if (!sportId) return;
    const payload: CreateMatchInput = {
      sportId,
      matchDate: values.matchDate,
      result: values.result,
      playerSide: values.playerSide ?? "HOME",
      venue: values.venue || undefined,
      homeTeam: teamSlot(values.homeTeam, values.homeTeamOrgId),
      awayTeam: teamSlot(values.awayTeam, values.awayTeamOrgId),
      isCaptain: values.isCaptain,
      isSubstitute: values.isSubstitute,
      notes: values.notes || undefined,
      values: packValues(fields, values.values),
    };
    if (match) {
      update.mutate(
        { matchId: match.id, input: payload },
        { onSuccess: () => onOpenChange(false) },
      );
    } else {
      create.mutate(payload, { onSuccess: () => onOpenChange(false) });
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{match ? "Edit match" : "Add match"}</DialogTitle>
          <DialogDescription>Self-report a match. Stats fields appear after you pick a sport.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Sport</FieldLabel>
              <Select value={sportId} onValueChange={setSportId} disabled={!!match}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a sport" />
                </SelectTrigger>
                <SelectContent>
                  {sports.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Controller
              name="matchDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="matchDate">Match date</FieldLabel>
                  <Input {...field} id="matchDate" type="date" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="result"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Result</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(["WIN", "LOSS", "DRAW", "TIE", "NO_RESULT"] as const).map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="playerSide"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Your side</FieldLabel>
                  <Select value={field.value ?? ""} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Home or away" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HOME">Home</SelectItem>
                      <SelectItem value="AWAY">Away</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="venue"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="venue">Venue</FieldLabel>
                  <Input {...field} id="venue" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="homeTeam"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Home team</FieldLabel>
                  <TeamOrgInput
                    name={field.value ?? ""}
                    orgId={form.watch("homeTeamOrgId")}
                    onChange={({ name, orgId }) => {
                      field.onChange(name);
                      form.setValue("homeTeamOrgId", orgId);
                    }}
                    placeholder="Search org or type a name"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="awayTeam"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Away team</FieldLabel>
                  <TeamOrgInput
                    name={field.value ?? ""}
                    orgId={form.watch("awayTeamOrgId")}
                    onChange={({ name, orgId }) => {
                      field.onChange(name);
                      form.setValue("awayTeamOrgId", orgId);
                    }}
                    placeholder="Search org or type a name"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="isCaptain"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox checked={!!field.value} onCheckedChange={(c) => field.onChange(!!c)} />
                    Captain
                  </label>
                </Field>
              )}
            />
            <Controller
              name="isSubstitute"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox checked={!!field.value} onCheckedChange={(c) => field.onChange(!!c)} />
                    Substitute
                  </label>
                </Field>
              )}
            />
            <Controller
              name="notes"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="notes">Notes</FieldLabel>
                  <Textarea {...field} id="notes" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          {sportId && fieldsQuery.isFetched && fields.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Match stat fields are not available yet. You can still submit the match header.
            </p>
          ) : null}

          <div className="grid gap-3 md:grid-cols-2">
            {fields.map((field) => {
              const Comp = FieldComponents[field.type];
              return (
                <Controller
                  key={field.id}
                  name={`values.${field.id}` as never}
                  control={form.control}
                  render={({ field: rhf, fieldState }) => (
                    <Comp
                      field={field}
                      value={{ fieldId: field.id, ...(typeof rhf.value === "object" && rhf.value ? rhf.value : { optionId: String(rhf.value ?? "") }) }}
                      onChange={(next) => rhf.onChange(next.optionId ?? next.valueNumber ?? next.valueText ?? next.valueBoolean ?? next.valueDate)}
                      error={fieldState.error?.message}
                    />
                  )}
                />
              );
            })}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting || !sportId}>
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {match ? "Save" : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
