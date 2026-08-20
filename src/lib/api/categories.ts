const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export type CategoryOption = { id: string; name: string };

async function unwrapList<T>(url: string, key: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`);
  if (!res.ok) throw new Error(`Failed to fetch ${key}`);
  const body = (await res.json()) as {
    data?: Record<string, unknown>;
  };
  return (body.data?.[key] ?? []) as T;
}

export async function fetchCategories(): Promise<CategoryOption[]> {
  return unwrapList<CategoryOption[]>("/sports", "sports");
}

export async function fetchOrgCategories(): Promise<CategoryOption[]> {
  return unwrapList<CategoryOption[]>("/org-categories", "categories");
}