import { Badge } from "#/components/ui/badge";
import { cn } from "#/lib/utils";
import type { ApprovalStatus } from "../types";

const tones: Record<ApprovalStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800 border-amber-200",
  APPROVED: "bg-emerald-100 text-emerald-800 border-emerald-200",
  REJECTED: "bg-rose-100 text-rose-800 border-rose-200",
};

export function MatchStatusBadge({ status }: { status: ApprovalStatus }) {
  return (
    <Badge variant="outline" className={cn("rounded-md", tones[status])}>
      {status}
    </Badge>
  );
}
