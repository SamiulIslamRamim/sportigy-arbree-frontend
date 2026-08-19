import type { FC } from "react";
import type { FieldType } from "../types/sportProfile.types";
import type { MatchFieldValueInput, SportFieldWithOptions } from "../types/match.types";
import { SelectField } from "./fields/SelectField";
import { MultiSelectField } from "./fields/MultiSelectField";
import { NumberField } from "./fields/NumberField";
import { TextField } from "./fields/TextField";
import { BooleanField } from "./fields/BooleanField";
import { DateField } from "./fields/DateField";


export interface DynamicFieldProps {
  field: SportFieldWithOptions;
  value: MatchFieldValueInput;
  onChange: (value: MatchFieldValueInput) => void;
  error?: string;
  disabled?: boolean;
}

export const FieldComponents: Record<FieldType, FC<DynamicFieldProps>> = {
  SELECT: SelectField,
  MULTI_SELECT: MultiSelectField,
  NUMBER: NumberField,
  TEXT: TextField,
  BOOLEAN: BooleanField,
  DATE: DateField,
};
