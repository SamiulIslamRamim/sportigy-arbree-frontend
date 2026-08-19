import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { extractApiError } from "#/lib/api/axios";
import { Eye, EyeOff } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useCareerByTeam, useHideTeam, useUnhideTeam } from "../hooks/useCareerStats";
import type { TeamVisibilityInput } from "../types";

function visibilityInput(sportId: string, teamOrgId: string | null, teamLabel: string): TeamVisibilityInput {
  if (teamOrgId) return { sportId, teamOrgId };
  return { sportId, teamName: teamLabel };
}

export function TeamsCard({ sportId }: { sportId: string }) {
  const { data, isLoading } = useCareerByTeam(sportId);
  const hide = useHideTeam();
  const unhide = useUnhideTeam();
  const teams = data?.teams ?? [];

  const toggle = (team: (typeof teams)[number]) => {
    const input = visibilityInput(sportId, team.teamOrgId, team.teamLabel);
    const mutate = team.isHidden ? unhide : hide;
    mutate.mutate(input, {
      onSuccess: () => toast.success(team.isHidden ? "Team unhidden" : "Team hidden"),
      onError: (err) => toast.error(extractApiError(err, "Failed to update team visibility")),
    });
  };

  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold">Teams</CardTitle>
        <Link to="/player/teams" className="text-xs font-medium text-primary hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading teams…</p>
        ) : teams.length === 0 ? (
          <p className="text-sm text-muted-foreground">No team history yet.</p>
        ) : (
          teams.map((t) => (
            <div key={t.teamKey} className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-muted/60">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-muted text-xs font-semibold">
                {t.teamLabel.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{t.teamLabel}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {t.matchesPlayed} matches{t.isHidden ? " · Hidden" : ""}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => toggle(t)}
                aria-label={t.isHidden ? "Unhide team" : "Hide team"}
              >
                {t.isHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
