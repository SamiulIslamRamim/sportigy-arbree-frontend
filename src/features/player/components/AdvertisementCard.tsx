import { Card } from "#/components/ui/card";
import { cn } from "#/lib/utils";


export function AdvertisementCard({ className, height = "h-40" }: { className?: string; height?: string }) {
  return (
    <Card
      className={cn(
        "grid place-items-center overflow-hidden border-dashed bg-gradient-to-br from-muted/60 via-muted/40 to-muted/60 text-muted-foreground",
        height,
        className,
      )}
    >
      <span className="text-xs uppercase tracking-[0.3em]">Advertisement</span>
    </Card>
  );
}
