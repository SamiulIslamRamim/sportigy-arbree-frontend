import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import type { Team } from "../types";


export function TeamsCard({ teams }: { teams: Team[] }) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold">Teams</CardTitle>
        <button className="text-xs font-medium text-primary hover:underline">View all</button>
      </CardHeader>
      <CardContent className="space-y-3">
        {teams.map((t) => (
          <div key={t.id} className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/60">
            <img src={t.logoUrl} className="h-10 w-10 shrink-0 rounded-full border bg-muted" alt={t.name} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{t.name}</p>
              <p className="truncate text-xs text-muted-foreground">{t.role}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
