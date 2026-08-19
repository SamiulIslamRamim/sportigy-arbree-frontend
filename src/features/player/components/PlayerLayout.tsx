import { Sheet, SheetContent } from "#/components/ui/sheet";
import { useState, type ReactNode } from "react";
import { PlayerSidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";

export function PlayerLayout({ children }: { children: ReactNode }) {
  const [mobileNav, setMobileNav] = useState(false);

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
          <main className="mx-auto max-w-[1400px] space-y-6 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
