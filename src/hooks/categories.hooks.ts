import { fetchCategories, fetchOrgCategories } from "#/lib/api/categories";
import { useQuery } from "@tanstack/react-query";


export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  });
}

export function useOrgCategories() {
  return useQuery({
    queryKey: ['org-categories'],
    queryFn: fetchOrgCategories,
    staleTime: 5 * 60 * 1000,
  });
}