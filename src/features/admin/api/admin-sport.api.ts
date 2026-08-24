import { unwrap } from "#/lib/api/axios";
import type { ApiEnvelope } from "#/lib/api/axios";
import { adminApi } from "./admin-auth.api";
import type {
  AdminFieldOption,
  AdminSport,
  AdminSportCategory,
  AdminSportDetail,
  AdminSportField,
  AdminSportMetric,
  CategoryPayload,
  FieldOptionPayload,
  FieldPayload,
  FieldSection,
  MetricPayload,
  SportPayload,
} from "../types/admin-sport.types";

/** Every mutation returns the backend `message` so the UI can toast it verbatim. */
export interface MutationResult<T> {
  data: T;
  message: string;
}

/* ---------------- Sports ---------------- */

export const adminSportApi = {
  list: async (isActive?: boolean): Promise<AdminSport[]> => {
    const res = await adminApi.get<
      ApiEnvelope<{ sports: AdminSport[] }>
    >("/admin/sports/", {
      params:
        isActive === undefined
          ? undefined
          : { isActive: String(isActive) },
    });

    return unwrap(res).sports ?? [];
  },

  detail: async (sportId: string): Promise<AdminSportDetail> => {
    const res = await adminApi.get<
      ApiEnvelope<{ sport: AdminSportDetail }>
    >(`/admin/sports/${sportId}/`);

    return unwrap(res).sport;
  },

  create: async (
    payload: SportPayload,
  ): Promise<MutationResult<AdminSport>> => {
    const res = await adminApi.post<
      ApiEnvelope<{ sport: AdminSport }>
    >("/admin/sports/", payload);

    const data = unwrap(res);

    return {
      data: data.sport,
      message: res.data.message ?? "Sport created successfully.",
    };
  },

  update: async (
    sportId: string,
    payload: SportPayload,
  ): Promise<MutationResult<AdminSport>> => {
    const res = await adminApi.patch<
      ApiEnvelope<{ sport: AdminSport }>
    >(`/admin/sports/${sportId}/`, payload);

    const data = unwrap(res);

    return {
      data: data.sport,
      message: res.data.message ?? "Sport updated successfully.",
    };
  },

  remove: async (
    sportId: string,
  ): Promise<MutationResult<{ id: string }>> => {
    const res = await adminApi.delete<
      ApiEnvelope<{ id: string }>
    >(`/admin/sports/${sportId}/`);

    const data = unwrap(res);

    return {
      data,
      message: res.data.message ?? "Sport deleted successfully.",
    };
  },
};

/* ---------------- Categories ---------------- */

export const adminCategoryApi = {
  list: async (
    sportId: string,
  ): Promise<AdminSportCategory[]> => {
    const res = await adminApi.get<
      ApiEnvelope<{ categories: AdminSportCategory[] }>
    >(`/admin/sports/${sportId}/categories/`);

    return unwrap(res).categories ?? [];
  },

  create: async (
    sportId: string,
    payload: CategoryPayload,
  ): Promise<MutationResult<AdminSportCategory>> => {
    const res = await adminApi.post<
      ApiEnvelope<{ category: AdminSportCategory }>
    >(`/admin/sports/${sportId}/categories/`, payload);

    const data = unwrap(res);

    return {
      data: data.category,
      message: res.data.message ?? "Category created successfully.",
    };
  },

  update: async (
    sportId: string,
    categoryId: string,
    payload: CategoryPayload,
  ): Promise<MutationResult<AdminSportCategory>> => {
    const res = await adminApi.patch<
      ApiEnvelope<{ category: AdminSportCategory }>
    >(
      `/admin/sports/${sportId}/categories/${categoryId}/`,
      payload,
    );

    const data = unwrap(res);

    return {
      data: data.category,
      message: res.data.message ?? "Category updated successfully.",
    };
  },

  remove: async (
    sportId: string,
    categoryId: string,
  ): Promise<MutationResult<{ id: string }>> => {
    const res = await adminApi.delete<
      ApiEnvelope<{ id: string }>
    >(
      `/admin/sports/${sportId}/categories/${categoryId}/`,
    );

    const data = unwrap(res);

    return {
      data,
      message: res.data.message ?? "Category deleted successfully.",
    };
  },
};

/* ---------------- Metrics ---------------- */

