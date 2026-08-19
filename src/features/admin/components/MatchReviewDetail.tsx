import { Button } from "#/components/ui/button";
import { Field, FieldLabel } from "#/components/ui/field";
import { Textarea } from "#/components/ui/textarea";
import { extractApiError } from "#/lib/api/axios";
import { formatDate, resultLabels } from "#/features/player/lib/format";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useAdminApproveMatch, useAdminMatch, useAdminRejectMatch } from "../hooks/useAdminMatches";

export function MatchReviewDetail({ matchId }: { matchId: string }) {
  const { data, isLoading, isError, error } = useAdminMatch(matchId);
  const approve = useAdminApproveMatch();
  const reject = useAdminRejectMatch();
  const [reason, setReason] = useState("");

  if (isLoading) return <Loader2 className="h-5 w-5 animate-spin" />;
  if (isError || !data) return <p className="text-sm text-destructive">{extractApiError(error, "Failed to load match")}</p>;

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl">Review match</h1>
      <p className="text-sm">
        {data.user.name} ({data.user.email}) · {data.sport?.name} · {formatDate(data.matchDate)} · {resultLabels[data.result]}
      </p>
      <p className="text-sm text-muted-foreground">
        {data.homeTeam} vs {data.awayTeam} · {data.venue ?? "—"} · {data.status}
      </p>
      <div className="divide-y rounded-lg border">
        {(data.values ?? []).map((v) => (
          <div key={v.id} className="flex justify-between px-3 py-2 text-sm">
            <span className="text-muted-foreground">{v.field.name}</span>
            <span>
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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <Button disabled={approve.isPending || data.status === "APPROVED"} onClick={() => approve.mutate(matchId)}>
          Approve
        </Button>
        <Field className="flex-1">
          <FieldLabel htmlFor="reason">Reject reason</FieldLabel>
          <Textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} />
        </Field>
        <Button
          variant="destructive"
          disabled={reject.isPending || !reason.trim() || data.status === "REJECTED"}
          onClick={() => reject.mutate({ matchId, reason: reason.trim() })}
        >
          Reject
        </Button>
      </div>
    </div>
  );
}
