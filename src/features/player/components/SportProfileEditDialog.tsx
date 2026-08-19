import { Field, FieldGroup, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";
import { useCallback, useEffect, useState } from "react";
import { useSportProfile } from "../hooks/useSportProfiles";
import type { PlayerFieldValue, UpdateSportProfileInput } from "../types/sportProfile.types";

const NONE = "__none__";

export function SportProfileEditDialog({
  sportId,
  onChange,
}: {
  sportId: string;
  onChange: (input: UpdateSportProfileInput) => void;
}) {
  const { data, isLoading, isError } = useSportProfile(sportId);
  const [academy, setAcademy] = useState("");
  const [rows, setRows] = useState<PlayerFieldValue[]>([]);

  const emit = useCallback(
    (nextAcademy: string, nextRows: PlayerFieldValue[]) => {
      onChange({
        academy: nextAcademy,
        values: nextRows.filter((r) => r.optionId).map((r) => ({ fieldId: r.fieldId, optionId: r.optionId })),
      });
    },
    [onChange],
  );

  useEffect(() => {
    if (!data) return;
    setAcademy(data.academy ?? "");
    setRows(data.values ?? []);
    emit(data.academy ?? "", data.values ?? []);
  }, [data, emit]);

  if (!sportId) {
    return <p className="text-sm text-muted-foreground">Select a sport to edit its profile fields.</p>;
  }
  if (isLoading) return <p className="text-sm text-muted-foreground">Loading sport profile…</p>;
  if (isError || !data) {
    return <p className="text-sm text-muted-foreground">Sport profile is not available yet.</p>;
  }

  return (
    <div className="space-y-4 md:col-span-2">
      <div>
        <h3 className="text-sm font-semibold">{data.sport?.name ?? "Sport"} profile</h3>
        <p className="text-xs text-muted-foreground">
          You can change or remove options you already have. More fields coming soon.
        </p>
      </div>
      <FieldGroup className="grid gap-4 md:grid-cols-2">
        <Field className="md:col-span-2">
          <FieldLabel htmlFor="academy">Academy</FieldLabel>
          <Input
            id="academy"
            value={academy}
            onChange={(e) => {
              const next = e.target.value;
              setAcademy(next);
              emit(next, rows);
            }}
          />
        </Field>
        {rows.map((v) => (
          <Field key={v.fieldId}>
            <FieldLabel>{v.field.name}</FieldLabel>
            <Select
              value={v.optionId || NONE}
              onValueChange={(optionId) => {
                const nextRows = rows.map((item) =>
                  item.fieldId === v.fieldId ? { ...item, optionId: optionId === NONE ? "" : optionId } : item,
                );
                setRows(nextRows);
                emit(academy, nextRows);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NONE}>Remove</SelectItem>
                {v.option ? <SelectItem value={v.option.id}>{v.option.label}</SelectItem> : null}
              </SelectContent>
            </Select>
          </Field>
        ))}
      </FieldGroup>
      {rows.length === 0 ? <p className="text-xs text-muted-foreground">More fields coming soon.</p> : null}
    </div>
  );
}
