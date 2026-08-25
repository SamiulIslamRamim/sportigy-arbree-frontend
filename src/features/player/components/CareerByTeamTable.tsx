import { useMemo, useState } from "react";
import { ChevronDown, Eye, Loader2, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "#/components/ui/alert-dialog";
import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import { Skeleton } from "#/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/components/ui/table";
import {
  useCareerByTeam,
  useHideTeam,
  useSportCategories,
  useUnhideTeam,
} from "../hooks/useCareerStats";
import { buildMetricTables, metricCellValue } from "../lib/career";
import type { CareerTeamStats } from "../types/career.types";

const ALL = "__all__";

const visibilityInput = (sportId: string, team: CareerTeamStats) =>
  team.teamOrgId
    ? { sportId, teamOrgId: team.teamOrgId }
    : { sportId, teamName: team.teamLabel };

export function CareerByTeamTable({ sportId }: { sportId: string | null }) {
  const [categoryId, setCategoryId] = useState<string>(ALL);
  const [metricKey, setMetricKey] = useState<string>("");
  const [teamFilter, setTeamFilter] = useState<string>(ALL);
  const [hiddenOpen, setHiddenOpen] = useState(false);
  const [hiding, setHiding] = useState<CareerTeamStats | null>(null);

  const { data: categories = [] } = useSportCategories(sportId);
  const { data, isLoading, isError } = useCareerByTeam(
    sportId,
    categoryId === ALL ? null : categoryId,
  );
  const hideTeam = useHideTeam();
  const unhideTeam = useUnhideTeam();

  const teams = useMemo(() => data?.teams ?? [], [data]);
  const visibleTeams = useMemo(() => teams.filter((t) => !t.isHidden), [teams]);
  const hiddenTeams = useMemo(() => teams.filter((t) => t.isHidden), [teams]);

  const metricTables = useMemo(() => buildMetricTables(visibleTeams), [visibleTeams]);
  const activeMetricKey = metricTables.some((t) => t.key === metricKey)
    ? metricKey
    : (metricTables[0]?.key ?? "");
  const activeMetric = metricTables.find((t) => t.key === activeMetricKey);

  const rows =
    teamFilter === ALL
      ? visibleTeams
      : visibleTeams.filter((t) => t.teamKey === teamFilter);

  return (
    <Card className="overflow-hidden border-border/60">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0">
        <CardTitle className="text-base font-semibold">Career Statistics</CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger className="h-9 w-[150px] rounded-full">
              <SelectValue placeholder="Match category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={activeMetricKey}
            onValueChange={setMetricKey}
            disabled={!metricTables.length}
          >
            <SelectTrigger className="h-9 w-[150px] rounded-full">
              <SelectValue placeholder="Metric" />
            </SelectTrigger>
            <SelectContent>
              {metricTables.map((table) => (
                <SelectItem key={table.key} value={table.key}>
                  {table.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={teamFilter} onValueChange={setTeamFilter}>
            <SelectTrigger className="h-9 w-[170px] rounded-full">
              <SelectValue placeholder="Team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All teams</SelectItem>
              {visibleTeams.map((t) => (
                <SelectItem key={t.teamKey} value={t.teamKey}>
                  {t.teamLabel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-0 pb-0">
        {!sportId && (
          <p className="px-6 pb-4 text-sm text-muted-foreground">
            Add a sport profile to see your career statistics.
          </p>
        )}

        {isLoading && (
          <div className="space-y-3 px-6 pb-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        )}

        {isError && (
          <p className="px-6 pb-4 text-sm text-destructive">
            Failed to load team statistics. Please try again.
          </p>
        )}

        {data && visibleTeams.length === 0 && (
          <p className="px-6 pb-4 text-sm text-muted-foreground">
            No team stats yet — play approved matches to build your record.
          </p>
        )}

        {activeMetric && rows.length > 0 && (
          <Section title={activeMetric.label}>
            <div className="max-h-64 overflow-auto">
              <Table className="w-full table-fixed">
                <colgroup>
                  <col className="w-48" />
                  {activeMetric.fields.map((field) => (
                    <col key={field.fieldId} />
                  ))}
                  <col className="w-12" />
                </colgroup>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="sticky top-0 z-10 bg-muted pl-6">Team</TableHead>
                    {activeMetric.fields.map((field) => (
                      <TableHead
                        key={field.fieldId}
                        title={field.name}
                        className="truncate text-right"
                      >
                        {field.name}
                      </TableHead>
                    ))}
                    <TableHead className="sticky top-0 z-10 bg-muted" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((team) => (
                    <TableRow key={team.teamKey}>
                      <TableCell className="pl-6">
                        <span className="block truncate" title={team.teamLabel}>
                          {team.teamLabel}
                        </span>
                      </TableCell>
                      {activeMetric.fields.map((field) => (
                        <TableCell
                          key={field.fieldId}
                          className="text-right tabular-nums"
                        >
                          {metricCellValue(team, activeMetric.key, field.fieldId)}
                        </TableCell>
                      ))}
                      <TableCell className="pr-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          aria-label={`Hide ${team.teamLabel}`}
                          onClick={() => setHiding(team)}
                        >
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Section>
        )}

        {hiddenTeams.length > 0 && (
          <div className="px-6 pb-4">
            <button
              type="button"
              onClick={() => setHiddenOpen((open) => !open)}
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${hiddenOpen ? "rotate-180" : ""}`}
              />
              Hidden teams ({hiddenTeams.length})
            </button>
            {hiddenOpen && (
              <div className="mt-3 flex flex-wrap gap-2">
                {hiddenTeams.map((team) => (
                  <Badge
                    key={team.teamKey}
                    variant="outline"
                    className="flex items-center gap-1.5 py-1 pl-3 pr-1"
                  >
                    <span className="max-w-[180px] truncate">{team.teamLabel}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 gap-1 rounded-full px-2 text-xs"
                      disabled={unhideTeam.isPending}
                      onClick={() => unhideTeam.mutate(visibilityInput(sportId as string, team))}
                    >
                      {unhideTeam.isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Eye className="h-3.5 w-3.5" />
                      )}
                      Unhide
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>

      <AlertDialog open={Boolean(hiding)} onOpenChange={(open) => !open && setHiding(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hide {hiding?.teamLabel}?</AlertDialogTitle>
            <AlertDialogDescription>
              This team's stats will no longer show in your career tables. You can unhide
              it later from the hidden teams list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (hiding && sportId) {
                  hideTeam.mutate(visibilityInput(sportId, hiding));
                }
                setHiding(null);
              }}
            >
              Hide team
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <h4 className="px-6 pb-2 text-sm font-semibold text-muted-foreground">{title}</h4>
      {children}
    </div>
  );
}
