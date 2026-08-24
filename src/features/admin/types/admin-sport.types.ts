export type FieldSection = "PROFILE" | "MATCH";

export type FieldType = "TEXT" | "NUMBER" | "BOOLEAN" | "DATE" | "SELECT" | "MULTI_SELECT";

export type FormulaRole = "NUMERATOR" | "DENOMINATOR";

export const FIELD_SECTIONS: FieldSection[] = ["PROFILE", "MATCH"];

export const FIELD_TYPES: FieldType[] = [
  "TEXT",
  "NUMBER",
  "BOOLEAN",
  "DATE",
  "SELECT",
  "MULTI_SELECT",
];

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  TEXT: "Text",
  NUMBER: "Number",
  BOOLEAN: "Boolean",
  DATE: "Date",
  SELECT: "Select",
  MULTI_SELECT: "Multi select",
};

export interface AdminSport {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminSportCategory {
  id: string;
  sportId: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
}

export interface AdminSportMetric {
  id: string;
  sportId: string;
  name: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
}

export interface AdminFieldOption {
  id: string;
  fieldId: string;
  label: string;
  value: string;
  isDefault: boolean;
  isActive: boolean;
}

export interface AdminFormulaComponent {
  id: string;
  fieldId: string;
  sourceFieldId: string;
  role: FormulaRole;
  sourceField?: { id: string; name: string; slug: string } | null;
}

export interface AdminSportField {
  id: string;
  sportId: string;
  name: string;
  slug: string;
  description: string | null;
  section: FieldSection;
  type: FieldType;
  required: boolean;
  searchable: boolean;
  filterable: boolean;
  sortable: boolean;
  displayOrder: number;
  isActive: boolean;
  isComputed: boolean;
  formulaMultiplier: number | null;
  metricId: string | null;
  metric?: { id: string; name: string; slug: string } | null;
  options: AdminFieldOption[];
  formulaComponents: AdminFormulaComponent[];
}

export interface AdminSportDetail extends AdminSport {
  categories?: AdminSportCategory[];
  metrics?: AdminSportMetric[];
  fields?: AdminSportField[];
}

/* ---------- payloads ---------- */

export interface SportPayload {
  name?: string;
  slug?: string;
  description?: string | null;
  isActive?: boolean;
}

export interface CategoryPayload {
  name?: string;
  slug?: string;
  description?: string | null;
  isActive?: boolean;
}

export interface MetricPayload {
  name?: string;
  slug?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface FieldOptionPayload {
  label?: string;
  value?: string;
  isDefault?: boolean;
  isActive?: boolean;
}

export interface FormulaComponentPayload {
  sourceFieldId: string;
  role: FormulaRole;
}

export interface FieldPayload {
  name?: string;
  slug?: string;
  description?: string | null;
  section?: FieldSection;
  type?: FieldType;
  required?: boolean;
  searchable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  displayOrder?: number;
  isActive?: boolean;
  isComputed?: boolean;
  formulaMultiplier?: number | null;
  metricId?: string | null;
  formulaComponents?: FormulaComponentPayload[];
  options?: FieldOptionPayload[];
}
