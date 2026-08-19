import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { PlayerLayout } from "#/features/player/components/PlayerLayout";
import { SportTabs } from "#/features/player/components/SportTabs";
import { extractApiError } from "#/lib/api/axios";
import { useCareerByTeam, useHideTeam, useUnhideTeam } from "#/features/player/hooks/useCareerStats";
import { useSelectedSport } from "#/features/player/hooks/useSelectedSport";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import type { CareerTeamStat, TeamVisibilityInput } from "#/features/player/types";

export const Route = createFileRoute("/_authenticated/player/teams")({
  ssr: false,
  head: () => ({ meta: [{ title: "Team History — Spotig" }] }),
  component: PlayerTeamsPage,
});

function visibilityInput(sportId: string, team: CareerTeamStat): TeamVisibilityInput {
  if (team.teamOrgId) return { sportId, teamOrgId: team.teamOrgId };
  return { sportId, teamName: team.teamLabel };
}

function PlayerTeamsPage() {
  const { sportId, setSportId, profiles } = useSelectedSport();
  const { data, isLoading } = useCareerByTeam(sportId);
  const hide = useHideTeam();
  const unhide = useUnhideTeam();

  return (
    <PlayerLayout>
      <h1 className="font-display text-2xl">Team history</h1>
      <SportTabs profiles={profiles} value={sportId} onChange={setSportId} />
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Teams</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : (data?.teams ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No teams yet.</p>
          ) : (
            data!.teams.map((t) => (
              <div key={t.teamKey} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">{t.teamLabel}</p>
                  <p className="text-xs text-muted-foreground">
                    {t.matchesPlayed} matches{t.isHidden ? " · Hidden" : ""}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const mutate = t.isHidden ? unhide : hide;
                    mutate.mutate(visibilityInput(sportId, t), {
                      onSuccess: () => toast.success(t.isHidden ? "Team unhidden" : "Team hidden"),
                      onError: (err) => toast.error(extractApiError(err, "Failed to update visibility")),
                    });
                  }}
                >
                  {t.isHidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </PlayerLayout>
  );
}
