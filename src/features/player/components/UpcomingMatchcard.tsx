import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { countdown } from "../lib/format";
import type { UpcomingMatch } from "../types";


export function UpcomingMatchCard({ match }: { match: UpcomingMatch }) {
  const date = new Date(match.date);
  return (
    <Card className="overflow-hidden border-border/60 [--card-spacing:--spacing(0)]">
      <CardHeader className="rounded-b-none bg-gradient-to-br from-slate-800 to-slate-900 p-4 text-white">
        <CardTitle className="text-center text-sm font-semibold uppercase tracking-widest">Next Match</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4 text-center">
        <p className="text-xs text-muted-foreground">
          {date.toLocaleDateString("en-US", { weekday: "long", day: "2-digit", month: "short", year: "numeric" })}
        </p>
        <div className="flex items-center justify-around gap-3">
          <div className="flex flex-col items-center gap-1">
            <img src={match.homeTeamLogoUrl} className="h-12 w-12 rounded-full border bg-muted" alt={match.homeTeam} />
            <span className="text-xs font-semibold">{match.homeTeam}</span>
          </div>
          <span className="font-display text-2xl text-muted-foreground">VS</span>
          <div className="flex flex-col items-center gap-1">
            <img src={match.opponentLogoUrl} className="h-12 w-12 rounded-full border bg-muted" alt={match.opponent} />
            <span className="text-xs font-semibold">{match.opponent}</span>
          </div>
        </div>
        <div className="rounded-lg bg-muted/60 py-2 text-sm font-semibold">{countdown(match.date)}</div>
        <button className="w-full text-xs font-medium text-primary hover:underline">View all matches</button>
      </CardContent>
    </Card>
  );
}
