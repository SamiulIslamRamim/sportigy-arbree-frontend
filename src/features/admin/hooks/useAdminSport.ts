import type { FieldSection } from "#/features/player/types/player.types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractAdminApiError } from "../api/admin-auth.api";
import { adminCategoryApi, adminFieldApi, adminFieldOptionApi, adminMetricApi, adminSportApi } from "../api/admin-sport.api";
import type { CategoryPayload, FieldOptionPayload, FieldPayload, MetricPayload, SportPayload } from "../types/admin-sport.types";


export const adminSportKeys = {
  sports: (isActive?: boolean) => ["admin", "sports", { isActive }] as const,
  sport: (sportId: string) => ["admin", "sport", sportId] as const,
  categories: (sportId: string) => ["admin", "sport", sportId, "categories"] as const,
  metrics: (sportId: string) => ["admin", "sport", sportId, "metrics"] as const,
  fields: (sportId: string, section?: FieldSection) =>
    ["admin", "sport", sportId, "fields", { section }] as const,
  options: (fieldId: string) => ["admin", "field", fieldId, "options"] as const,
};

function useToastedMutation<TVars, TData extends { message: string }>(
  mutationFn: (vars: TVars) => Promise<TData>,
  invalidate: (queryClient: ReturnType<typeof useQueryClient>, vars: TVars) => void,
  fallbackError: string,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: (result, vars) => {
      invalidate(queryClient, vars);
      toast.success(result.message);
    },
    onError: (err) => {
      toast.error(extractAdminApiError(err, fallbackError));
    },
  });
}

/* ---------------- Sports ---------------- */

export function useSports(isActive?: boolean) {
  return useQuery({
    queryKey: adminSportKeys.sports(isActive),
    queryFn: () => adminSportApi.list(isActive),
  });
}

export function useSport(sportId: string) {
  return useQuery({
    queryKey: adminSportKeys.sport(sportId),
    queryFn: () => adminSportApi.detail(sportId),
    enabled: Boolean(sportId),
  });
}

function invalidateSportLists(queryClient: ReturnType<typeof useQueryClient>) {
  queryClient.invalidateQueries({ queryKey: ["admin", "sports"] });
}

export function useCreateSport() {
  return useToastedMutation(
    (payload: SportPayload) => adminSportApi.create(payload),
    (qc) => invalidateSportLists(qc),
    "Could not create sport",
  );
}

export function useUpdateSport() {
  return useToastedMutation(
    ({ sportId, payload }: { sportId: string; payload: SportPayload }) =>
      adminSportApi.update(sportId, payload),
    (qc, { sportId }) => {
      invalidateSportLists(qc);
      qc.invalidateQueries({ queryKey: adminSportKeys.sport(sportId) });
    },
    "Could not update sport",
  );
}

export function useDeleteSport() {
  return useToastedMutation(
    (sportId: string) => adminSportApi.remove(sportId),
    (qc, sportId) => {
      invalidateSportLists(qc);
      qc.invalidateQueries({ queryKey: adminSportKeys.sport(sportId) });
    },
    "Could not delete sport",
  );
}

/* ---------------- Categories ---------------- */

export function useSportCategories(sportId: string) {
  return useQuery({
    queryKey: adminSportKeys.categories(sportId),
    queryFn: () => adminCategoryApi.list(sportId),
    enabled: Boolean(sportId),
  });
}

export function useCreateSportCategory(sportId: string) {
  return useToastedMutation(
    (payload: CategoryPayload) => adminCategoryApi.create(sportId, payload),
    (qc) => {
      qc.invalidateQueries({ queryKey: adminSportKeys.categories(sportId) });
      qc.invalidateQueries({ queryKey: adminSportKeys.sport(sportId) });
    },
    "Could not create category",
  );
}

export function useUpdateSportCategory(sportId: string) {
  return useToastedMutation(
    ({ categoryId, payload }: { categoryId: string; payload: CategoryPayload }) =>
      adminCategoryApi.update(sportId, categoryId, payload),
    (qc) => {
      qc.invalidateQueries({ queryKey: adminSportKeys.categories(sportId) });
      qc.invalidateQueries({ queryKey: adminSportKeys.sport(sportId) });
    },
    "Could not update category",
  );
}

export function useDeleteSportCategory(sportId: string) {
  return useToastedMutation(
    (categoryId: string) => adminCategoryApi.remove(sportId, categoryId),
    (qc) => {
      qc.invalidateQueries({ queryKey: adminSportKeys.categories(sportId) });
      qc.invalidateQueries({ queryKey: adminSportKeys.sport(sportId) });
    },
    "Could not delete category",
  );
}

