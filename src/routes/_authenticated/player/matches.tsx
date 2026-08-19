import { Button } from "#/components/ui/button";
import { MatchCard } from "#/features/player/components/MatchCard";
import { MatchDetailDialog } from "#/features/player/components/MatchDetailDialog";
import { MatchFormDialog } from "#/features/player/components/MatchFormDialog";
import { PlayerLayout } from "#/features/player/components/PlayerLayout";
import { usePlayerMatches } from "#/features/player/hooks/usePlayerMatches";
import { playerMatchApi } from "#/features/player/api/match.api";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import type { PlayerMatch } from "#/features/player/types";

export const Route = createFileRoute("/_authenticated/player/matches")({
  ssr: false,
  head: () => ({ meta: [{ title: "Matches — Spotig" }] }),
  component: PlayerMatchesPage,
});

type Tab = "approved" | "pending" | "rejected";

function PlayerMatchesPage() {
  const [tab, setTab] = useState<Tab>("approved");
  const { data, isLoading } = usePlayerMatches(tab);
  const matches = data?.matches ?? [];
  const [formOpen, setFormOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [editMatch, setEditMatch] = useState<PlayerMatch | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const visible = matches.slice(0, page * pageSize);

  return (
    <PlayerLayout>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl">Matches</h1>
        <Button onClick={() => { setEditMatch(null); setFormOpen(true); }}>Add Match</Button>
      </div>
      <div className="flex gap-2">
        {(["approved", "pending", "rejected"] as const).map((s) => (
          <Button key={s} size="sm" variant={tab === s ? "default" : "outline"} onClick={() => { setTab(s); setPage(1); }}>
            {s[0].toUpperCase() + s.slice(1)}
          </Button>
        ))}
      </div>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading matches…</p>
      ) : visible.length === 0 ? (
        <p className="text-sm text-muted-foreground">No matches in this list.</p>
      ) : (
        <div className="space-y-3">
          {visible.map((m) => (
            <MatchCard key={m.id} match={m} onClick={() => setDetailId(m.id)} />
          ))}
          {visible.length < matches.length ? (
            <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
              Load more
            </Button>
          ) : null}
        </div>
      )}
      <MatchFormDialog open={formOpen} onOpenChange={setFormOpen} match={editMatch} />
      <MatchDetailDialog
        matchId={detailId}
        open={!!detailId}
        onOpenChange={(open) => {
          if (!open) setDetailId(null);
        }}
        onEdit={async () => {
          if (!detailId) return;
          const full = await playerMatchApi.get(detailId);
          setEditMatch(full);
          setFormOpen(true);
        }}
      />
    </PlayerLayout>
  );
}
