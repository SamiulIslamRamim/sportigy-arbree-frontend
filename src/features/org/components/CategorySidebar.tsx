import { useState } from "react";
import { usePlayerCategories, useSports } from "../hooks";
import type { SportKey } from "../types";
import { cn } from "#/lib/utils";
import { Slider } from "#/components/ui/slider";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "#/components/ui/accordion";
import { Checkbox } from "#/components/ui/checkbox";
import { Label } from "#/components/ui/label";



export interface FilterState {
  sport: SportKey;
  categoryKeys: string[];
  experience: [number, number];
}

interface Props {
  filter: FilterState;
  onChange: (next: FilterState) => void;
}

export function CategorySidebar({ filter, onChange }: Props) {
  const { data: sports } = useSports();
  const { data: categories } = usePlayerCategories(filter.sport);
  const [expRange, setExpRange] = useState<[number, number]>(filter.experience);

  const toggleCategory = (key: string) => {
    const next = filter.categoryKeys.includes(key)
      ? filter.categoryKeys.filter((k) => k !== key)
      : [...filter.categoryKeys, key];
    onChange({ ...filter, categoryKeys: next });
  };

  return (
    <div className="space-y-6 rounded-2xl border bg-card p-5">
      <section>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Sport Categories
        </h3>
        <ul className="space-y-1">
          {(sports ?? []).map((s) => {
            const active = s.key === filter.sport;
            return (
              <li key={s.key}>
                <button
                  type="button"
                  disabled={!s.enabled}
                  onClick={() => onChange({ ...filter, sport: s.key, categoryKeys: [] })}
                  className={cn(
                    "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors",
                    active
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-foreground/80 hover:bg-muted",
                    !s.enabled && "cursor-not-allowed opacity-50",
                  )}
                >
                  {s.label}
                  {!s.enabled && (
                    <span className="ml-2 text-[10px] uppercase text-muted-foreground">Soon</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Filter by Experience
          </h3>
          <span className="text-xs font-medium text-foreground">
            {expRange[0]}–{expRange[1]} yrs
          </span>
        </div>
        <Slider
          min={1}
          max={20}
          step={1}
          value={expRange}
          onValueChange={(v) => setExpRange([v[0], v[1]] as [number, number])}
          onValueCommit={(v) =>
            onChange({ ...filter, experience: [v[0], v[1]] as [number, number] })
          }
        />
      </section>

      <section>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Player Categories
        </h3>
        <Accordion type="single" collapsible defaultValue="cat">
          <AccordionItem value="cat" className="border-none">
            <AccordionTrigger className="py-2 text-sm">Roles</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2">
                {(categories ?? []).map((c) => {
                  const id = `cat-${c.key}`;
                  const checked = filter.categoryKeys.includes(c.key);
                  return (
                    <li key={c.key} className="flex items-center gap-2">
                      <Checkbox
                        id={id}
                        checked={checked}
                        onCheckedChange={() => toggleCategory(c.key)}
                      />
                      <Label htmlFor={id} className="cursor-pointer text-sm font-normal">
                        {c.label}
                      </Label>
                    </li>
                  );
                })}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
}