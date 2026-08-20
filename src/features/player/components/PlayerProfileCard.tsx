import { useState } from "react";
import { Pencil } from "lucide-react";
import { Card } from "#/components/ui/card";
import { Skeleton } from "#/components/ui/skeleton";
import { Alert, AlertDescription } from "#/components/ui/alert";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { extractApiError } from "#/lib/api/axios";
import { getCountryFlagUrl } from "../utils/country";
import { displayValue, formatAddress, formatMeasurement } from "../utils/display-values";
import { formatAgeWithBirthday } from "../utils/date";
import { useBasicProfile, useSportProfile } from "../hooks/usePlayerProfile";
import { PlayerProfileEditDialog } from "./PlayerProfileEditDialog";

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-0">
    <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
    <p className="mt-1 truncate text-sm font-semibold text-foreground">{value}</p>
  </div>
);

const avatarUrl =
  "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=400&q=80";

export function PlayerProfileCard({ sportId }: { sportId: string | null }) {
  const basic = useBasicProfile();
  const sportProfile = useSportProfile(sportId);
  const [editOpen, setEditOpen] = useState(false);

  if (basic.isLoading) {
    return (
      <Card className="border-border/60 p-4 md:p-6">
        <div className="flex items-start gap-4 md:gap-6">
          <Skeleton className="h-20 w-20 rounded-2xl md:h-28 md:w-28" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-4 sm:grid-cols-3 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  if (basic.isError || !basic.data) {
    return (
      <Card className="border-border/60 p-4 md:p-6">
        <Alert variant="destructive">
          <AlertDescription>
            {extractApiError(basic.error, "Failed to load player information")}
          </AlertDescription>
        </Alert>
      </Card>
    );
  }

  const data = basic.data;
  const profile = sportProfile.data ?? null;

  const profileFields = profile
    ? [...profile.values]
        .sort((a, b) => (a.field.displayOrder ?? 0) - (b.field.displayOrder ?? 0))
        .map((v) => ({ key: v.field.id, label: v.field.name, value: v.option?.label ?? null }))
    : [];

  const flagUrl = getCountryFlagUrl(data.country);

  return (
    <>
      <Card className="overflow-hidden border-border/60 p-4 md:p-6">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-4 md:gap-6">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-muted md:h-28 md:w-28">
            <img src={avatarUrl} alt="Player avatar" className="h-full w-full object-cover" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate font-display text-2xl md:text-3xl">
                {displayValue(data.name)}
              </h2>
              {flagUrl && data.country ? (
                <img src={flagUrl} alt={data.country} className="h-5 w-7 rounded-sm object-cover" />
              ) : null}
              <Badge variant="secondary" className="rounded-md">
                {displayValue(profile?.academy)}
              </Badge>
            </div>

            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {profileFields.length > 0 ? (
                profileFields.map((f, i) => (
                  <span key={f.key} className="inline-flex items-center gap-1.5">
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-primary">
                      {f.value ?? displayValue(null)}
                    </span>
                    {i < profileFields.length - 1 ? <span>·</span> : null}
                  </span>
                ))
              ) : (
                <span>
                  {sportProfile.isLoading
                    ? "Loading sport profile..."
                    : "No sport profile fields yet"}
                </span>
              )}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="shrink-0 rounded-full"
            onClick={() => setEditOpen(true)}
            aria-label="Edit player information"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-4 sm:grid-cols-3 md:grid-cols-5">
          <Stat label="Weight" value={formatMeasurement(data.weight, "KG")} />
          <Stat label="Height" value={formatMeasurement(data.height, "CM")} />
          <Stat label="Academy" value={displayValue(profile?.academy)} />
          <Stat label="Age" value={formatAgeWithBirthday(data.birthday)} />
          <Stat
            label="Address"
            value={formatAddress({ city: data.city, state: data.state, country: data.country })}
          />
        </div>
      </Card>

      <PlayerProfileEditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        basic={data}
        sportId={sportId}
        academy={profile?.academy ?? null}
      />
    </>
  );
}