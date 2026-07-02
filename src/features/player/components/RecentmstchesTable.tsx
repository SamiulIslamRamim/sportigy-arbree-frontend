import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/components/ui/table";
import { cn } from "#/lib/utils";
import { formatDate, formatLabels, resultLabels, resultTone } from "../lib/format";
import type { RecentMatch } from "../types";


export function RecentMatchesTable({ matches }: { matches: RecentMatch[] }) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold">Recent Matches</CardTitle>
        <Button variant="link" size="sm" className="text-primary">View all</Button>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="pl-6">Opponent</TableHead>
                <TableHead className="text-right">Runs</TableHead>
                <TableHead className="text-right">Balls</TableHead>
                <TableHead className="text-right">4s</TableHead>
                <TableHead className="text-right">6s</TableHead>
                <TableHead className="text-right">SR</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Ground</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="pr-6">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {matches.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="pl-6">
                    <div className="flex items-center gap-2">
                      <img src={m.opponentLogoUrl} alt="" className="h-6 w-6 rounded-full bg-muted" />
                      <span className="font-medium">{m.opponent}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">{m.runs}</TableCell>
                  <TableCell className="text-right">{m.balls}</TableCell>
                  <TableCell className="text-right">{m.fours}</TableCell>
                  <TableCell className="text-right">{m.sixes}</TableCell>
                  <TableCell className="text-right">{m.strikeRate.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("rounded-md", resultTone[m.result])}>{resultLabels[m.result]}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{m.ground}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(m.date)}</TableCell>
                  <TableCell className="pr-6"><Badge variant="secondary" className="rounded-md">{formatLabels[m.matchType]}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
