import { api } from "#/lib/api/axios";
import type { Organization } from "../types";

export const orgSearchApi = {
  search: async (query: string, limit = 20): Promise<Organization[]> => {
    const params = new URLSearchParams({ q: query, limit: limit.toString() });
    const { data } = await api.get<{ organizations: Organization[] }>(`/organizations/?${params}`);
    return data.organizations;
  },
};
