// Intentionally non-functional for now — UI only, per request.
// Wire up an onChange handler and filtering logic when the search
// feature is ready to be implemented.
export function SearchBar() {
  return (
    <div className="relative w-full max-w-xs">
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
        />
      </svg>
      <input
        type="text"
        disabled
        placeholder="Search matches (coming soon)"
        className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-400 placeholder:text-slate-400 focus:outline-none"
      />
    </div>
  );
}