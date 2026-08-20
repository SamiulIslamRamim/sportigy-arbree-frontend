import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { Button } from "#/components/ui/button";
import { useSportProfiles } from "../hooks/usePlayerProfile";
import { AddSportProfileDialog } from "./AddSportProfileDialog";

export function SportTabs({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (sportId: string) => void;
}) {
  const { data: profiles = [], isLoading } = useSportProfiles();
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Tabs
        value={value ?? ""}
        onValueChange={(v) => v && onChange(v)}
        className="min-w-0 flex-1"
      >
        <TabsList className="rounded-full bg-muted/60 p-1">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : profiles.length === 0 ? (
            <span className="px-4 text-sm text-muted-foreground">No sports added yet</span>
          ) : (
            profiles.map((p) => (
              <TabsTrigger
                key={p.sportId}
                value={p.sportId}
                className="rounded-full px-5 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                {p.sport.name}
              </TabsTrigger>
            ))
          )}
        </TabsList>
      </Tabs>

      <Button
        type="button"
        variant="outline"
        size="icon"
        className="shrink-0 rounded-full"
        onClick={() => setAddOpen(true)}
        aria-label="Add sport profile"
      >
        <Plus className="h-4 w-4" />
      </Button>

      <AddSportProfileDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onAdded={(sportId) => onChange(sportId)}
      />
    </div>
  );
}