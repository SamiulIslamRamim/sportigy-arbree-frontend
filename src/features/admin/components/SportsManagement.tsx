import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useAdminSports } from "../hooks/useAdminSports";
import { SportFormDialog } from "./SportFormDialog";

export function SportsManagement() {
  const { data = [], isLoading } = useAdminSports();
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Sports & categories</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create sport
        </Button>
      </div>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {data.map((s) => (
            <Link key={s.id} to="/admin/sports/$sportId" params={{ sportId: s.id }}>
              <Card className="transition-colors hover:bg-muted/40">
                <CardHeader>
                  <CardTitle className="text-base">{s.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  {s._count?.categories ?? 0} categories · {s.isActive ? "Active" : "Inactive"}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
      <SportFormDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}
