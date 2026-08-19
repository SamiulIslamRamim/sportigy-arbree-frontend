import { adminApi } from "./admin-auth.api";
import type {
  AdminFieldOption,
  AdminSport,
  AdminSportCategory,
  AdminSportDetail,
  AdminSportField,
  AdminSportMetric,
  CreateCategoryInput,
  CreateFieldInput,
  CreateFieldOptionInput,
  CreateMetricInput,
  CreateSportInput,
  FieldSection,
} from "../types/admin-sport.types";

export const adminSportApi = {
  list: async (): Promise<AdminSport[]> => {
    const { data } = await adminApi.get<{ sports: AdminSport[] }>("/admin/sports/");
    return data.sports;
  },
  get: async (sportId: string): Promise<AdminSportDetail> => {
    const { data } = await adminApi.get<{ sport: AdminSportDetail }>(`/admin/sports/${sportId}/`);
    return data.sport;
  },
  create: async (input: CreateSportInput): Promise<AdminSport> => {
    const { data } = await adminApi.post<{ sport: AdminSport }>("/admin/sports/", input);
    return data.sport;
  },
  update: async (sportId: string, input: Partial<CreateSportInput>): Promise<AdminSport> => {
    const { data } = await adminApi.patch<{ sport: AdminSport }>(`/admin/sports/${sportId}/`, input);
    return data.sport;
  },
  remove: async (sportId: string): Promise<void> => {
    await adminApi.delete(`/admin/sports/${sportId}/`);
  },
  listCategories: async (sportId: string): Promise<AdminSportCategory[]> => {
    const { data } = await adminApi.get<{ categories: AdminSportCategory[] }>(`/admin/sports/${sportId}/categories/`);
    return data.categories;
  },
  createCategory: async (sportId: string, input: CreateCategoryInput): Promise<AdminSportCategory> => {
    const { data } = await adminApi.post<{ category: AdminSportCategory }>(`/admin/sports/${sportId}/categories/`, input);
    return data.category;
  },
  updateCategory: async (sportId: string, categoryId: string, input: Partial<CreateCategoryInput>) => {
    const { data } = await adminApi.patch<{ category: AdminSportCategory }>(
      `/admin/sports/${sportId}/categories/${categoryId}/`,
      input,
    );
    return data.category;
  },
  deleteCategory: async (sportId: string, categoryId: string) => {
    await adminApi.delete(`/admin/sports/${sportId}/categories/${categoryId}/`);
  },
  listFields: async (sportId: string, section?: FieldSection): Promise<AdminSportField[]> => {
    const q = section ? `?section=${section}` : "";
    const { data } = await adminApi.get<{ fields: AdminSportField[] }>(`/admin/sports/${sportId}/fields/${q}`);
    return data.fields;
  },
  createField: async (sportId: string, input: CreateFieldInput): Promise<AdminSportField> => {
    const { data } = await adminApi.post<{ field: AdminSportField }>(`/admin/sports/${sportId}/fields/`, input);
    return data.field;
  },
  updateField: async (sportId: string, fieldId: string, input: Partial<CreateFieldInput>) => {
    const { data } = await adminApi.patch<{ field: AdminSportField }>(`/admin/sports/${sportId}/fields/${fieldId}/`, input);
    return data.field;
  },
  deleteField: async (sportId: string, fieldId: string) => {
    await adminApi.delete(`/admin/sports/${sportId}/fields/${fieldId}/`);
  },
  listOptions: async (fieldId: string): Promise<AdminFieldOption[]> => {
    const { data } = await adminApi.get<{ options: AdminFieldOption[] }>(`/admin/fields/${fieldId}/options/`);
    return data.options;
  },
  createOption: async (fieldId: string, input: CreateFieldOptionInput) => {
    const { data } = await adminApi.post<{ option: AdminFieldOption }>(`/admin/fields/${fieldId}/options/`, input);
    return data.option;
  },
  updateOption: async (fieldId: string, optionId: string, input: Partial<CreateFieldOptionInput>) => {
    const { data } = await adminApi.patch<{ option: AdminFieldOption }>(`/admin/fields/${fieldId}/options/${optionId}/`, input);
    return data.option;
  },
  deleteOption: async (fieldId: string, optionId: string) => {
    await adminApi.delete(`/admin/fields/${fieldId}/options/${optionId}/`);
  },
  listMetrics: async (sportId: string): Promise<AdminSportMetric[]> => {
    const { data } = await adminApi.get<{ metrics: AdminSportMetric[] }>(`/admin/sports/${sportId}/metrics/`);
    return data.metrics;
  },
  createMetric: async (sportId: string, input: CreateMetricInput) => {
    const { data } = await adminApi.post<{ metric: AdminSportMetric }>(`/admin/sports/${sportId}/metrics/`, input);
    return data.metric;
  },
  updateMetric: async (metricId: string, input: Partial<CreateMetricInput>) => {
    const { data } = await adminApi.patch<{ metric: AdminSportMetric }>(`/admin/metrics/${metricId}/`, input);
    return data.metric;
  },
  deleteMetric: async (metricId: string) => {
    await adminApi.delete(`/admin/metrics/${metricId}/`);
  },
};
