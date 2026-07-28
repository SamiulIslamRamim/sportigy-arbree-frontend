import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { useSports } from "../hooks";
import type { SportKey } from "../types";


export function OrganizationSportTabs({
  value,
  onChange,
}: {
  value: SportKey;
  onChange: (v: SportKey) => void;
}) {
  const { data: sports } = useSports();
  const list = (sports ?? []).slice(0, 2); // Cricket + Football

  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as SportKey)}>
      <TabsList className="rounded-full bg-muted/60 p-1">
        {list.map((s) => (
          <TabsTrigger
            key={s.key}
            value={s.key}
            disabled={!s.enabled}
            className="rounded-full px-5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            {s.label}
            {!s.enabled && (
              <span className="ml-1 text-[10px] uppercase text-muted-foreground">Soon</span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
