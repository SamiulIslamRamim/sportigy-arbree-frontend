import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import type { CareerStatsResponse } from "../types";

export function CareerStatisticsTable({ career }: { career: CareerStatsResponse }) {
  if (!career.categories.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Career statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No approved matches yet.</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Career statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {career.categories.map((cat) => (
          <section key={cat.categoryId ?? "uncategorized"}>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold">{cat.categoryName ?? "Uncategorized"}</h3>
              <span className="text-xs text-muted-foreground">{cat.matchesPlayed} matches</span>
            </div>
            {cat.metrics.map((m) => (
              <div key={m.metricId ?? m.metric} className="mb-3">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {m.metric}
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {m.fields.map((f) => (
                    <div key={f.fieldId} className="rounded-lg border bg-muted/30 p-2">
                      <p className="truncate text-xs text-muted-foreground">{f.name}</p>
                      <p className="text-lg font-semibold">{f.isComputed ? (f.value ?? "—") : f.total}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        ))}
      </CardContent>
    </Card>
  );
}
