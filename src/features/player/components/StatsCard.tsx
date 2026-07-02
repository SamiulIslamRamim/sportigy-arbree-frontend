import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";
import type { ReactNode } from "react";


interface Item {
  label: string;
  value: ReactNode;
  hint?: string;
}

export function StatsCard({
  title,
  items,
  footer,
  period = "This year",
  onPeriodChange,
}: {
  title: string;
  items: Item[];
  footer?: ReactNode;
  period?: string;
  onPeriodChange?: (p: string) => void;
}) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        <Select value={period} onValueChange={onPeriodChange}>
          <SelectTrigger className="h-8 w-[130px] rounded-full text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="This year">This year</SelectItem>
            <SelectItem value="Last year">Last year</SelectItem>
            <SelectItem value="All time">All time</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          {items.map((it) => (
            <div key={it.label} className="rounded-xl border bg-muted/40 p-3">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{it.label}</p>
              <p className="mt-1 truncate font-display text-xl md:text-2xl">{it.value}</p>
              {it.hint && <p className="text-[11px] text-muted-foreground">{it.hint}</p>}
            </div>
          ))}
        </div>
        {footer}
      </CardContent>
    </Card>
  );
}
