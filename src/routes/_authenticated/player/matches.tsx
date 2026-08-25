import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { PlayerSidebar } from "#/features/player/components/Sidebar";
import { SportTabs } from "#/features/player/components/SportTabs";
import { TopNavbar } from "#/features/player/components/TopNavbar";
import { useSportProfiles } from "#/features/player/hooks/usePlayerProfile";
import { PlayerMatchesList } from "#/features/player/components/PlayerMatchList";

export const Route = createFileRoute("/_authenticated/player/matches")({
  head: () => ({
    meta: [
      { title: "My Matches — Spotig" },
      {
        name: "description",
        content:
          "Report your matches, track approval status and keep your career record up to date.",
      },
      { property: "og:title", content: "My Matches — Spotig" },
      {
        property: "og:description",
        content:
          "Report your matches, track approval status and keep your career record up to date.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PlayerMatchesPage,
});

function PlayerMatchesPage() {
  const [mobileNav, setMobileNav] = useState(false);
  const { data: sportProfiles = [] } = useSportProfiles();
  const [sportId, setSportId] = useState<string | null>(null);

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
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">My matches</h1>
              <p className="text-sm text-muted-foreground">
                Submit match reports and follow their review status.
              </p>
            </div>
            <SportTabs value={activeSportId} onChange={setSportId} />
            <PlayerMatchesList activeSportId={activeSportId} />
          </main>
        </div>
      </div>
    </div>
  );
}
