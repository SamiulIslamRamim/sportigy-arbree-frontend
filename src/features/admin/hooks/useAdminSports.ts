import { extractAdminApiError } from "../api/admin-auth.api";
import { adminSportApi } from "../api/adminSport.api";
import type { CreateCategoryInput, CreateFieldInput, CreateFieldOptionInput, CreateMetricInput, CreateSportInput } from "../types/admin-sport.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const adminSportKeys = {
  all: ["admin", "sports"] as const,
  one: (id: string) => ["admin", "sports", id] as const,
  categories: (id: string) => ["admin", "sports", id, "categories"] as const,
  fields: (id: string) => ["admin", "sports", id, "fields"] as const,
  options: (fieldId: string) => ["admin", "fields", fieldId, "options"] as const,
  metrics: (id: string) => ["admin", "sports", id, "metrics"] as const,
};

export function useAdminSports() {
  return useQuery({ queryKey: adminSportKeys.all, queryFn: adminSportApi.list });
}

export function useAdminSport(sportId: string) {
  return useQuery({
    queryKey: adminSportKeys.one(sportId),
    queryFn: () => adminSportApi.get(sportId),
    enabled: !!sportId,
  });
}

export function useAdminSportCategories(sportId: string) {
  return useQuery({
    queryKey: adminSportKeys.categories(sportId),
    queryFn: () => adminSportApi.listCategories(sportId),
    enabled: !!sportId,
  });
}

export function useAdminSportFields(sportId: string) {
  return useQuery({
    queryKey: adminSportKeys.fields(sportId),
    queryFn: () => adminSportApi.listFields(sportId),
    enabled: !!sportId,
  });
}

export function useAdminFieldOptions(fieldId: string) {
  return useQuery({
    queryKey: adminSportKeys.options(fieldId),
    queryFn: () => adminSportApi.listOptions(fieldId),
    enabled: !!fieldId,
  });
}

export function useAdminSportMetrics(sportId: string) {
  return useQuery({
    queryKey: adminSportKeys.metrics(sportId),
    queryFn: () => adminSportApi.listMetrics(sportId),
    enabled: !!sportId,
  });
}

function invalidateSport(qc: ReturnType<typeof useQueryClient>, sportId?: string) {
  qc.invalidateQueries({ queryKey: adminSportKeys.all });
  if (sportId) qc.invalidateQueries({ queryKey: adminSportKeys.one(sportId) });
}

export function useCreateSport() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateSportInput) => adminSportApi.create(input),
    onSuccess: () => {
      invalidateSport(qc);
      toast.success("Sport created");
    },
    onError: (err) => toast.error(extractAdminApiError(err, "Failed to create sport")),
  });
}

export function useCreateCategory(sportId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCategoryInput) => adminSportApi.createCategory(sportId, input),
    onSuccess: () => {
      invalidateSport(qc, sportId);
      qc.invalidateQueries({ queryKey: adminSportKeys.categories(sportId) });
      toast.success("Category created");
    },
    onError: (err) => toast.error(extractAdminApiError(err, "Failed to create category")),
  });
}

export function useCreateField(sportId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateFieldInput) => adminSportApi.createField(sportId, input),
    onSuccess: () => {
      invalidateSport(qc, sportId);
      qc.invalidateQueries({ queryKey: adminSportKeys.fields(sportId) });
      toast.success("Field created");
    },
    onError: (err) => toast.error(extractAdminApiError(err, "Failed to create field")),
  });
}

export function useCreateOption(sportId: string, fieldId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateFieldOptionInput) => adminSportApi.createOption(fieldId, input),
    onSuccess: () => {
      invalidateSport(qc, sportId);
      qc.invalidateQueries({ queryKey: adminSportKeys.options(fieldId) });
      toast.success("Option created");
    },
    onError: (err) => toast.error(extractAdminApiError(err, "Failed to create option")),
  });
}

export function useCreateMetric(sportId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateMetricInput) => adminSportApi.createMetric(sportId, input),
    onSuccess: () => {
      invalidateSport(qc, sportId);
      qc.invalidateQueries({ queryKey: adminSportKeys.metrics(sportId) });
      toast.success("Metric created");
    },
    onError: (err) => toast.error(extractAdminApiError(err, "Failed to create metric")),
  });
}
