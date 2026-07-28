import { Input } from "#/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";


export function PlayerSearchBar({
  value,
  onChange,
  placeholder = "Search player, academy, organization…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const [local, setLocal] = useState(value);

  useEffect(() => setLocal(value), [value]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (local !== value) onChange(local);
    }, 300);
    return () => clearTimeout(t);
  }, [local]);

  return (
    <div className="relative flex-1">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="h-10 rounded-full bg-muted/40 pl-10"
      />
    </div>
  );
}