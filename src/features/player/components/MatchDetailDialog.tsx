import { Button } from "#/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/components/ui/dialog";
import { extractApiError } from "#/lib/api/axios";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { playerMatchApi } from "../api/match.api";
import { useDeleteMatch } from "../hooks/usePlayerMatchMutations";
import { playerMatchKeys } from "../hooks/usePlayerMatches";
import { dash, formatDate, resultLabels } from "../lib/format";
import { MatchStatusBadge } from "./MatchStatusBadge";

export function MatchDetailDialog({
  matchId,
  open,
  onOpenChange,
  onEdit,
}: {
  matchId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
}) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: matchId ? playerMatchKeys.detail(matchId) : ["player", "matches", "detail", "idle"],
    queryFn: () => playerMatchApi.get(matchId!),
    enabled: !!matchId && open,
  });
  const del = useDeleteMatch();
  const pending = data?.status === "PENDING";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Match details</DialogTitle>
          <DialogDescription>Full submission, including field values.</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : isError || !data ? (
          <p className="text-sm text-destructive">{extractApiError(error, "Failed to load match")}</p>
        ) : (
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <MatchStatusBadge status={data.status} />
            </div>
            <p>
              {dash(data.homeTeam)} vs {dash(data.awayTeam)}
            </p>
            <p className="text-muted-foreground">
              {formatDate(data.matchDate)} · {dash(data.venue)} · {resultLabels[data.result]}
            </p>
            {data.rejectReason ? <p className="text-rose-600">Rejected: {data.rejectReason}</p> : null}
            <div className="divide-y rounded-lg border">
              {(data.values ?? []).map((v) => (
                <div key={v.id} className="flex justify-between gap-3 px-3 py-2">
                  <span className="text-muted-foreground">{v.field.name}</span>
                  <span className="font-medium">
                    {v.option?.label ??
                      v.valueText ??
                      (v.valueNumber !== null ? String(v.valueNumber) : null) ??
                      (v.valueBoolean !== null ? String(v.valueBoolean) : null) ??
                      v.valueDate ??
                      "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        <DialogFooter>
          {pending && data ? (
            <>
              <Button type="button" variant="outline" onClick={onEdit}>
                Edit
              </Button>
              <Button
                type="button"
                variant="destructive"
                disabled={del.isPending}
                onClick={() => del.mutate(data.id, { onSuccess: () => onOpenChange(false) })}
              >
                Delete
              </Button>
            </>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
