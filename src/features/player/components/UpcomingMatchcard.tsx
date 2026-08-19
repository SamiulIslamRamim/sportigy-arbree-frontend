import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Link } from "@tanstack/react-router";
import { countdown, dash, formatDate } from "../lib/format";
import type { PlayerMatch } from "../types";

export function UpcomingMatchCard({ match }: { match: PlayerMatch | null }) {
  if (!match) {
    return (
      <Card className="overflow-hidden border-border/60">
        <CardHeader className="rounded-b-none bg-gradient-to-br from-slate-800 to-slate-900 p-4 text-white">
          <CardTitle className="text-center text-sm font-semibold uppercase tracking-widest">Next Match</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center text-sm text-muted-foreground">No upcoming match.</CardContent>
      </Card>
    );
  }

  const team = match.homeTeam ?? match.awayTeam;

  return (
    <Card className="overflow-hidden border-border/60 [--card-spacing:--spacing(0)]">
      <CardHeader className="rounded-b-none bg-gradient-to-br from-slate-800 to-slate-900 p-4 text-white">
        <CardTitle className="text-center text-sm font-semibold uppercase tracking-widest">Next Match</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4 text-center">
        <p className="text-xs text-muted-foreground">{formatDate(match.matchDate)}</p>
        <p className="font-display text-lg">{dash(team)}</p>
        <p className="text-sm text-muted-foreground">{dash(match.venue)}</p>
        {match.result ? <p className="text-xs font-medium">{match.result}</p> : null}
        <div className="rounded-lg bg-muted/60 py-2 text-sm font-semibold">{countdown(match.matchDate)}</div>
        <Link to="/player/matches" className="block w-full text-xs font-medium text-primary hover:underline">
          View all matches
        </Link>
      </CardContent>
    </Card>
  );
}
