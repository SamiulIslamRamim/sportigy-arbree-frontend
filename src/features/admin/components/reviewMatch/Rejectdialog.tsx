import { useState } from "react";
import type { MatchSubmission } from "../../types/admin-match.types";

interface RejectDialogProps {
  match: MatchSubmission;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: (reason: string) => void;
}

export function RejectDialog({
  match,
  isSubmitting,
  onCancel,
  onConfirm,
}: RejectDialogProps) {
  const [reason, setReason] = useState("");
  const trimmed = reason.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
        <h2 className="text-base font-semibold text-slate-900">Reject match</h2>
        <p className="mt-1 text-sm text-slate-500">
          {match.title} — give a reason so {match.user.name} knows what to fix.
        </p>

        <label className="mt-4 block text-sm font-medium text-slate-700">
          Reason
        </label>
        <textarea
          autoFocus
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          placeholder="e.g. Scorecard doesn't match the match date."
          className="mt-1 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
        />

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(trimmed)}
            disabled={!trimmed || isSubmitting}
            className="rounded-lg bg-red-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Rejecting…" : "Reject match"}
          </button>
        </div>
      </div>
    </div>
  );
}