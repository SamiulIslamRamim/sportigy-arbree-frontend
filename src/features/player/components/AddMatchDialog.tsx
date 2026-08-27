import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MATCH_RESULT_LABELS, MATCH_RESULTS } from "../types/match.types";
import type { MatchFieldValuePayload, PlayerSportField } from "../types/match.types";
import { useCreateMatch, usePlayerSportProfiles, useSportCategories, useSportMatchFields } from "../hooks/usePlayerMatch";
import { matchBaseSchema } from "../schemas/match.schema";
import type { MatchBaseFormValues } from "../schemas/match.schema";

type DynamicValue = string | boolean | string[];

function buildValues(
  fields: PlayerSportField[],
  values: Record<string, DynamicValue>,
): MatchFieldValuePayload[] {
  const out: MatchFieldValuePayload[] = [];
  for (const field of fields) {
    const raw = values[field.id];
    if (raw === undefined || raw === "" || (Array.isArray(raw) && raw.length === 0)) continue;
    switch (field.type) {
      case "NUMBER": {
        const num = Number(raw);
        if (!Number.isFinite(num)) continue;
        out.push({ fieldId: field.id, valueNumber: num });
        break;
      }
      case "BOOLEAN":
        out.push({ fieldId: field.id, valueBoolean: Boolean(raw) });
        break;
      case "DATE":
        out.push({ fieldId: field.id, valueDate: String(raw) });
        break;
      case "SELECT":
        out.push({ fieldId: field.id, optionId: String(raw) });
        break;
      case "MULTI_SELECT":
        out.push({
          fieldId: field.id,
          valueText: (raw as string[]).join(","),
        });
        break;
      default:
        out.push({ fieldId: field.id, valueText: String(raw) });
    }
  }
  return out;
}

