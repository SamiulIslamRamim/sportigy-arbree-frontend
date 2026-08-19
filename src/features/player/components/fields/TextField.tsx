import { Input } from "#/components/ui/input";
import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import type { DynamicFieldProps } from "../FieldRegistry";

export function TextField({ field, value, onChange, error, disabled }: DynamicFieldProps) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel>{field.name}</FieldLabel>
      <Input
        type="text"
        maxLength={500}
        value={value.valueText ?? ""}
        onChange={(e) => onChange({ fieldId: field.id, valueText: e.target.value || undefined })}
        disabled={disabled}
        aria-invalid={!!error}
      />
      {error && <FieldError errors={[{ message: error }]} />}
    </Field>
  );
}
