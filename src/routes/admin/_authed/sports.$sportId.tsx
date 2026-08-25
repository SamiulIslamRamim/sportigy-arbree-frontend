import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { CategoriesTab } from "#/features/admin/components/sport/CategoriesTab";
import { FieldsTab } from "#/features/admin/components/sport/FieldsTab";
import { MetricsTab } from "#/features/admin/components/sport/MatricsTab";
import { useSport } from "#/features/admin/hooks/useAdminSport";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";


export const Route = createFileRoute("/admin/_authed/sports/$sportId")({
  head: () => ({
    meta: [
      { title: "Configure Sport — Spotig Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminSportDetailPage,
});

function AdminSportDetailPage() {
  const { sportId } = Route.useParams();
  const { data: sport, isLoading } = useSport(sportId);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!sport) {
    return (
      <Card>
        <CardContent className="space-y-4 py-16 text-center">
          <p className="text-sm text-muted-foreground">This sport could not be found.</p>
          <Button asChild variant="secondary">
            <Link to="/admin/sports">Back to sports</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link to="/admin/sports">
            <ArrowLeft className="mr-2 h-4 w-4" /> All sports
          </Link>
        </Button>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-wider md:text-3xl">{sport.name}</h1>
          <Badge variant={sport.isActive ? "default" : "secondary"}>
            {sport.isActive ? "Active" : "Inactive"}
          </Badge>
          <span className="text-sm text-muted-foreground">/{sport.slug}</span>
        </div>
        {sport.description && (
          <p className="max-w-2xl text-sm text-muted-foreground">{sport.description}</p>
        )}
      </div>

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList className="flex-wrap">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="profile">Profile fields</TabsTrigger>
          <TabsTrigger value="match">Match fields</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <CategoriesTab sportId={sportId} />
        </TabsContent>
        <TabsContent value="metrics">
          <MetricsTab sportId={sportId} />
        </TabsContent>
        <TabsContent value="profile">
          <FieldsTab sportId={sportId} section="PROFILE" />
        </TabsContent>
        <TabsContent value="match">
          <FieldsTab sportId={sportId} section="MATCH" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
