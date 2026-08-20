import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { Button } from "#/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog";
import { useAddSportProfile, useSportProfiles, useSports } from "../hooks/usePlayerProfile";

export function AddSportProfileDialog({
  open,
  onOpenChange,
  onAdded,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdded: (sportId: string) => void;
}) {
  const { data: allSports = [], isLoading: loadingSports } = useSports();
  const { data: profiles = [], isLoading: loadingProfiles } = useSportProfiles();
  const addSport = useAddSportProfile();
  const [selected, setSelected] = useState<string>("");

  const enrolled = new Set(profiles.map((p) => p.sportId));
  const available = allSports.filter((s) => !enrolled.has(s.id));

  const submit = () => {
    if (!selected) return;
    addSport.mutate(
      { sportId: selected },
      {
        onSuccess: () => {
          onAdded(selected);
          onOpenChange(false);
          setSelected("");
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add a sport</DialogTitle>
          <DialogDescription>Pick a sport to add to your profile.</DialogDescription>
        </DialogHeader>

        {loadingSports || loadingProfiles ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : available.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            You have already added every available sport.
          </p>
        ) : (
          <div className="grid max-h-[50vh] gap-2 overflow-y-auto">
            {available.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelected(s.id)}
                className={`flex items-center gap-3 rounded-xl border p-3 text-left text-sm transition-colors ${
                  selected === s.id
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border/60 text-muted-foreground hover:border-primary/40"
                }`}
              >
                <span className="font-medium text-foreground">{s.name}</span>
                {s.description ? (
                  <span className="ml-auto truncate text-xs">{s.description}</span>
                ) : null}
              </button>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={addSport.isPending}
          >
            Cancel
          </Button>
          <Button type="button" onClick={submit} disabled={!selected || addSport.isPending}>
            {addSport.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Plus className="mr-1 h-4 w-4" />
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}