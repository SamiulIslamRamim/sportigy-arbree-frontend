import { Sheet, SheetContent } from "#/components/ui/sheet";
import { AdvertisementCard } from "#/features/player/components/AdvertisementCard";
import { CareerStatisticsTable } from "#/features/player/components/CareeerStatisticTable";
import { DashboardSkeleton } from "#/features/player/components/DashboardSkeleton";
import { LatestResultsCard } from "#/features/player/components/LatestResultsCard";
import { PlayerProfileCard } from "#/features/player/components/PlayerProfileCard";
import { RecentMatchesTable } from "#/features/player/components/RecentmstchesTable";
import { PlayerSidebar } from "#/features/player/components/Sidebar";
import { SportTabs } from "#/features/player/components/SportTabs";
import { StatsCard } from "#/features/player/components/StatsCard";
import { TeamsCard } from "#/features/player/components/TeamsCard";
import { TopNavbar } from "#/features/player/components/TopNavbar";
import { UpcomingMatchCard } from "#/features/player/components/UpcomingMatchcard";
import { useDashboard } from "#/features/player/hooks";
import { formatCurrency } from "#/features/player/lib/format";
import type { SportKey } from "#/features/player/types";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/player/dashboard")({
  head: () => ({ meta: [{ title: "Player Dashboard — Spotig" }] }),
  component: PlayerDashboardPage,
});

function PlayerDashboardPage() {
  const { data, isLoading } = useDashboard();
  const [sport, setSport] = useState<SportKey>("cricket");
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        {/* Desktop sidebar */}
        <div className="hidden w-64 shrink-0 border-r bg-card lg:block">
          <div className="sticky top-0 h-screen">
            <PlayerSidebar />
          </div>
        </div>

        {/* Mobile drawer */}
        <Sheet open={mobileNav} onOpenChange={setMobileNav}>
          <SheetContent side="left" className="w-72 p-0">
            <PlayerSidebar onNavigate={() => setMobileNav(false)} />
          </SheetContent>
        </Sheet>

        <div className="min-w-0 flex-1">
          <TopNavbar onMenuClick={() => setMobileNav(true)} />

          <main className="mx-auto max-w-[1400px] space-y-6 p-4 md:p-6">
            <PlayerProfileCard />
            {isLoading || !data ? (
              <DashboardSkeleton />
            ) : (
              <>
                <AdvertisementCard height="h-32 md:h-40" />


                <SportTabs value={sport} onChange={setSport} />

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                  <div className="space-y-6 min-w-0">
                    <div className="grid gap-4 md:grid-cols-2">
                      <StatsCard
                        title="Earnings Overview"
                        items={[
                          { label: "This month", value: formatCurrency(data.earnings.thisMonth, data.earnings.currency) },
                          { label: "Last 3 months", value: formatCurrency(data.earnings.lastThreeMonths, data.earnings.currency) },
                          { label: "This year", value: formatCurrency(data.earnings.thisYear, data.earnings.currency) },
                        ]}
                        footer={
                          <button className="w-full pt-1 text-sm font-medium text-primary hover:underline">
                            View all transactions
                          </button>
                        }
                      />
                      <StatsCard
                        title="Match Overview"
                        items={[
                          { label: "This month", value: data.matchOverview.thisMonth, hint: "matches" },
                          { label: "Last 3 months", value: data.matchOverview.lastThreeMonths, hint: "matches" },
                          { label: "This year", value: data.matchOverview.thisYear, hint: "matches" },
                        ]}
                        footer={
                          <button className="w-full pt-1 text-sm font-medium text-primary hover:underline">
                            View all overview
                          </button>
                        }
                      />
                    </div>

                    <RecentMatchesTable matches={data.recentMatches} />
                    <CareerStatisticsTable career={data.career} />
                  </div>

                  <aside className="space-y-6">
                    <AdvertisementCard height="h-56" />
                    <LatestResultsCard results={data.latestResults} />
                    <UpcomingMatchCard match={data.upcomingMatch} />
                    <TeamsCard teams={data.teams} />
                  </aside>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
