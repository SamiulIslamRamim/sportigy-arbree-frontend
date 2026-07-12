const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";


export type CategoryOption = { id: string; name: string };

export async function fetchCategories(): Promise<CategoryOption[]> {
  const res = await fetch(`${BASE_URL}/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return (await res.json()).categories;
}

export async function fetchOrgCategories(): Promise<CategoryOption[]> {
  const res = await fetch(`${BASE_URL}/org-categories`);
  if (!res.ok) throw new Error('Failed to fetch org categories');
  return (await res.json()).categories;
}



