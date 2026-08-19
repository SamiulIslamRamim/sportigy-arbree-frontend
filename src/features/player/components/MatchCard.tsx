import { Card, CardContent } from "#/components/ui/card";
import { dash, formatDate, resultLabels } from "../lib/format";
import type { PlayerMatch } from "../types";
import { MatchStatusBadge } from "./MatchStatusBadge";

export function MatchCard({ match, onClick }: { match: PlayerMatch; onClick: () => void }) {
  return (
    <button type="button" className="w-full text-left" onClick={onClick}>
      <Card className="border-border/60 transition-colors hover:bg-muted/40">
        <CardContent className="flex items-center justify-between gap-4 p-4">
          <div className="min-w-0">
            <p className="truncate font-semibold">
              {dash(match.homeTeam)} vs {dash(match.awayTeam)}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDate(match.matchDate)} · {dash(match.venue)} · {resultLabels[match.result]}
            </p>
          </div>
          <MatchStatusBadge status={match.status} />
        </CardContent>
      </Card>
    </button>
  );
}
