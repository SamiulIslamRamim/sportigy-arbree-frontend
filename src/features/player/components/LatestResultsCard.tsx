import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Link } from "@tanstack/react-router";
import { Trophy } from "lucide-react";
import type { PlayerMatch } from "../types";
import { dash, formatDate, resultLabels } from "../lib/format";

export function LatestResultsCard({ results }: { results: PlayerMatch[] }) {
  const r = results[0];
  if (!r) {
    return (
      <Card className="overflow-hidden border-border/60">
        <CardHeader className="rounded-b-none bg-gradient-to-br from-primary to-primary/70 p-4 text-primary-foreground">
          <CardTitle className="text-center text-sm font-semibold uppercase tracking-widest">Latest Results</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center text-sm text-muted-foreground">No results yet.</CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-border/60 [--card-spacing:--spacing(0)]">
      <CardHeader className="rounded-b-none bg-gradient-to-br from-primary to-primary/70 p-4 text-primary-foreground">
        <CardTitle className="text-center text-sm font-semibold uppercase tracking-widest">Latest Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4 text-center">
        <div className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          <Trophy className="h-3 w-3" /> {resultLabels[r.result]}
        </div>
        <p className="text-xs text-muted-foreground">{formatDate(r.matchDate)}</p>
        <p className="text-sm font-semibold">
          {dash(r.homeTeam)} vs {dash(r.awayTeam)}
        </p>
        <p className="text-xs text-muted-foreground">{dash(r.venue)}</p>
        <Link to="/player/matches" className="block w-full text-xs font-medium text-primary hover:underline">
          View all
        </Link>
      </CardContent>
    </Card>
  );
}
