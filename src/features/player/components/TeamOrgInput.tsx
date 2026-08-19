import { Input } from "#/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "#/components/ui/popover";
import { orgSearchApi } from "#/features/org/api/orgSearch.api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export function TeamOrgInput({
  name,
  orgId,
  onChange,
  placeholder,
}: {
  name: string;
  orgId?: string;
  onChange: (next: { name: string; orgId?: string }) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const q = name.trim();
  const { data: orgs = [] } = useQuery({
    queryKey: ["organizations", q],
    queryFn: () => orgSearchApi.search(q, 8),
    enabled: q.length >= 1,
  });

  return (
    <Popover open={open && orgs.length > 0} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Input
          value={name}
          placeholder={placeholder}
          onChange={(e) => {
            onChange({ name: e.target.value, orgId: undefined });
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-1" align="start">
        {orgs.map((org) => (
          <button
            key={org.id}
            type="button"
            className="flex w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
            onClick={() => {
              onChange({ name: org.name, orgId: org.id });
              setOpen(false);
            }}
          >
            {org.name}
            {orgId === org.id ? " ✓" : ""}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
