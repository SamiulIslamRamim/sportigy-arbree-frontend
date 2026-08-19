import { Checkbox } from "#/components/ui/checkbox";
import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import type { DynamicFieldProps } from "../FieldRegistry";

export function MultiSelectField({ field, value, onChange, error, disabled }: DynamicFieldProps) {
  const selected = value.optionId ? value.optionId.split(",") : [];
  const toggle = (optionId: string) => {
    const next = selected.includes(optionId)
      ? selected.filter((id) => id !== optionId)
      : [...selected, optionId];
    onChange({ fieldId: field.id, optionId: next.join(",") });
  };
  return (
    <Field data-invalid={!!error}>
      <FieldLabel>{field.name}</FieldLabel>
      <div className="grid gap-2">
        {field.options.map((o) => (
          <label key={o.id} className="flex items-center gap-2 text-sm">
            <Checkbox checked={selected.includes(o.id)} onCheckedChange={() => toggle(o.id)} disabled={disabled} />
            {o.label}
          </label>
        ))}
      </div>
      {error && <FieldError errors={[{ message: error }]} />}
    </Field>
  );
}
