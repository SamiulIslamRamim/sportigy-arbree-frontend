import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";
import { Field, FieldError, FieldLabel } from "#/components/ui/field";
import type { DynamicFieldProps } from "../FieldRegistry";

export function SelectField({ field, value, onChange, error, disabled }: DynamicFieldProps) {
  return (
    <Field data-invalid={!!error}>
      <FieldLabel>{field.name}</FieldLabel>
      <Select value={value.optionId} onValueChange={(optionId) => onChange({ fieldId: field.id, optionId })} disabled={disabled}>
        <SelectTrigger aria-invalid={!!error}>
          <SelectValue placeholder="Select..." />
        </SelectTrigger>
        <SelectContent>
          {field.options.map((o) => (
            <SelectItem key={o.id} value={o.id}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <FieldError errors={[{ message: error }]} />}
    </Field>
  );
}
