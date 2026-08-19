import { Button } from "#/components/ui/button";
import { CareerStatisticsTable } from "#/features/player/components/CareeerStatisticTable";
import { PlayerLayout } from "#/features/player/components/PlayerLayout";
import { SportTabs } from "#/features/player/components/SportTabs";
import { extractApiError } from "#/lib/api/axios";
import { useCareerByTeam, useCareerStats, useHideTeam, useUnhideTeam } from "#/features/player/hooks/useCareerStats";
import { useSelectedSport } from "#/features/player/hooks/useSelectedSport";
import { createFileRoute } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { CareerStatsResponse, CareerTeamStat, TeamVisibilityInput } from "#/features/player/types";

export const Route = createFileRoute("/_authenticated/player/career")({
  ssr: false,
  head: () => ({ meta: [{ title: "Career Statistics — Spotig" }] }),
  component: PlayerCareerPage,
});

function visibilityInput(sportId: string, team: CareerTeamStat): TeamVisibilityInput {
  if (team.teamOrgId) return { sportId, teamOrgId: team.teamOrgId };
  return { sportId, teamName: team.teamLabel };
}

function PlayerCareerPage() {
  const { sportId, setSportId, profiles } = useSelectedSport();
  const [view, setView] = useState<"team" | "category">("team");
  const [categoryId, setCategoryId] = useState<string>("all");
  const byTeam = useCareerByTeam(sportId);
  const overall = useCareerStats(sportId);
  const hide = useHideTeam();
  const unhide = useUnhideTeam();

  const categories = overall.data?.categories ?? [];
  const filtered: CareerStatsResponse | undefined = useMemo(() => {
    if (!overall.data) return undefined;
    if (categoryId === "all") return overall.data;
    return {
      ...overall.data,
      categories: overall.data.categories.filter((c) => (c.categoryId ?? "uncategorized") === categoryId),
    };
  }, [overall.data, categoryId]);

  return (
    <PlayerLayout>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl">Career statistics</h1>
        <div className="flex gap-2">
          <Button variant={view === "team" ? "default" : "outline"} size="sm" onClick={() => setView("team")}>
            By team
          </Button>
          <Button variant={view === "category" ? "default" : "outline"} size="sm" onClick={() => setView("category")}>
            By category
          </Button>
        </div>
      </div>
      <SportTabs profiles={profiles} value={sportId} onChange={setSportId} />

      {view === "team" ? (
        <div className="space-y-6">
          {(byTeam.data?.teams ?? []).map((team) => (
            <div key={team.teamKey} className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">{team.teamLabel}</h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const mutate = team.isHidden ? unhide : hide;
                    mutate.mutate(visibilityInput(sportId, team), {
                      onSuccess: () => toast.success(team.isHidden ? "Team unhidden" : "Team hidden"),
                      onError: (err) => toast.error(extractApiError(err, "Failed to update visibility")),
                    });
                  }}
                >
                  {team.isHidden ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                  {team.isHidden ? "Unhide" : "Hide"}
                </Button>
              </div>
              <CareerStatisticsTable
                career={{
                  sportId,
                  categories: [
                    {
                      categoryId: team.teamKey,
                      categoryName: `${team.matchesPlayed} matches`,
                      matchesPlayed: team.matchesPlayed,
                      resultBreakdown: team.resultBreakdown,
                      metrics: team.metrics,
                    },
                  ],
                }}
              />
            </div>
          ))}
          {!byTeam.data?.teams.length ? <p className="text-sm text-muted-foreground">No team stats yet.</p> : null}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant={categoryId === "all" ? "default" : "outline"} onClick={() => setCategoryId("all")}>
              All
            </Button>
            {categories.map((c) => {
              const id = c.categoryId ?? "uncategorized";
              return (
                <Button key={id} size="sm" variant={categoryId === id ? "default" : "outline"} onClick={() => setCategoryId(id)}>
                  {c.categoryName ?? "Uncategorized"}
                </Button>
              );
            })}
          </div>
          {filtered ? <CareerStatisticsTable career={filtered} /> : null}
        </div>
      )}
    </PlayerLayout>
  );
}
