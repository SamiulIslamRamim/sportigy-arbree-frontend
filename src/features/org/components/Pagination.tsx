import { cn } from "#/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";




export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages: (number | "…")[] = [];
  const push = (v: number | "…") => pages.push(v);
  const window = 1;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - window && i <= page + window)) {
      push(i);
    } else if (pages[pages.length - 1] !== "…") {
      push("…");
    }
  }

  const btn = "grid h-9 min-w-9 place-items-center rounded-lg px-2 text-sm font-medium transition-colors";

  return (
    <nav className="flex items-center justify-center gap-1">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className={cn(btn, "border hover:bg-muted disabled:opacity-40")}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e-${i}`} className={cn(btn, "text-muted-foreground")}>
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={cn(
              btn,
              p === page
                ? "bg-primary text-primary-foreground"
                : "border hover:bg-muted",
            )}
          >
            {p}
          </button>
        ),
      )}
      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className={cn(btn, "border hover:bg-muted disabled:opacity-40")}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}