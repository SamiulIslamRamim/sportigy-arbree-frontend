import { useState } from "react";
import { useBasicProfile } from "../hooks/useBasicProfile";
import { useSportProfile, useSportProfiles } from "../hooks/useSportProfiles";
import { Card } from "#/components/ui/card";
import { Skeleton } from "#/components/ui/skeleton";
import { Alert, AlertDescription } from "#/components/ui/alert";
import { extractApiError } from "#/lib/api/axios";
import { getCountryFlagUrl } from "../utils/country";
import { Pencil, Plus } from "lucide-react";
import { displayValue, formatMeasurement } from "../utils/display-values";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { formatAgeWithBirthday } from "../utils/date";
import { PlayerProfileEditDialog } from "./PlayerProfileEditDialog";
import { AddSportProfileDialog } from "./AddSportProfileDialog";

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-0">
    <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
    <p className="mt-1 truncate text-sm font-semibold text-foreground">{value}</p>
  </div>
);

export function PlayerProfileCard({ sportId }: { sportId: string }) {
  const { data, isLoading, isError, error } = useBasicProfile();
  const { data: profiles } = useSportProfiles();
  const { data: sportProfile } = useSportProfile(sportId);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  if (isLoading) {
    return (
      <Card className="border-border/60 p-4 md:p-6">
        <div className="flex items-start gap-4 md:gap-6">
          <Skeleton className="h-20 w-20 rounded-2xl md:h-28 md:w-28" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Card className="border-border/60 p-4 md:p-6">
        <Alert variant="destructive">
          <AlertDescription>{extractApiError(error, "Failed to load player information")}</AlertDescription>
        </Alert>
      </Card>
    );
  }

  const flagUrl = getCountryFlagUrl(data.country);
  const sportValues = sportProfile?.values ?? [];

  return (
    <>
      <Card className="overflow-hidden border-border/60 p-4 md:p-6">
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-4 md:gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-muted md:h-28 md:w-28" />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate font-display text-2xl md:text-3xl">{displayValue(data.name)}</h2>
              {flagUrl && data.country ? (
                <img src={flagUrl} alt={data.country} className="h-5 w-7 rounded-sm object-cover" />
              ) : null}
              {profiles?.map((p) => (
                <Badge key={p.sportId} variant="secondary" className="rounded-md">
                  {p.sport?.name ?? p.sportId}
                </Badge>
              ))}
              <Button type="button" variant="outline" size="sm" className="h-7 gap-1 rounded-md" onClick={() => setAddOpen(true)}>
                <Plus className="h-3.5 w-3.5" />
                Add sport
              </Button>
            </div>
            {data.bio ? <p className="mt-1 text-sm text-muted-foreground">{data.bio}</p> : null}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full shrink-0"
            onClick={() => setEditOpen(true)}
            aria-label="Edit player information"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-4 sm:grid-cols-3 md:grid-cols-5">
          <Stat label="Weight" value={formatMeasurement(data.weight, "KG")} />
          <Stat label="Height" value={formatMeasurement(data.height, "CM")} />
          <Stat label="Age" value={formatAgeWithBirthday(data.birthday)} />
          <Stat label="Phone" value={displayValue(data.contactNo)} />
          <Stat
            label="Address"
            value={[data.city, data.state, data.country].filter(Boolean).join(", ") || "—"}
          />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-4 sm:grid-cols-3 md:grid-cols-4">
          <Stat label="Academy" value={sportProfile?.academy || "—"} />
          {sportValues.map((v) => (
            <Stat key={v.fieldId} label={v.field.name} value={v.option?.label || "—"} />
          ))}
        </div>
      </Card>

      <PlayerProfileEditDialog open={editOpen} onOpenChange={setEditOpen} player={data} sportId={sportId} />
      <AddSportProfileDialog open={addOpen} onOpenChange={setAddOpen} />
    </>
  );
}
