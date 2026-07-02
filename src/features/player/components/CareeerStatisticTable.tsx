import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "#/components/ui/table";
import { formatLabels } from "../lib/format";
import type { BattingStatistics, BowlingStatistics, CareerStatistics } from "../types";


const battingCols: { key: keyof BattingStatistics; label: string }[] = [
  { key: "matches", label: "Mat" },
  { key: "innings", label: "Inns" },
  { key: "runs", label: "Runs" },
  { key: "highestScore", label: "HS" },
  { key: "average", label: "Avg" },
  { key: "strikeRate", label: "SR" },
  { key: "fifties", label: "50s" },
  { key: "hundreds", label: "100s" },
  { key: "fours", label: "4s" },
  { key: "sixes", label: "6s" },
  { key: "notOuts", label: "NO" },
];

const bowlingCols: { key: keyof BowlingStatistics; label: string }[] = [
  { key: "matches", label: "Mat" },
  { key: "overs", label: "Overs" },
  { key: "maidens", label: "Mdns" },
  { key: "wickets", label: "Wkts" },
  { key: "economy", label: "Econ" },
  { key: "average", label: "Avg" },
  { key: "bestBowling", label: "Best" },
  { key: "strikeRate", label: "SR" },
];

export function CareerStatisticsTable({ career }: { career: CareerStatistics }) {
  return (
    <Card className="border-border/60">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-semibold">Career Statistics</CardTitle>
        <Button variant="link" size="sm" className="text-primary">View all</Button>
      </CardHeader>
      <CardContent className="space-y-6 px-0 pb-0">
        <Section title="Batting & Fielding">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="pl-6">Format</TableHead>
                  {battingCols.map((c) => (
                    <TableHead key={c.key as string} className="text-right">{c.label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {career.batting.map((row) => (
                  <TableRow key={row.format}>
                    <TableCell className="pl-6"><Badge variant="secondary" className="rounded-md">{formatLabels[row.format]}</Badge></TableCell>
                    {battingCols.map((c) => (
                      <TableCell key={c.key as string} className="text-right tabular-nums">{String(row[c.key])}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Section>

        <Section title="Bowling">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="pl-6">Format</TableHead>
                  {bowlingCols.map((c) => (
                    <TableHead key={c.key as string} className="text-right">{c.label}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {career.bowling.map((row) => (
                  <TableRow key={row.format}>
                    <TableCell className="pl-6"><Badge variant="secondary" className="rounded-md">{formatLabels[row.format]}</Badge></TableCell>
                    {bowlingCols.map((c) => (
                      <TableCell key={c.key as string} className="text-right tabular-nums">{String(row[c.key])}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Section>
      </CardContent>
    </Card>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="px-6 pb-2 text-sm font-semibold text-muted-foreground">{title}</h4>
      {children}
    </div>
  );
}
