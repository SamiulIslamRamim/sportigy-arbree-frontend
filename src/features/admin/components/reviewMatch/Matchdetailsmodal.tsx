import type { MatchSubmission } from "../../types/admin-match.types";

interface MatchDetailsModalProps {
  match: MatchSubmission;
  onClose: () => void;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-3 border-b border-slate-100 py-2 text-sm last:border-0">
      <dt className="text-slate-500">{label}</dt>
      <dd className="col-span-2 break-words text-slate-800">
        {value === null || value === undefined || value === "" ? (
          <span className="text-slate-300">—</span>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

export function MatchDetailsModal({ match, onClose }: MatchDetailsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl tracking-wider font-semibold text-slate-900">{match.title}</h2>
            <p className="text-sm text-slate-500">{match.tournament}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <dl className="mt-4">
          <Row label="Match ID" value={<span className="font-mono text-xs">{match.id}</span>} />
          <Row label="Status" value={match.status} />
          <Row label="Sport" value={`${match.sport.name} (${match.sportCategory.name})`} />
          <Row label="Match type" value={match.matchType} />
          <Row label="Venue" value={match.venue} />
          <Row label="Home team" value={match.homeTeam} />
          <Row label="Away team" value={match.awayTeam} />
          <Row label="Player side" value={match.playerSide} />
          <Row label="Match date" value={new Date(match.matchDate).toLocaleString()} />
          <Row label="Result" value={match.result} />
          <Row label="Captain" value={match.isCaptain ? "Yes" : "No"} />
          <Row label="Substitute" value={match.isSubstitute ? "Yes" : "No"} />
          <Row label="Minutes played" value={match.minutesPlayed} />
          <Row label="Notes" value={match.notes} />
          <Row
            label="Submitted by"
            value={`${match.user.name} (@${match.user.username})`}
          />
          <Row label="Created" value={new Date(match.createdAt).toLocaleString()} />
          <Row
            label="Reviewed"
            value={
              match.reviewedAt ? new Date(match.reviewedAt).toLocaleString() : null
            }
          />
          <Row label="Reject reason" value={match.rejectReason} />
        </dl>
      </div>
    </div>
  );
}