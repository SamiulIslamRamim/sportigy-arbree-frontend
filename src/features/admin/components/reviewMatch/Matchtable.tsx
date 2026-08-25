import type { ApprovalStatus, MatchSubmission } from "../../types/admin-match.types";

interface MatchTableProps {
  matches: MatchSubmission[];
  activeStatus: ApprovalStatus;
  pendingActionId: string | null;
  onApprove: (match: MatchSubmission) => void;
  onReject: (match: MatchSubmission) => void;
  onShowData: (match: MatchSubmission) => void;
}

const STATUS_STYLES: Record<ApprovalStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-600/20",
  APPROVED: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  REJECTED: "bg-red-50 text-red-700 ring-red-600/20",
};

function StatusBadge({ status }: { status: ApprovalStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[status]}`}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

export function MatchTable({
  matches,
  activeStatus,
  pendingActionId,
  onApprove,
  onReject,
  onShowData,
}: MatchTableProps) {
  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-16 text-center">
        <p className="text-sm font-medium text-slate-600">No matches here</p>
        <p className="mt-1 text-sm text-slate-400">
          There are no {activeStatus.toLowerCase()} submissions right now.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-slate-500">Match</th>
            <th className="px-4 py-3 text-left font-medium text-slate-500">Sport</th>
            <th className="px-4 py-3 text-left font-medium text-slate-500">Tournament</th>
            <th className="px-4 py-3 text-left font-medium text-slate-500">Submitted by</th>
            <th className="px-4 py-3 text-left font-medium text-slate-500">Date</th>
            <th className="px-4 py-3 text-left font-medium text-slate-500">Status</th>
            <th className="px-4 py-3 text-right font-medium text-slate-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {matches.map((match) => {
            const isBusy = pendingActionId === match.id;
            return (
              <tr key={match.id} className="hover:bg-slate-50/60">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-800">{match.title}</div>
                  <div className="text-xs text-slate-400">{match.venue}</div>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {match.sport.name}
                  <span className="text-slate-400"> · {match.sportCategory.name}</span>
                </td>
                <td className="px-4 py-3 text-slate-600">{match.tournament}</td>
                <td className="px-4 py-3 text-slate-600">
                  {match.user.name}
                  <span className="text-slate-400"> @{match.user.username}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                  {new Date(match.matchDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={match.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onShowData(match)}
                      className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                    >
                      Show data
                    </button>
                    {match.status === "PENDING" && (
                      <>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => onApprove(match)}
                          className="rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                        >
                          {isBusy ? "…" : "Approve"}
                        </button>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => onReject(match)}
                          className="rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          {isBusy ? "…" : "Reject"}
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}