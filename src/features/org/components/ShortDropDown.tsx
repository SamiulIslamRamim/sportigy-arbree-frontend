import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";
import type { PlayerSortKey } from "../types";



const options: { value: PlayerSortKey; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "highest-rated", label: "Highest Rated" },
  { value: "most-experienced", label: "Most Experienced" },
  { value: "alphabetical", label: "Alphabetical" },
];

export function SortDropdown({
  value,
  onChange,
}: {
  value: PlayerSortKey;
  onChange: (v: PlayerSortKey) => void;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as PlayerSortKey)}>
      <SelectTrigger className="h-10 w-[180px] rounded-full">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            Sort by: {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
