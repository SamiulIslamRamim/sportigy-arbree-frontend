import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { usePlayerMatches } from "../hooks/usePlayerMatches";

function countOverview(dates: string[]) {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const monthStart = new Date(y, m, 1).getTime();
  const threeStart = new Date(y, m - 2, 1).getTime();
  const yearStart = new Date(y, 0, 1).getTime();
  let thisMonth = 0;
  let lastThreeMonths = 0;
  let thisYear = 0;
  for (const iso of dates) {
    const t = new Date(iso).getTime();
    if (Number.isNaN(t)) continue;
    if (t >= yearStart) thisYear += 1;
    if (t >= threeStart) lastThreeMonths += 1;
    if (t >= monthStart) thisMonth += 1;
  }
  return { thisMonth, lastThreeMonths, thisYear };
}

export function MatchOverviewCard({ sportId }: { sportId: string }) {
  const { data, isLoading } = usePlayerMatches("approved");
  const dates = (data?.matches ?? []).filter((m) => m.sportId === sportId).map((m) => m.matchDate);
  const overview = countOverview(dates);

  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Match overview</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Counting matches…</p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border bg-muted/40 p-3">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">This month</p>
              <p className="mt-1 font-display text-xl md:text-2xl">{overview.thisMonth}</p>
            </div>
            <div className="rounded-xl border bg-muted/40 p-3">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Last 3 months</p>
              <p className="mt-1 font-display text-xl md:text-2xl">{overview.lastThreeMonths}</p>
            </div>
            <div className="rounded-xl border bg-muted/40 p-3">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">This year</p>
              <p className="mt-1 font-display text-xl md:text-2xl">{overview.thisYear}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
