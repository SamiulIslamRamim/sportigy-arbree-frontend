import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { mockEarnings, mockTransactions } from "#/mock/earnings";
import { formatCurrency, formatDate } from "../lib/format";

export function EarningsCard() {
  const e = mockEarnings;
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base font-semibold">Earnings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border bg-muted/40 p-3">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">This month</p>
            <p className="mt-1 font-display text-xl md:text-2xl">{formatCurrency(e.thisMonth, e.currency)}</p>
          </div>
          <div className="rounded-xl border bg-muted/40 p-3">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Last 3 months</p>
            <p className="mt-1 font-display text-xl md:text-2xl">{formatCurrency(e.lastThreeMonths, e.currency)}</p>
          </div>
          <div className="rounded-xl border bg-muted/40 p-3">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">This year</p>
            <p className="mt-1 font-display text-xl md:text-2xl">{formatCurrency(e.thisYear, e.currency)}</p>
          </div>
        </div>
        <div className="space-y-2">
          {mockTransactions.map((tx) => (
            <div key={tx.id} className="flex items-center justify-between text-sm">
              <div>
                <p className="font-medium">{tx.description}</p>
                <p className="text-xs text-muted-foreground">{formatDate(tx.date)}</p>
              </div>
              <p className={tx.type === "CREDIT" ? "font-semibold text-emerald-600" : "font-semibold text-rose-600"}>
                {tx.type === "CREDIT" ? "+" : "−"}
                {formatCurrency(tx.amount, tx.currency)}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
