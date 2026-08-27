import { useMemo, useState } from "react";
import { Loader2, Trash2, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { MATCH_RESULT_LABELS, MATCH_RESULT_TONE, STATUS_LABELS, STATUS_TONE } from "../types/match.types";
import type { MatchStatusFilter, PlayerMatch } from "../types/match.types";
import { useDeleteMatch, usePlayerMatchList } from "../hooks/usePlayerMatch";
import { AddMatchDialog } from "./AddMatchDialog";

const TABS: { value: MatchStatusFilter; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function opponent(match: PlayerMatch) {
  if (match.homeTeam && match.awayTeam) return `${match.homeTeam} vs ${match.awayTeam}`;
  return match.title ?? match.tournament ?? "—";
}

export function PlayerMatchesList({
  activeSportId,
}: {
  activeSportId?: string | null;
}) {
  const [status, setStatus] = useState<MatchStatusFilter>("ALL");
  const [pendingDelete, setPendingDelete] = useState<PlayerMatch | null>(null);

  const { data, isLoading, isError } = usePlayerMatchList(status);
  const deleteMatch = useDeleteMatch();

  const matches = useMemo(() => {
    const list = activeSportId
      ? (data ?? []).filter((m) => m.sportId === activeSportId)
      : (data ?? []);
    return [...list].sort(
      (a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime(),
    );
  }, [data, activeSportId]);

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            My matches
          </CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Self-reported matches go through admin review before they count toward
            your career statistics.
          </p>
        </div>
        <AddMatchDialog presetSportId={activeSportId} />
      </CardHeader>

      <CardContent className="space-y-4">
        <Tabs value={status} onValueChange={(v) => setStatus(v as MatchStatusFilter)}>
          <TabsList>
            {TABS.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : isError ? (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Could not load your matches. Please try again.
          </p>
        ) : matches.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm font-medium">
              {activeSportId ? "No matches for this sport yet" : "No matches yet"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your first match to start building your record.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Match</TableHead>
                  <TableHead>Sport</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matches.map((match) => (
                  <TableRow key={match.id}>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(match.matchDate)}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{opponent(match)}</div>
                      {match.tournament && (
                        <div className="text-xs text-muted-foreground">
                          {match.tournament}
                        </div>
                      )}
                      {match.status === "REJECTED" && match.rejectReason && (
                        <div className="mt-1 text-xs text-destructive">
                          Reason: {match.rejectReason}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {match.sport?.name ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("font-medium", MATCH_RESULT_TONE[match.result])}
                      >
                        {MATCH_RESULT_LABELS[match.result]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn("font-medium", STATUS_TONE[match.status])}
                      >
                        {STATUS_LABELS[match.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {match.status === "PENDING" ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Withdraw match"
                          onClick={() => setPendingDelete(match)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Withdraw this match?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the pending submission. You can add it again later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (!pendingDelete) return;
                deleteMatch.mutate(pendingDelete.id, {
                  onSuccess: () => setPendingDelete(null),
                });
              }}
            >
              {deleteMatch.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Withdraw
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
