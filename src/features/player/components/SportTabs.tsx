import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs";
import type { SportKey } from "../types";

const sports: { key: SportKey; label: string; disabled?: boolean }[] = [
  { key: "cricket", label: "Cricket" },
  { key: "football", label: "Football", disabled: true },
  { key: "basketball", label: "Basketball", disabled: true },
];

export function SportTabs({ value, onChange }: { value: SportKey; onChange: (v: SportKey) => void }) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as SportKey)}>
      <TabsList className="rounded-full bg-muted/60 p-1">
        {sports.map((s) => (
          <TabsTrigger
            key={s.key}
            value={s.key}
            disabled={s.disabled}
            className="rounded-full px-5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            {s.label}
            {s.disabled && <span className="ml-1 text-[10px] uppercase text-muted-foreground">Soon</span>}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