/* ---------------- Metrics ---------------- */

export function useSportMetrics(sportId: string) {
  return useQuery({
    queryKey: adminSportKeys.metrics(sportId),
    queryFn: () => adminMetricApi.list(sportId),
    enabled: Boolean(sportId),
    select: (metrics) =>
      [...metrics].sort(
        (a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name),
      ),
  });
}

function invalidateMetricsAndFields(
  queryClient: ReturnType<typeof useQueryClient>,
  sportId: string,
) {
  queryClient.invalidateQueries({ queryKey: adminSportKeys.metrics(sportId) });
  // Fields reference metrics, so their embedded metric data can change too.
  queryClient.invalidateQueries({ queryKey: ["admin", "sport", sportId, "fields"] });
  queryClient.invalidateQueries({ queryKey: adminSportKeys.sport(sportId) });
}

export function useCreateSportMetric(sportId: string) {
  return useToastedMutation(
    (payload: MetricPayload) => adminMetricApi.create(sportId, payload),
    (qc) => invalidateMetricsAndFields(qc, sportId),
    "Could not create metric",
  );
}

export function useUpdateSportMetric(sportId: string) {
  return useToastedMutation(
    ({ metricId, payload }: { metricId: string; payload: MetricPayload }) =>
      adminMetricApi.update(metricId, payload),
    (qc) => invalidateMetricsAndFields(qc, sportId),
    "Could not update metric",
  );
}

export function useDeleteSportMetric(sportId: string) {
  return useToastedMutation(
    (metricId: string) => adminMetricApi.remove(metricId),
    (qc) => invalidateMetricsAndFields(qc, sportId),
    "Could not delete metric",
  );
}

/* ---------------- Fields ---------------- */

export function useSportFields(sportId: string, section?: FieldSection) {
  return useQuery({
    queryKey: adminSportKeys.fields(sportId, section),
    queryFn: () => adminFieldApi.list(sportId, section),
    enabled: Boolean(sportId),
  });
}

function invalidateFields(queryClient: ReturnType<typeof useQueryClient>, sportId: string) {
  queryClient.invalidateQueries({ queryKey: ["admin", "sport", sportId, "fields"] });
  queryClient.invalidateQueries({ queryKey: adminSportKeys.sport(sportId) });
}

export function useCreateSportField(sportId: string) {
  return useToastedMutation(
    (payload: FieldPayload) => adminFieldApi.create(sportId, payload),
    (qc) => invalidateFields(qc, sportId),
    "Could not create field",
  );
}

export function useUpdateSportField(sportId: string) {
  return useToastedMutation(
    ({ fieldId, payload }: { fieldId: string; payload: FieldPayload }) =>
      adminFieldApi.update(sportId, fieldId, payload),
    (qc) => invalidateFields(qc, sportId),
    "Could not update field",
  );
}

export function useDeleteSportField(sportId: string) {
  return useToastedMutation(
    (fieldId: string) => adminFieldApi.remove(sportId, fieldId),
    (qc) => invalidateFields(qc, sportId),
    "Could not delete field",
  );
}

/* ---------------- Field options ---------------- */

export function useFieldOptions(fieldId: string | null) {
  return useQuery({
    queryKey: adminSportKeys.options(fieldId ?? "none"),
    queryFn: () => adminFieldOptionApi.list(fieldId as string),
    enabled: Boolean(fieldId),
  });
}

export function useCreateFieldOption(sportId: string, fieldId: string) {
  return useToastedMutation(
    (payload: FieldOptionPayload) => adminFieldOptionApi.create(fieldId, payload),
    (qc) => {
      qc.invalidateQueries({ queryKey: adminSportKeys.options(fieldId) });
      invalidateFields(qc, sportId);
    },
    "Could not create option",
  );
}

export function useUpdateFieldOption(sportId: string, fieldId: string) {
  return useToastedMutation(
    ({ optionId, payload }: { optionId: string; payload: FieldOptionPayload }) =>
      adminFieldOptionApi.update(fieldId, optionId, payload),
    (qc) => {
      qc.invalidateQueries({ queryKey: adminSportKeys.options(fieldId) });
      invalidateFields(qc, sportId);
    },
    "Could not update option",
  );
}

export function useDeleteFieldOption(sportId: string, fieldId: string) {
  return useToastedMutation(
    (optionId: string) => adminFieldOptionApi.remove(fieldId, optionId),
    (qc) => {
      qc.invalidateQueries({ queryKey: adminSportKeys.options(fieldId) });
      invalidateFields(qc, sportId);
    },
    "Could not delete option",
  );
}
