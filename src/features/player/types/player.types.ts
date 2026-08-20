export type FieldType = "SELECT" | "MULTI_SELECT" | "NUMBER" | "TEXT" | "BOOLEAN" | "DATE";
export type FieldSection = "PROFILE" | "MATCH";
export type Gender = "male" | "female" | "other";

export interface BasicProfile {
  id: string;
  name: string;
  bio: string | null;
  gender: Gender | null;
  birthday: string | null;
  height: string | null;
  weight: string | null;
  contactNo: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  websiteUrl: string | null;
}

export interface UpdateBasicProfileInput {
  name: string;
  bio?: string | null;
  gender?: Gender | null;
  birthday?: string | null;
  height?: string | null;
  weight?: string | null;
  contactNo?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
}

export interface SportSummary {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

export interface SportField {
  id: string;
  name: string;
  slug: string;
  type: FieldType;
  section?: FieldSection;
  displayOrder?: number;
  required?: boolean;
}

export interface SportFieldOption {
  id: string;
  label: string;
  value: string;
}

export interface SportProfileValue {
  id: string;
  field: SportField;
  option: SportFieldOption | null;
}

export interface SportProfile {
  id: string;
  sportId: string;
  academy: string | null;
  sport: SportSummary;
  values: SportProfileValue[];
}