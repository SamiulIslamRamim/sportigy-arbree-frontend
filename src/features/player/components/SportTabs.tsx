import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs";
import type { SportProfile } from "../types";


export function SportTabs({
  profiles,
  value,
  onChange,
}: {
  profiles: SportProfile[];
  value: string;
  onChange: (sportId: string) => void;
}) {
  return (
    <Tabs value={value} onValueChange={onChange}>
      <TabsList className="rounded-full bg-muted/60 p-1">
        {profiles.map((p) => (
          <TabsTrigger
            key={p.sportId}
            value={p.sportId}
            className="rounded-full px-5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            {p.sport?.name ?? p.sportId}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
