import { Input } from "#/components/ui/input";
import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import type { DynamicFieldProps } from "../FieldRegistry";

export function NumberField({ field, value, onChange, error, disabled }: DynamicFieldProps) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel>{field.name}</FieldLabel>
      <Input
        type="number"
        min={-100000}
        max={100000}
        value={value.valueNumber ?? ""}
        onChange={(e) =>
          onChange({
            fieldId: field.id,
            valueNumber: e.target.value === "" ? undefined : Number(e.target.value),
          })
        }
        disabled={disabled}
        aria-invalid={!!error}
      />
      {error && <FieldError errors={[{ message: error }]} />}
    </Field>
  );
}
