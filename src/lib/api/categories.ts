import { api } from "@/lib/api/axios";

export type CategoryOption = { id: string; name: string };

export async function fetchCategories(): Promise<CategoryOption[]> {
  const { data } = await api.get<{ sports: CategoryOption[] }>("/sports");
  return data.sports;
}

export async function fetchOrgCategories(): Promise<CategoryOption[]> {
  const { data } = await api.get<{ categories: CategoryOption[] }>("/org-categories");
  return data.categories;
}