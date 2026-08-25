import type { CareerFieldStat, CareerMetricGroup } from "../types/career.types";

export interface MetricTable {
  key: string;
  label: string;
  fields: CareerFieldStat[];
}

export function buildMetricTables(
  groups: { metrics: CareerMetricGroup[] }[],
): MetricTable[] {
  const ordered = new Map<string, { label: string; fields: CareerFieldStat[] }>();
  for (const group of groups) {
    for (const metric of group.metrics) {
      const key = metric.metricId ?? metric.metric;
      let entry = ordered.get(key);
      if (!entry) {
        entry = { label: metric.metric, fields: [] };
        ordered.set(key, entry);
      }
      for (const field of metric.fields) {
        if (!entry.fields.some((f) => f.fieldId === field.fieldId)) {
          entry.fields.push(field);
        }
      }
    }
  }
  return [...ordered.entries()]
    .map(([key, entry]) => ({ key, ...entry }))
    .filter((table) => table.fields.length > 0);
}

export function metricCellValue(
  group: { metrics: CareerMetricGroup[] },
  tableKey: string,
  fieldId: string,
): string {
  const metric = group.metrics.find((m) => (m.metricId ?? m.metric) === tableKey);
  const field: CareerFieldStat | undefined = metric?.fields.find(
    (f) => f.fieldId === fieldId,
  );
  if (!field) return "\u2013";
  const n = field.isComputed ? field.value : field.total;
  if (n === null || n === undefined) return "\u2013";
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
}