export function AddMatchDialog({
  presetSportId,
}: {
  presetSportId?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [dynamic, setDynamic] = useState<Record<string, DynamicValue>>({});

  const profiles = usePlayerSportProfiles();
  const createMatch = useCreateMatch();

  const form = useForm<MatchBaseFormValues>({
    resolver: zodResolver(matchBaseSchema),
    defaultValues: {
      sportId: "",
      matchDate: "",
      result: "WIN",
      isCaptain: false,
      isSubstitute: false,
    },
  });

  useEffect(() => {
    if (open && presetSportId) {
      form.setValue("sportId", presetSportId, { shouldValidate: true });
    }
    if (!open) {
      setDynamic({});
    }
  }, [open, presetSportId, form]);

  const sportId = form.watch("sportId");
  const categories = useSportCategories(sportId || undefined);
  const fieldsQuery = useSportMatchFields(sportId || undefined);

  const statFields = useMemo(
    () =>
      (fieldsQuery.data ?? [])
        .filter((f) => f.isActive !== false && !f.isComputed && f.section !== "PROFILE")
        .sort((a, b) => a.displayOrder - b.displayOrder),
    [fieldsQuery.data],
  );

  useEffect(() => {
    setDynamic({});
  }, [sportId]);

  const setValue = (fieldId: string, value: DynamicValue) =>
    setDynamic((prev) => ({ ...prev, [fieldId]: value }));

  const onSubmit = (data: MatchBaseFormValues) => {
    const missing = statFields.find(
      (f) =>
        f.required &&
        (dynamic[f.id] === undefined ||
          dynamic[f.id] === "" ||
          (Array.isArray(dynamic[f.id]) && (dynamic[f.id] as string[]).length === 0)),
    );
    if (missing) {
      toast.error(`${missing.name} is required`);
      return;
    }

    createMatch.mutate(
      {
        sportId: data.sportId,
        ...(data.sportCategoryId ? { sportCategoryId: data.sportCategoryId } : {}),
        ...(data.title ? { title: data.title } : {}),
        ...(data.tournament ? { tournament: data.tournament } : {}),
        ...(data.matchType ? { matchType: data.matchType } : {}),
        ...(data.venue ? { venue: data.venue } : {}),
        ...(data.homeTeam ? { homeTeam: data.homeTeam } : {}),
        ...(data.awayTeam ? { awayTeam: data.awayTeam } : {}),
        ...(data.playerSide ? { playerSide: data.playerSide } : {}),
        matchDate: new Date(data.matchDate).toISOString(),
        result: data.result as MatchBaseFormValues["result"] as never,
        isCaptain: data.isCaptain,
        isSubstitute: data.isSubstitute,
        ...(data.minutesPlayed ? { minutesPlayed: Number(data.minutesPlayed) } : {}),
        ...(data.notes ? { notes: data.notes } : {}),
        values: buildValues(statFields, dynamic),
      },
      {
        onSuccess: () => {
          setOpen(false);
          setDynamic({});
          form.reset({
            sportId: data.sportId,
            matchDate: "",
            result: "WIN",
            isCaptain: false,
            isSubstitute: false,
          });
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add match
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto sm:max-w-3xl md:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Add match</DialogTitle>
          <DialogDescription>
            Submit your match details and statistics. Computed stats are derived
            automatically after approval.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6 " onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 sm:grid-cols-2 ">
            <div className="space-y-2">
              <Label>Sport</Label>
              <Select
                value={sportId}
                onValueChange={(v) => form.setValue("sportId", v, { shouldValidate: true })}
                disabled={Boolean(presetSportId)}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={profiles.isLoading ? "Loading…" : "Select sport"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {(profiles.data ?? []).map((p) => (
                    <SelectItem key={p.sportId} value={p.sportId}>
                      {p.sport?.name ?? "Sport"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.sportId && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.sportId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={form.watch("sportCategoryId") ?? ""}
                onValueChange={(v) => form.setValue("sportCategoryId", v)}
                disabled={!sportId || (categories.data ?? []).length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Optional" />
                </SelectTrigger>
                <SelectContent>
                  {(categories.data ?? []).map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Title</Label>
              <Input placeholder="Match title" {...form.register("title")} />
            </div>
            <div className="space-y-2">
              <Label>Tournament</Label>
              <Input placeholder="Tournament" {...form.register("tournament")} />
            </div>
            <div className="space-y-2">
              <Label>Match type</Label>
              <Input placeholder="e.g. T20, Friendly" {...form.register("matchType")} />
            </div>
            <div className="space-y-2">
              <Label>Venue</Label>
              <Input placeholder="Ground / stadium" {...form.register("venue")} />
            </div>
            <div className="space-y-2">
              <Label>Home team</Label>
              <Input placeholder="Home team" {...form.register("homeTeam")} />
            </div>
            <div className="space-y-2">
              <Label>Away team</Label>
              <Input placeholder="Away team" {...form.register("awayTeam")} />
            </div>

            <div className="space-y-2">
              <Label>Your side</Label>
              <Select
                value={form.watch("playerSide") ?? ""}
                onValueChange={(v) =>
                  form.setValue("playerSide", v as "HOME" | "AWAY")
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select side" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HOME">Home</SelectItem>
                  <SelectItem value="AWAY">Away</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Match date</Label>
              <Input type="date" {...form.register("matchDate")} />
              {form.formState.errors.matchDate && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.matchDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Result</Label>
              <Select
                value={form.watch("result")}
                onValueChange={(v) => form.setValue("result", v, { shouldValidate: true })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select result" />
                </SelectTrigger>
                <SelectContent>
                  {MATCH_RESULTS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {MATCH_RESULT_LABELS[r]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Minutes played</Label>
              <Input type="number" min={0} {...form.register("minutesPlayed")} />
            </div>

            <div className="flex items-center gap-6 sm:col-span-2">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.watch("isCaptain")}
                  onCheckedChange={(c) => form.setValue("isCaptain", Boolean(c))}
                />
                Captain
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={form.watch("isSubstitute")}
                  onCheckedChange={(c) => form.setValue("isSubstitute", Boolean(c))}
                />
                Substitute
              </label>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>Notes</Label>
              <Textarea rows={3} placeholder="Anything worth noting" {...form.register("notes")} />
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold">Match statistics</h3>
              <p className="text-xs text-muted-foreground">
                {!sportId
                  ? "Select a sport to load its stat fields."
                  : fieldsQuery.isLoading
                    ? "Loading fields…"
                    : statFields.length === 0
                      ? "No stat fields configured for this sport yet."
                      : "Fields are configured per sport by the platform admin."}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {statFields.map((field) => (
                <DynamicField
                  key={field.id}
                  field={field}
                  value={dynamic[field.id]}
                  onChange={(v) => setValue(field.id, v)}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMatch.isPending}>
              {createMatch.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit match
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DynamicField({
  field,
  value,
  onChange,
}: {
  field: PlayerSportField;
  value: DynamicValue | undefined;
  onChange: (value: DynamicValue) => void;
}) {
  const label = (
    <Label>
      {field.name}
      {field.required && <span className="ml-0.5 text-destructive">*</span>}
      {field.metric?.name && (
        <span className="ml-2 text-xs font-normal text-muted-foreground">
          {field.metric.name}
        </span>
      )}
    </Label>
  );

  if (field.type === "BOOLEAN") {
    return (
      <label className="flex items-center gap-2 pt-6 text-sm">
        <Checkbox
          checked={Boolean(value)}
          onCheckedChange={(c) => onChange(Boolean(c))}
        />
        {field.name}
      </label>
    );
  }

  if (field.type === "SELECT") {
    return (
      <div className="space-y-2">
        {label}
        <Select value={(value as string) ?? ""} onValueChange={onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            {field.options
              .filter((o) => o.isActive !== false)
              .map((o) => (
                <SelectItem key={o.id} value={o.id}>
                  {o.label}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (field.type === "MULTI_SELECT") {
    const selected = (value as string[]) ?? [];
    return (
      <div className="space-y-2">
        {label}
        <div className="flex flex-wrap gap-3 rounded-md border p-3">
          {field.options
            .filter((o) => o.isActive !== false)
            .map((o) => (
              <label key={o.id} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={selected.includes(o.value)}
                  onCheckedChange={(c) =>
                    onChange(
                      c
                        ? [...selected, o.value]
                        : selected.filter((v) => v !== o.value),
                    )
                  }
                />
                {o.label}
              </label>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label}
      <Input
        type={field.type === "NUMBER" ? "number" : field.type === "DATE" ? "date" : "text"}
        value={(value as string) ?? ""}
        placeholder={field.description ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
