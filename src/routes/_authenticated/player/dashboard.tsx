import { AdvertisementCard } from "#/features/player/components/AdvertisementCard";
import { CareerStatisticsTable } from "#/features/player/components/CareeerStatisticTable";
import { DashboardSkeleton } from "#/features/player/components/DashboardSkeleton";
import { EarningsCard } from "#/features/player/components/EarningsCard";
import { LatestResultsCard } from "#/features/player/components/LatestResultsCard";
import { MatchOverviewCard } from "#/features/player/components/MatchOverviewCard";
import { PlayerLayout } from "#/features/player/components/PlayerLayout";
import { PlayerProfileCard } from "#/features/player/components/PlayerProfileCard";
import { RecentMatchesTable } from "#/features/player/components/RecentmstchesTable";
import { AddSportProfileDialog } from "#/features/player/components/AddSportProfileDialog";
import { SportTabs } from "#/features/player/components/SportTabs";
import { TeamsCard } from "#/features/player/components/TeamsCard";
import { UpcomingMatchCard } from "#/features/player/components/UpcomingMatchcard";
import { Button } from "#/components/ui/button";
import { useDashboard } from "#/features/player/hooks";
import { useSportProfiles } from "#/features/player/hooks/useSportProfiles";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_authenticated/player/dashboard")({
  ssr: false,
  head: () => ({ meta: [{ title: "Player Dashboard — Spotig" }] }),
  component: PlayerDashboardPage,
});

const SPORT_KEY = "player.dashboard.sportId";

function PlayerDashboardPage() {
  const { data: profiles } = useSportProfiles();
  const [sportId, setSportId] = useState<string>(() => localStorage.getItem(SPORT_KEY) ?? "");
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    if (!sportId && profiles?.length) setSportId(profiles[0].sportId);
  }, [profiles, sportId]);
  useEffect(() => {
    if (sportId) localStorage.setItem(SPORT_KEY, sportId);
  }, [sportId]);

  const { data, isLoading } = useDashboard(sportId);

  return (
    <PlayerLayout>
      <PlayerProfileCard sportId={sportId} />
      {isLoading || !data ? (
        <DashboardSkeleton />
      ) : (
        <>
          <AdvertisementCard height="h-32 md:h-40" />
          <div className="flex flex-wrap items-center gap-3">
            <SportTabs profiles={profiles ?? []} value={sportId} onChange={setSportId} />
            <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" />
              Add sport
            </Button>
          </div>
          <EarningsCard />
          <MatchOverviewCard sportId={sportId} />

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-6 min-w-0">
              <RecentMatchesTable matches={data.recentMatches} />
              <CareerStatisticsTable career={data.career} />
            </div>

            <aside className="space-y-6">
              <AdvertisementCard height="h-56" />
              <LatestResultsCard results={data.latestResults} />
              <UpcomingMatchCard match={data.upcomingMatch} />
              <TeamsCard sportId={sportId} />
            </aside>
          </div>
        </>
      )}
      <AddSportProfileDialog open={addOpen} onOpenChange={setAddOpen} />
    </PlayerLayout>
  );
}
