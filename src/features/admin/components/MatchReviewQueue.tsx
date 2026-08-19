import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/components/ui/table";
import { formatDate } from "#/features/player/lib/format";
import type { ApprovalStatus } from "#/features/player/types";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAdminMatchReview } from "../hooks/useAdminMatches";

export function MatchReviewQueue() {
  const [status, setStatus] = useState<ApprovalStatus | undefined>("PENDING");
  const { data = [], isLoading } = useAdminMatchReview(status);

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl">Match review</h1>
      <div className="flex gap-2">
        {([undefined, "PENDING", "APPROVED", "REJECTED"] as const).map((s) => (
          <Button key={s ?? "all"} size="sm" variant={status === s ? "default" : "outline"} onClick={() => setStatus(s)}>
            {s ?? "All"}
          </Button>
        ))}
      </div>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead>Sport</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  {row.user.name} <span className="text-muted-foreground">@{row.user.username}</span>
                </TableCell>
                <TableCell>{row.sport?.name ?? "—"}</TableCell>
                <TableCell>{formatDate(row.matchDate)}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{row.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/admin/matches/$matchId" params={{ matchId: row.id }}>
                      Open
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
