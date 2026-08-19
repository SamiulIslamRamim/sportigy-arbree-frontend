export interface SportProfile {
  id: string;
  userId: string;
  sportId: string;
  sport?: { id: string; name: string; slug: string };
  academy: string | null;
  createdAt: string;
  values?: PlayerFieldValue[];
}

export interface SportProfileWithValues extends SportProfile {
  sport: { id: string; name: string; slug: string };
  values: PlayerFieldValue[];
}

export interface PlayerFieldValue {
  id: string;
  profileId: string;
  fieldId: string;
  optionId: string;
  field: Pick<SportField, "id" | "name" | "slug" | "type">;
  option: { id: string; label: string; value: string };
}

export interface SportField {
  id: string;
  name: string;
  slug: string;
  type: FieldType;
  section: "PROFILE" | "MATCH";
  required: boolean;
  searchable: boolean;
  filterable: boolean;
  sortable: boolean;
  displayOrder: number;
  isComputed: boolean;
  isActive: boolean;
  options: SportFieldOption[];
}

export interface SportFieldOption {
  id: string;
  label: string;
  value: string;
  isActive: boolean;
}

export type FieldType = "SELECT" | "MULTI_SELECT" | "NUMBER" | "TEXT" | "BOOLEAN" | "DATE";

export interface AddSportProfileInput {
  sportId: string;
  academy?: string;
}

export interface UpdateSportProfileInput {
  academy?: string;
  values?: { fieldId: string; optionId: string }[];  // option-only for PROFILE section
}
