import { useMemo } from "react";
import { Badge } from "#/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Skeleton } from "#/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/components/ui/table";
import { useCareerStats } from "../hooks/useCareerStats";
import type { CareerCategoryStats, CareerFieldStat } from "../types/career.types";

interface MetricTable {
  key: string;
  label: string;
  fields: CareerFieldStat[];
}

function buildMetricTables(categories: CareerCategoryStats[]): MetricTable[] {
  const ordered = new Map<string, { label: string; fields: CareerFieldStat[] }>();
  for (const category of categories) {
    for (const metric of category.metrics) {
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

const cellValue = (
  category: CareerCategoryStats,
  tableKey: string,
  fieldId: string,
): string => {
  const metric = category.metrics.find((m) => (m.metricId ?? m.metric) === tableKey);
  const field = metric?.fields.find((f) => f.fieldId === fieldId);
  if (!field) return "\u2013";
  const n = field.isComputed ? field.value : field.total;
  if (n === null || n === undefined) return "\u2013";
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
};

export function CareerStatisticsTable({ sportId }: { sportId: string | null }) {
  const { data, isLoading, isError } = useCareerStats(sportId);

  const tables = useMemo(
    () => (data ? buildMetricTables(data.categories) : []),
    [data],
  );

  return (
    <Card className="overflow-hidden border-border/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold">Career Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-0 pb-0">
        {!sportId && (
          <p className="px-6 pb-4 text-sm text-muted-foreground">
            Add a sport profile to see your career statistics.
          </p>
        )}

        {isLoading && (
          <div className="space-y-3 px-6 pb-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        )}

        {isError && (
          <p className="px-6 pb-4 text-sm text-destructive">
            Failed to load career statistics. Please try again.
          </p>
        )}

        {data && data.categories.length === 0 && (
          <p className="px-6 pb-4 text-sm text-muted-foreground">
            No approved matches yet — stats will appear once matches are approved.
          </p>
        )}

        {data &&
          tables.map((table) => (
            <Section key={table.key} title={table.label}>
              <div className="max-h-64 overflow-auto">
                <Table className="w-full table-fixed">
                  <colgroup>
                    <col className="w-28" />
                    {table.fields.map((field) => (
                      <col key={field.fieldId} />
                    ))}
                  </colgroup>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="sticky top-0 z-10 bg-muted pl-6">
                        Format
                      </TableHead>
                      {table.fields.map((field) => (
                        <TableHead
                          key={field.fieldId}
                          title={field.name}
                          className="truncate text-right"
                        >
                          {field.name}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.categories.map((category) => (
                      <TableRow key={category.categoryId ?? "uncategorized"}>
                        <TableCell className="pl-6">
                          <Badge variant="secondary" className="max-w-full truncate rounded-md">
                            {category.categoryName ?? "Uncategorized"}
                          </Badge>
                        </TableCell>
                        {table.fields.map((field) => (
                          <TableCell
                            key={field.fieldId}
                            className="text-right tabular-nums"
                          >
                            {cellValue(category, table.key, field.fieldId)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Section>
          ))}
      </CardContent>
    </Card>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <h4 className="px-6 pb-2 text-sm font-semibold text-muted-foreground">{title}</h4>
      {children}
    </div>
  );
}
