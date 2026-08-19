import { Button } from "#/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";
import { extractApiError } from "#/lib/api/axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import {
  useAdminFieldOptions,
  useAdminSport,
  useCreateCategory,
  useCreateMetric,
  useCreateOption,
} from "../hooks/useAdminSports";
import { FieldFormDialog } from "./FieldFormDialog";

export function SportDetail({ sportId }: { sportId: string }) {
  const { data, isLoading, isError, error } = useAdminSport(sportId);
  const createCategory = useCreateCategory(sportId);
  const createMetric = useCreateMetric(sportId);
  const [fieldOpen, setFieldOpen] = useState(false);
  const [catName, setCatName] = useState("");
  const [metricName, setMetricName] = useState("");
  const [optionFieldId, setOptionFieldId] = useState("");

  if (isLoading) return <Loader2 className="h-5 w-5 animate-spin" />;
  if (isError || !data) return <p className="text-sm text-destructive">{extractApiError(error, "Failed to load sport")}</p>;

  const selectFields = data.fields.filter((f) => f.type === "SELECT" || f.type === "MULTI_SELECT");

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-2xl">{data.name}</h1>
        <p className="text-sm text-muted-foreground">{data.description || data.slug}</p>
      </div>
      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="fields">Fields</TabsTrigger>
          <TabsTrigger value="options">Options</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>
        <TabsContent value="categories" className="space-y-3">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!catName.trim()) return;
              createCategory.mutate({ name: catName.trim() }, { onSuccess: () => setCatName("") });
            }}
          >
            <Input value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="T20 / ODI / TEST" />
            <Button type="submit" disabled={createCategory.isPending}>
              Add category
            </Button>
          </form>
          {data.categories.map((c) => (
            <Card key={c.id}>
              <CardHeader>
                <CardTitle className="text-base">{c.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{c.slug}</CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="fields" className="space-y-3">
          <Button onClick={() => setFieldOpen(true)}>Add field</Button>
          {data.fields.map((f) => (
            <Card key={f.id}>
              <CardHeader>
                <CardTitle className="text-base">{f.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {f.section} · {f.type}
                {f.isComputed ? " · computed" : ""}
                {f.required ? " · required" : ""}
              </CardContent>
            </Card>
          ))}
          <FieldFormDialog open={fieldOpen} onOpenChange={setFieldOpen} sport={data} />
        </TabsContent>
        <TabsContent value="options" className="space-y-3">
          <OptionsTab sportId={sportId} fieldId={optionFieldId} fields={selectFields} onFieldChange={setOptionFieldId} />
        </TabsContent>
        <TabsContent value="metrics" className="space-y-3">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!metricName.trim()) return;
              createMetric.mutate({ name: metricName.trim() }, { onSuccess: () => setMetricName("") });
            }}
          >
            <Input value={metricName} onChange={(e) => setMetricName(e.target.value)} placeholder="Batting / Bowling" />
            <Button type="submit" disabled={createMetric.isPending}>
              Add metric
            </Button>
          </form>
          {data.metrics.map((m) => (
            <Card key={m.id}>
              <CardHeader>
                <CardTitle className="text-base">{m.name}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OptionsTab({
  sportId,
  fieldId,
  fields,
  onFieldChange,
}: {
  sportId: string;
  fieldId: string;
  fields: { id: string; name: string }[];
  onFieldChange: (id: string) => void;
}) {
  const { data: options = [] } = useAdminFieldOptions(fieldId);
  const create = useCreateOption(sportId, fieldId);
  const [label, setLabel] = useState("");

  return (
    <div className="space-y-3">
      <select className="h-9 rounded-md border bg-background px-3 text-sm" value={fieldId} onChange={(e) => onFieldChange(e.target.value)}>
        <option value="">Select a field</option>
        {fields.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>
      {fieldId ? (
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!label.trim()) return;
            create.mutate({ label: label.trim() }, { onSuccess: () => setLabel("") });
          }}
        >
          <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Option label" />
          <Button type="submit" disabled={create.isPending}>
            Add option
          </Button>
        </form>
      ) : null}
      {options.map((o) => (
        <div key={o.id} className="rounded-lg border px-3 py-2 text-sm">
          {o.label}
        </div>
      ))}
    </div>
  );
}
