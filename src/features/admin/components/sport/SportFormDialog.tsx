import { useEffect, useState } from "react";
import type { AdminSport, SportPayload } from "../../types/admin-sport.types";
import { slugify } from "../../lib/slug";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/components/ui/dialog";
import { Label } from "#/components/ui/label";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import { Switch } from "#/components/ui/switch";
import { Button } from "#/components/ui/button";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sport?: AdminSport | null;
  isPending: boolean;
  onSubmit: (payload: SportPayload) => void;
}

export function SportFormDialog({ open, onOpenChange, sport, isPending, onSubmit }: Props) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!open) return;
    setName(sport?.name ?? "");
    setSlug(sport?.slug ?? "");
    setSlugTouched(Boolean(sport));
    setDescription(sport?.description ?? "");
    setIsActive(sport?.isActive ?? true);
  }, [open, sport]);

  const handleName = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const submit = () => {
    onSubmit({
      name: name.trim(),
      slug: slug.trim() || slugify(name),
      description: description.trim() ? description.trim() : null,
      isActive,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{sport ? "Edit sport" : "Add sport"}</DialogTitle>
          <DialogDescription>
            Sports group every category, metric and field in the platform.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="sport-name">Name</Label>
            <Input
              id="sport-name"
              value={name}
              onChange={(e) => handleName(e.target.value)}
              placeholder="Cricket"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sport-slug">Slug</Label>
            <Input
              id="sport-slug"
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
              placeholder="cricket"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sport-description">Description</Label>
            <Textarea
              id="sport-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <Label htmlFor="sport-active">Active</Label>
              <p className="text-xs text-muted-foreground">Visible to players and organizations.</p>
            </div>
            <Switch id="sport-active" checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={isPending || !name.trim()}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {sport ? "Save changes" : "Create sport"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
