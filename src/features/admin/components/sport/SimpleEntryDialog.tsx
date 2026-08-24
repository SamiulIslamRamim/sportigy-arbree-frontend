import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { slugify } from "../../lib/slug";

export interface SimpleEntityValues {
  name: string;
  slug: string;
  description?: string | null;
  displayOrder?: number;
  isActive: boolean;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  withDescription?: boolean;
  withDisplayOrder?: boolean;
  initial?: Partial<SimpleEntityValues> | null;
  isPending: boolean;
  onSubmit: (values: SimpleEntityValues) => void;
}

export function SimpleEntityDialog({
  open,
  onOpenChange,
  title,
  withDescription,
  withDisplayOrder,
  initial,
  isPending,
  onSubmit,
}: Props) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    setSlug(initial?.slug ?? "");
    setSlugTouched(Boolean(initial?.slug));
    setDescription(initial?.description ?? "");
    setDisplayOrder(String(initial?.displayOrder ?? 0));
    setIsActive(initial?.isActive ?? true);
  }, [open, initial]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slugTouched) setSlug(slugify(e.target.value));
              }}
            />
          </div>
          <div className="grid gap-2">
            <Label>Slug</Label>
            <Input
              value={slug}
              onChange={(e) => {
                setSlugTouched(true);
                setSlug(e.target.value);
              }}
            />
          </div>
          {withDescription && (
            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
            </div>
          )}
          {withDisplayOrder && (
            <div className="grid gap-2">
              <Label>Display order</Label>
              <Input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(e.target.value)}
              />
            </div>
          )}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <Label>Active</Label>
            <Switch checked={isActive} onCheckedChange={setIsActive} />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button
            disabled={isPending || !name.trim()}
            onClick={() =>
              onSubmit({
                name: name.trim(),
                slug: slug.trim() || slugify(name),
                ...(withDescription
                  ? { description: description.trim() ? description.trim() : null }
                  : {}),
                ...(withDisplayOrder ? { displayOrder: Number(displayOrder) || 0 } : {}),
                isActive,
              })
            }
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
