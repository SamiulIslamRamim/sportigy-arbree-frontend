import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/components/ui/table";
import { cn } from "#/lib/utils";
import { Link } from "@tanstack/react-router";
import { dash, formatDate, resultLabels, resultTone } from "../lib/format";
import type { PlayerMatch } from "../types";

export function RecentMatchesTable({ matches }: { matches: PlayerMatch[] }) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold">Recent Matches</CardTitle>
        <Button variant="link" size="sm" className="text-primary" asChild>
          <Link to="/player/matches">View all</Link>
        </Button>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="pl-6">Venue</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Result</TableHead>
                <TableHead className="pr-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                    No approved matches yet.
                  </TableCell>
                </TableRow>
              ) : (
                matches.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="pl-6 font-medium">{dash(m.venue)}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(m.matchDate)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("rounded-md", resultTone[m.result])}>
                        {resultLabels[m.result]}
                      </Badge>
                    </TableCell>
                    <TableCell className="pr-6">
                      <Badge variant="secondary" className="rounded-md">
                        {m.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
