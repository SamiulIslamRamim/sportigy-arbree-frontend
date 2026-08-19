import { Button } from "#/components/ui/button";
import { Skeleton } from "#/components/ui/skeleton";
import { BadgeCheck, Building2, MapPin, Pencil } from "lucide-react";
import { useOrganizationProfile } from "../hooks";

export function OrganizationHeader() {
  const { data: org, isLoading } = useOrganizationProfile();

  if (isLoading || !org) {
    return (
      <div className="rounded-2xl border bg-card p-5">
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-2xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border bg-card p-5">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-primary/10 text-primary">
            {org.logoUrl ? (
              <img src={org.logoUrl} alt={org.name} className="h-full w-full object-cover" />
            ) : (
              <Building2 className="h-8 w-8" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Welcome</p>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate font-display text-2xl sm:text-3xl">{org.name}</h1>
              {org.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  <BadgeCheck className="h-3.5 w-3.5" /> Verified
                </span>
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
                  {org.type}
                </span>
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {org.address}, {org.country}
              </span>
            </div>
          </div>
        </div>

        <Button variant="outline" size="sm" className="gap-2 shrink-0">
          <Pencil className="h-4 w-4" /> Edit
        </Button>
      </header>
    </section>
  );
}
