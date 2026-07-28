import { Button } from "#/components/ui/button";
import { Skeleton } from "#/components/ui/skeleton";
import { useOrganizationVideos } from "../hooks";
import type { SportKey } from "../types";
import { PlayerVideoCard } from "./PlayerVideoCard";



export function PlayerVideoRail({ sport }: { sport: SportKey }) {
  const { data, isLoading } = useOrganizationVideos(sport);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl tracking-wide">Player Shots</h2>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
          View all
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-video rounded-2xl" />
          ))}
        </div>
      ) : (data ?? []).length === 0 ? (
        <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          No videos available for this sport yet.
        </div>
      ) : (
        <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 lg:grid-cols-4">
          {data!.map((v) => (
            <div key={v.id} className="w-[75%] shrink-0 snap-start md:w-auto">
              <PlayerVideoCard video={v} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