export const adminMetricApi = {
  list: async (
    sportId: string,
  ): Promise<AdminSportMetric[]> => {
    const res = await adminApi.get<
      ApiEnvelope<{ metrics: AdminSportMetric[] }>
    >(`/admin/sports/${sportId}/metrics/`);

    return unwrap(res).metrics ?? [];
  },

  create: async (
    sportId: string,
    payload: MetricPayload,
  ): Promise<MutationResult<AdminSportMetric>> => {
    const res = await adminApi.post<
      ApiEnvelope<{ metric: AdminSportMetric }>
    >(`/admin/sports/${sportId}/metrics/`, payload);

    const data = unwrap(res);

    return {
      data: data.metric,
      message: res.data.message ?? "Metric created successfully.",
    };
  },

  /** Flat route — metrics are updated by id, not nested under the sport. */
  update: async (
    metricId: string,
    payload: MetricPayload,
  ): Promise<MutationResult<AdminSportMetric>> => {
    const res = await adminApi.patch<
      ApiEnvelope<{ metric: AdminSportMetric }>
    >(`/admin/metrics/${metricId}/`, payload);

    const data = unwrap(res);

    return {
      data: data.metric,
      message: res.data.message ?? "Metric updated successfully.",
    };
  },

  remove: async (
    metricId: string,
  ): Promise<MutationResult<{ id: string }>> => {
    const res = await adminApi.delete<
      ApiEnvelope<{ id: string }>
    >(`/admin/metrics/${metricId}/`);

    const data = unwrap(res);

    return {
      data,
      message: res.data.message ?? "Metric deleted successfully.",
    };
  },
};

/* ---------------- Fields ---------------- */

export const adminFieldApi = {
  list: async (
    sportId: string,
    section?: FieldSection,
  ): Promise<AdminSportField[]> => {
    const res = await adminApi.get<
      ApiEnvelope<{ fields: AdminSportField[] }>
    >(`/admin/sports/${sportId}/fields/`, {
      params: section ? { section } : undefined,
    });

    return unwrap(res).fields ?? [];
  },

  detail: async (
    sportId: string,
    fieldId: string,
  ): Promise<AdminSportField> => {
    const res = await adminApi.get<
      ApiEnvelope<{ field: AdminSportField }>
    >(`/admin/sports/${sportId}/fields/${fieldId}/`);

    return unwrap(res).field;
  },

  create: async (
    sportId: string,
    payload: FieldPayload,
  ): Promise<MutationResult<AdminSportField>> => {
    const res = await adminApi.post<
      ApiEnvelope<{ field: AdminSportField }>
    >(`/admin/sports/${sportId}/fields/`, payload);

    const data = unwrap(res);

    return {
      data: data.field,
      message: res.data.message ?? "Field created successfully.",
    };
  },

  update: async (
    sportId: string,
    fieldId: string,
    payload: FieldPayload,
  ): Promise<MutationResult<AdminSportField>> => {
    const res = await adminApi.patch<
      ApiEnvelope<{ field: AdminSportField }>
    >(
      `/admin/sports/${sportId}/fields/${fieldId}/`,
      payload,
    );

    const data = unwrap(res);

    return {
      data: data.field,
      message: res.data.message ?? "Field updated successfully.",
    };
  },

  remove: async (
    sportId: string,
    fieldId: string,
  ): Promise<MutationResult<{ id: string }>> => {
    const res = await adminApi.delete<
      ApiEnvelope<{ id: string }>
    >(
      `/admin/sports/${sportId}/fields/${fieldId}/`,
    );

    const data = unwrap(res);

    return {
      data,
      message: res.data.message ?? "Field deleted successfully.",
    };
  },
};

/* ---------------- Field options ---------------- */

export const adminFieldOptionApi = {
  list: async (
    fieldId: string,
  ): Promise<AdminFieldOption[]> => {
    const res = await adminApi.get<
      ApiEnvelope<{ options: AdminFieldOption[] }>
    >(`/admin/fields/${fieldId}/options/`);

    return unwrap(res).options;
  },

  create: async (
    fieldId: string,
    payload: FieldOptionPayload,
  ): Promise<MutationResult<AdminFieldOption>> => {
    const res = await adminApi.post<
      ApiEnvelope<{ option: AdminFieldOption }>
    >(`/admin/fields/${fieldId}/options/`, payload);

    const data = unwrap(res);

    return {
      data: data.option,
      message: res.data.message ?? "Option created successfully.",
    };
  },

  update: async (
    fieldId: string,
    optionId: string,
    payload: FieldOptionPayload,
  ): Promise<MutationResult<AdminFieldOption>> => {
    const res = await adminApi.patch<
      ApiEnvelope<{ option: AdminFieldOption }>
    >(
      `/admin/fields/${fieldId}/options/${optionId}/`,
      payload,
    );

    const data = unwrap(res);

    return {
      data: data.option,
      message: res.data.message ?? "Option updated successfully.",
    };
  },

  remove: async (
    fieldId: string,
    optionId: string,
  ): Promise<MutationResult<{ id: string }>> => {
    const res = await adminApi.delete<
      ApiEnvelope<{ id: string }>
    >(
      `/admin/fields/${fieldId}/options/${optionId}/`,
    );

    const data = unwrap(res);

    return {
      data,
      message: res.data.message ?? "Option deleted successfully.",
    };
  },
};