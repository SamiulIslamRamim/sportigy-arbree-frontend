import type { ApprovalStatus } from "../../types/admin-match.types";

interface StatusFilterProps {
  value: ApprovalStatus;
  onChange: (status: ApprovalStatus) => void;
  counts: Record<ApprovalStatus, number>;
}

const OPTIONS: { value: ApprovalStatus; label: string }[] = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

export function StatusFilter({ value, onChange, counts }: StatusFilterProps) {
  return (
    <div className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 p-1">
      {OPTIONS.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={[
              "flex items-center gap-2 rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-800",
            ].join(" ")}
          >
            {opt.label}
            <span
              className={[
                "rounded-full px-1.5 py-0.5 text-xs font-semibold tabular-nums",
                active ? "bg-slate-100 text-slate-600" : "bg-slate-200/70 text-slate-500",
              ].join(" ")}
            >
              {counts[opt.value]}
            </span>
          </button>
        );
      })}
    </div>
  );
}