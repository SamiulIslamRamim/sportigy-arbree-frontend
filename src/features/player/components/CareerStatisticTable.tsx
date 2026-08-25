import { Loader2 } from "lucide-react";
import { Badge } from "#/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/components/ui/table";
import { useCareerStats } from "../hooks/useCareerStats";

interface ColumnDef {
  fieldId: string;
  name: string;
  slug: string;
}

function formatSlug(slug: string): string {
  return slug
    .split("_")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function CareerStatisticsTable({ sportId }: { sportId: string | null }) {
  const { data, isLoading } = useCareerStats(sportId);

  if (!sportId) return null;

  if (isLoading || !data) {
    return (
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Career Statistics</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const { categories } = data;

  // Ordered, deduped list of metrics across all categories
  const metricOrder: { metricId: string | null; metric: string }[] = [];
  const seenMetric = new Set<string>();
  for (const cat of categories) {
    for (const m of cat.metrics) {
      const key = m.metricId ?? m.metric;
      if (!seenMetric.has(key)) {
        seenMetric.add(key);
        metricOrder.push({ metricId: m.metricId, metric: m.metric });
      }
    }
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold">Career Statistics</CardTitle>
      </CardHeader>
      {metricOrder.length === 0 ? (
        <p className="text-center text-red-500">There is no Career Statistic for the sport</p>
      ) : (
        <CardContent className="space-y-6 px-0 pb-0">
        {metricOrder.map(({ metricId, metric }) => {
          const matchKey = metricId ?? metric;

          // Union of columns for this metric across all categories
          const columns: ColumnDef[] = [];
          const seenField = new Set<string>();
          for (const cat of categories) {
            const entry = cat.metrics.find((m) => (m.metricId ?? m.metric) === matchKey);
            for (const f of entry?.fields ?? []) {
              if (!seenField.has(f.fieldId)) {
                seenField.add(f.fieldId);
                columns.push({ fieldId: f.fieldId, name: f.name, slug: f.slug });
              }
            }
          }

          if (columns.length === 0) return null; // e.g. Fielding with no configured fields

          return (
            <Section key={matchKey} title={metric}>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="pl-6">Format</TableHead>
                      {columns.map((c) => (
                        <TableHead key={c.fieldId} className="text-center" title={formatSlug(c.slug)}>
                          {c.name}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((cat) => {
                      const entry = cat.metrics.find((m) => (m.metricId ?? m.metric) === matchKey);
                      const fieldMap = new Map(entry?.fields.map((f) => [f.fieldId, f]) ?? []);
                      return (
                        <TableRow key={cat.categoryId ?? cat.categoryName}>
                          <TableCell className="pl-6">
                            <Badge variant="secondary" className="rounded-md">
                              {cat.categoryName}
                            </Badge>
                          </TableCell>
                          {columns.map((c) => {
                            const f = fieldMap.get(c.fieldId);
                            const raw = f ? (f.isComputed ? f.value : f.total) : undefined;
                            return (
                              <TableCell key={c.fieldId} className="text-center tabular-nums">
                                {raw === null || raw === undefined ? "-" : String(raw)}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </Section>
          );
        })}
      </CardContent>
      )}
    </Card>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="px-6 pb-2 text-sm font-semibold text-muted-foreground">{title}</h4>
      {children}
    </div>
  );
}