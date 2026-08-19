import { Checkbox } from "#/components/ui/checkbox";
import { Field } from "#/components/ui/field";
import type { DynamicFieldProps } from "../FieldRegistry";

export function BooleanField({ field, value, onChange, disabled }: DynamicFieldProps) {
  return (
    <Field>
      <label className="flex items-center gap-2 text-sm font-medium">
        <Checkbox
          checked={value.valueBoolean ?? false}
          onCheckedChange={(checked) => onChange({ fieldId: field.id, valueBoolean: !!checked })}
          disabled={disabled}
        />
        {field.name}
      </label>
    </Field>
  );
}
