import { Sheet, SheetContent } from "#/components/ui/sheet";
import { CareerByTeamTable } from "#/features/player/components/CareerByTeamTable";
import { PlayerSidebar } from "#/features/player/components/Sidebar";
import { SportTabs } from "#/features/player/components/SportTabs";
import { TopNavbar } from "#/features/player/components/TopNavbar";
import { useSportProfiles } from "#/features/player/hooks/usePlayerProfile";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/player/career-stats")({
  head: () => ({ meta: [{ title: "Career Statistics — Spotig" }] }),
  component: CareerStatsPage,
});

function CareerStatsPage() {
  const { data: sportProfiles = [] } = useSportProfiles();
  const [sportId, setSportId] = useState<string | null>(null);
  const [mobileNav, setMobileNav] = useState(false);

  const activeSportId: string | null = sportId ?? sportProfiles[0]?.sportId;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        <div className="hidden w-64 shrink-0 border-r bg-card lg:block">
          <div className="sticky top-0 h-screen">
            <PlayerSidebar />
          </div>
        </div>

        <Sheet open={mobileNav} onOpenChange={setMobileNav}>
          <SheetContent side="left" className="w-72 p-0">
            <PlayerSidebar onNavigate={() => setMobileNav(false)} />
          </SheetContent>
        </Sheet>

        <div className="min-w-0 flex-1">
          <TopNavbar onMenuClick={() => setMobileNav(true)} />

          <main className="mx-auto max-w-[1400px] space-y-6 p-4 md:p-6">
            <SportTabs value={activeSportId} onChange={setSportId} />
            <CareerByTeamTable sportId={activeSportId} />
          </main>
        </div>
      </div>
    </div>
  );
}
