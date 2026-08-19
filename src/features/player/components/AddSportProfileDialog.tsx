import { Button } from "#/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "#/components/ui/dialog";
import { Input } from "#/components/ui/input";
import { useCategories } from "#/hooks/categories.hooks";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useAddSportProfile, useSportProfiles } from "../hooks/useSportProfiles";

export function AddSportProfileDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { data: sports = [], isLoading } = useCategories();
  const { data: profiles = [] } = useSportProfiles();
  const add = useAddSportProfile();
  const [academy, setAcademy] = useState("");

  const enrolled = useMemo(() => new Set(profiles.map((p) => p.sportId)), [profiles]);
  const available = sports.filter((s) => !enrolled.has(s.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add a sport</DialogTitle>
          <DialogDescription>Enroll in a sport you are not yet tracking.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Academy (optional)" value={academy} onChange={(e) => setAcademy(e.target.value)} />
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading sports…</p>
          ) : available.length === 0 ? (
            <p className="text-sm text-muted-foreground">You are enrolled in every available sport.</p>
          ) : (
            <ul className="divide-y rounded-lg border">
              {available.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 px-3 py-2">
                  <span className="text-sm font-medium">{s.name}</span>
                  <Button
                    size="sm"
                    disabled={add.isPending}
                    onClick={() =>
                      add.mutate(
                        { sportId: s.id, academy: academy || undefined },
                        { onSuccess: () => onOpenChange(false) },
                      )
                    }
                  >
                    {add.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
