import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { PlayerLayout } from "./PlayerLayout";

export function ComingSoonPage({ title }: { title: string }) {
  return (
    <PlayerLayout>
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">This section is coming soon.</p>
        </CardContent>
      </Card>
    </PlayerLayout>
  );
}
