import { Skeleton } from "#/components/ui/skeleton";
import { useOrganizationBanner } from "../hooks";


export function OrganizationBanner({ className = "" }: { className?: string }) {
  const { data, isLoading } = useOrganizationBanner();

  if (isLoading || !data) {
    return <Skeleton className={`h-32 w-full rounded-2xl md:h-40 ${className}`} />;
  }

  return (
    <aside
      className={`relative flex min-h-32 items-center justify-between overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/15 via-primary/5 to-background p-5 md:min-h-40 ${className}`}
    >
      <div className="relative z-10 max-w-sm">
        <p className="text-xs font-medium uppercase tracking-wider text-primary">
          Sponsored
        </p>
        <h3 className="mt-1 font-display text-xl md:text-2xl">{data.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{data.subtitle}</p>
      </div>
      <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-primary/10 blur-2xl" />
      <div className="absolute -bottom-10 right-10 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
    </aside>
  );
}
