export type FieldSection = "PROFILE" | "MATCH";
export type FieldType = "SELECT" | "MULTI_SELECT" | "NUMBER" | "TEXT" | "BOOLEAN" | "DATE";
export type FormulaRole = "NUMERATOR" | "DENOMINATOR";

export interface AdminSport {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { categories: number; fields?: number };
}

export interface AdminSportCategory {
  id: string;
  sportId: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
}

export interface AdminFormulaComponent {
  sourceFieldId: string;
  role: FormulaRole;
  sourceField?: { id: string; name: string; slug: string };
}

export interface AdminFieldOption {
  id: string;
  fieldId?: string;
  label: string;
  value: string;
  isDefault?: boolean;
  isActive: boolean;
}

export interface AdminSportField {
  id: string;
  sportId: string;
  name: string;
  slug: string;
  section: FieldSection;
  type: FieldType;
  description?: string | null;
  required: boolean;
  displayOrder: number;
  isComputed: boolean;
  isActive: boolean;
  metricId: string | null;
  formulaMultiplier: number | null;
  metric?: { id: string; name: string; slug: string } | null;
  options?: AdminFieldOption[];
  formulaComponents?: AdminFormulaComponent[];
}

export interface AdminSportMetric {
  id: string;
  sportId: string;
  name: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
}

export interface AdminSportDetail extends AdminSport {
  categories: AdminSportCategory[];
  fields: AdminSportField[];
  metrics: AdminSportMetric[];
}

export interface CreateSportInput {
  name: string;
  slug?: string;
  description?: string | null;
  isActive?: boolean;
}

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  description?: string | null;
  isActive?: boolean;
}

export interface CreateFieldOptionInput {
  label: string;
  value?: string;
  isDefault?: boolean;
  isActive?: boolean;
}

export interface CreateFieldInput {
  name: string;
  slug?: string;
  section: FieldSection;
  type: FieldType;
  description?: string | null;
  required?: boolean;
  displayOrder?: number;
  isActive?: boolean;
  metricId?: string | null;
  isComputed?: boolean;
  formulaMultiplier?: number;
  formulaComponents?: { sourceFieldId: string; role: FormulaRole }[];
  options?: CreateFieldOptionInput[];
}

export interface CreateMetricInput {
  name: string;
  slug?: string;
  displayOrder?: number;
  isActive?: boolean;
}
