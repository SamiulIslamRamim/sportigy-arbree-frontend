import { createFileRoute } from '@tanstack/react-router'
import { Button } from "#/components/ui/button";
import { Sheet, SheetContent } from "#/components/ui/sheet";
import { CategorySidebar } from "#/features/org/components/CategorySidebar";
import type { FilterState } from "#/features/org/components/CategorySidebar";
import { OrganizationHeader } from "#/features/org/components/OrgHeader";
import { OrganizationSidebar } from "#/features/org/components/OrgSidebar";
import { usePlayers } from "#/features/org/hooks";
import type { PlayerSearchFilter, PlayerSortKey, SportKey } from "#/features/org/types";
import { TopNavbar } from "#/features/player/components/TopNavbar";
import { SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { OrganizationBanner } from '#/features/org/components/OrgBanner';
import { PlayerVideoRail } from '#/features/org/components/PlayerVideoRail';
import { OrganizationSportTabs } from '#/features/org/components/OrgSportTabs';
import { PlayerSearchBar } from '#/features/org/components/PlayerSearch';
import { SortDropdown } from '#/features/org/components/ShortDropDown';
import { PlayerGrid } from '#/features/org/components/PlayerGrid';
import { Pagination } from '#/features/org/components/Pagination';



export const Route = createFileRoute("/_authenticated/org/dashboard")({
   head: () => ({
    meta: [
      { title: "Organization Dashboard — Spotig" },
      {
        name: "description",
        content:
          "Discover, evaluate and recruit rising sports talent from your organization dashboard.",
      },
    ],
  }),
  component: OrganizationDashboardPage,
});

const PAGE_SIZE = 8;

function OrganizationDashboardPage() {
  const [mobileNav, setMobileNav] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filter, setFilter] = useState<FilterState>({
    sport: "cricket",
    categoryKeys: [],
    experience: [1, 20],
  });
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<PlayerSortKey>("latest");
  const [page, setPage] = useState(1);

  const searchFilter: PlayerSearchFilter = useMemo(
    () => ({
      sport: filter.sport,
      query,
      categoryKeys: filter.categoryKeys,
      experience: { min: filter.experience[0], max: filter.experience[1] },
      sort,
      page,
      pageSize: PAGE_SIZE,
    }),
    [filter, query, sort, page],
  );

  const { data, isLoading, isFetching } = usePlayers(searchFilter);

  const setSport = (sport: SportKey) => {
    setFilter((f) => ({ ...f, sport, categoryKeys: [] }));
    setPage(1);
  };

  const handleFilterChange = (next: FilterState) => {
    setFilter(next);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="flex">
        {/* Desktop sidebar */}
        <div className="hidden w-64 shrink-0 border-r bg-card lg:block">
          <div className="sticky top-0 h-screen">
            <OrganizationSidebar />
          </div>
        </div>

        {/* Mobile drawer */}
        <Sheet open={mobileNav} onOpenChange={setMobileNav}>
          <SheetContent side="left" className="w-72 p-0">
            <OrganizationSidebar onNavigate={() => setMobileNav(false)} />
          </SheetContent>
        </Sheet>

        <div className="min-w-0 flex-1">
          <TopNavbar onMenuClick={() => setMobileNav(true)} />

          <main className="mx-auto max-w-[1400px] space-y-6 p-4 md:p-6">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <OrganizationHeader />
              <OrganizationBanner />
            </div>

            <PlayerVideoRail sport={filter.sport} />

            <OrganizationBanner className="min-h-24" />

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-display text-xl tracking-wide">Player Search</h2>
                  <p className="text-sm text-muted-foreground">
                    Currently browsing{" "}
                    <span className="font-medium text-foreground capitalize">
                      {filter.sport}
                    </span>{" "}
                    talent.
                  </p>
                </div>
                <OrganizationSportTabs value={filter.sport} onChange={setSport} />
              </div>

              <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
                {/* Desktop filters */}
                <div className="hidden lg:block">
                  <div className="sticky top-20">
                    <CategorySidebar filter={filter} onChange={handleFilterChange} />
                  </div>
                </div>

                {/* Mobile filter sheet */}
                <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                  <SheetContent side="left" className="w-80 overflow-y-auto p-4">
                    <CategorySidebar filter={filter} onChange={handleFilterChange} />
                  </SheetContent>
                </Sheet>

                <div className="space-y-4 min-w-0">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 lg:hidden"
                      onClick={() => setFiltersOpen(true)}
                    >
                      <SlidersHorizontal className="h-4 w-4" /> Filters
                    </Button>
                    <PlayerSearchBar
                      value={query}
                      onChange={(v) => {
                        setQuery(v);
                        setPage(1);
                      }}
                    />
                    <SortDropdown value={sort} onChange={(v) => { setSort(v); setPage(1); }} />
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      {data
                        ? `Showing ${(data.pagination.page - 1) * data.pagination.pageSize + 1}–${Math.min(
                            data.pagination.page * data.pagination.pageSize,
                            data.pagination.total,
                          )} of ${data.pagination.total}`
                        : "Loading players…"}
                    </span>
                    {isFetching && !isLoading && <span>Updating…</span>}
                  </div>

                  <PlayerGrid players={data?.items ?? []} isLoading={isLoading} />

                  {data && (
                    <Pagination
                      page={data.pagination.page}
                      totalPages={data.pagination.totalPages}
                      onChange={setPage}
                    />
                  )}
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
