import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Trophy } from "lucide-react";
import type { LatestResult } from "../types";
import { formatDate, resultLabels } from "../lib/format";


export function LatestResultsCard({ results }: { results: LatestResult[] }) {
  const r = results[0];
//   if (!r) return null;
  return (
    <Card className="overflow-hidden border-border/60">
      <CardHeader className="rounded-b-none bg-gradient-to-br from-primary to-primary/70 p-4 text-primary-foreground">
        <CardTitle className="text-center text-sm font-semibold uppercase tracking-widest">Latest Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4 text-center">
        <div className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          <Trophy className="h-3 w-3" /> {resultLabels[r.result]}
        </div>
        <p className="text-xs text-muted-foreground">{formatDate(r.date)}</p>

        <div className="flex items-center justify-around gap-3">
          <TeamBadge name={r.homeTeam} logo={r.homeTeamLogoUrl} />
          <div className="text-center">
            <div className="flex items-center gap-2 font-display text-lg">
              <span>{r.homeScore}</span>
              <span className="text-muted-foreground">—</span>
              <span>{r.awayScore}</span>
            </div>
          </div>
          <TeamBadge name={r.awayTeam} logo={r.awayTeamLogoUrl} />
        </div>

        <p className="text-sm font-semibold">{r.homeTeam} vs {r.awayTeam}</p>
        <button className="w-full text-xs font-medium text-primary hover:underline">View all</button>
      </CardContent>
    </Card>
  );
}

function TeamBadge({ name, logo }: { name: string; logo: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <img src={logo} alt={name} className="h-12 w-12 rounded-full border bg-muted" />
    </div>
  );
}
