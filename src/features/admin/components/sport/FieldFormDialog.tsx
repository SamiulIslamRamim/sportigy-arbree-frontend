import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { slugify } from "../../lib/slug";
import { FIELD_SECTIONS, FIELD_TYPE_LABELS, FIELD_TYPES } from "../../types/admin-sport.types";
import type { AdminSportField, AdminSportMetric, FieldPayload, FieldSection, FieldType, FormulaRole } from "../../types/admin-sport.types";
import { ScrollArea } from "#/components/ui/scroll-area";


const UNSET = "";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  field?: AdminSportField | null;
  metrics: AdminSportMetric[];
  numberFields: AdminSportField[];
  isPending: boolean;
  onSubmit: (payload: FieldPayload) => void;
}

interface DraftOption {
  label: string;
  value: string;
  isDefault: boolean;
}

export function FieldFormDialog({
  open,
  onOpenChange,
  field,
  metrics,
  numberFields,
  isPending,
  onSubmit,
}: Props) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [description, setDescription] = useState("");
  const [section, setSection] = useState<FieldSection>("PROFILE");
  const [type, setType] = useState<FieldType>("NUMBER");
  const [required, setRequired] = useState(false);
  const [searchable, setSearchable] = useState(false);
  const [filterable, setFilterable] = useState(false);
  const [sortable, setSortable] = useState(false);
  const [displayOrder, setDisplayOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [metricId, setMetricId] = useState<string>(UNSET);
  const [isComputed, setIsComputed] = useState(false);
  const [numeratorId, setNumeratorId] = useState<string>(UNSET);
  const [denominatorId, setDenominatorId] = useState<string>(UNSET);
  const [formulaMultiplier, setFormulaMultiplier] = useState("");
  const [options, setOptions] = useState<DraftOption[]>([]);

  useEffect(() => {
    if (!open) return;
    setName(field?.name ?? "");
    setSlug(field?.slug ?? "");
    setSlugTouched(Boolean(field));
    setDescription(field?.description ?? "");
    setSection(field?.section ?? "PROFILE");
    setType(field?.type ?? "TEXT");
    setRequired(field?.required ?? false);
    setSearchable(field?.searchable ?? false);
    setFilterable(field?.filterable ?? false);
    setSortable(field?.sortable ?? false);
    setDisplayOrder(String(field?.displayOrder ?? 0));
    setIsActive(field?.isActive ?? true);
    setMetricId(field?.metricId ?? UNSET);
    setIsComputed(field?.isComputed ?? false);
    setNumeratorId(
      field?.formulaComponents.find((c) => c.role === "NUMERATOR")?.sourceFieldId ?? UNSET,
    );
    setDenominatorId(
      field?.formulaComponents.find((c) => c.role === "DENOMINATOR")?.sourceFieldId ?? UNSET,
    );
    setFormulaMultiplier(
      field?.formulaMultiplier === null || field?.formulaMultiplier === undefined
        ? "100"
        : String(field.formulaMultiplier),
    );
    setOptions(
      field?.options.map((o) => ({ label: o.label, value: o.value, isDefault: o.isDefault })) ?? [],
    );
  }, [open, field]);

  const hasOptions = type === "SELECT" || type === "MULTI_SELECT";
  const canCompute = section === "MATCH" && type === "NUMBER";

  const sourceChoices = useMemo(
    () =>
      numberFields.filter(
        (f) => f.section === "MATCH" && f.id !== field?.id && !f.isComputed,
      ),
    [numberFields, field?.id],
  );

  const metricMissing = section === "MATCH" && !metricId;
  const formulaIncomplete =
    canCompute && isComputed && (!numeratorId || !denominatorId);
  const formulaSameField =
    canCompute && isComputed &&
    Boolean(numeratorId) && numeratorId === denominatorId;

  const submit = () => {
    if (metricMissing || formulaIncomplete || formulaSameField) return;
    const payload: FieldPayload = {
      name: name.trim(),
      slug: slug.trim() || slugify(name),
      description: description.trim() ? description.trim() : null,
      section,
      type,
      required: isComputed ? false : required,
      searchable,
      filterable,
      sortable,
      displayOrder: Number(displayOrder) || 0,
      isActive,
      metricId: section === "MATCH" ? metricId : null,
      isComputed: canCompute ? isComputed : false,
      formulaMultiplier:
        canCompute && isComputed && formulaMultiplier !== "" ? Number(formulaMultiplier) : null,
    };
    if (canCompute) {
      payload.formulaComponents = isComputed
        ? [
            ...(numeratorId
              ? [{ sourceFieldId: numeratorId, role: "NUMERATOR" as FormulaRole }]
              : []),
            ...(denominatorId
              ? [{ sourceFieldId: denominatorId, role: "DENOMINATOR" as FormulaRole }]
              : []),
          ]
        : [];
    }
    if (hasOptions) {
      payload.options = options
        .filter((o) => o.label.trim())
        .map((o) => ({
          label: o.label.trim(),
          value: o.value.trim() || slugify(o.label),
          isDefault: o.isDefault,
          isActive: true,
        }));
    }
    onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{field ? "Edit field" : "Add field"}</DialogTitle>
          <DialogDescription>
            Fields define the data captured for player profiles and match records.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!slugTouched) setSlug(slugify(e.target.value));
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label>Slug</Label>
                <Input
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label>Section</Label>
                <Select
                  value={section}
                  onValueChange={(v) => {
                    const next = v as FieldSection;
                    setSection(next);
                    if (next !== "MATCH") {
                      setMetricId(UNSET);
                      setIsComputed(false);
                      setNumeratorId(UNSET);
                      setDenominatorId(UNSET);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FIELD_SECTIONS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s === "PROFILE" ? "Profile" : "Match"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Type</Label>
                <Select
                  value={type}
                  onValueChange={(v) => {
                    const next = v as FieldType;
                    setType(next);
                    if (next !== "NUMBER") {
                      setIsComputed(false);
                      setNumeratorId(UNSET);
                      setDenominatorId(UNSET);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FIELD_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {FIELD_TYPE_LABELS[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Display order</Label>
                <Input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                />
              </div>
            </div>

            {section === "MATCH" && (
              <div className="grid gap-2">
                <Label>
                  Metric group <span className="text-destructive">*</span>
                </Label>
                <Select value={metricId} onValueChange={setMetricId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a metric" />
                  </SelectTrigger>
                  <SelectContent>
                    {metrics.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!metricId && (
                  <p className="text-xs text-destructive">
                    Metric is required for match fields.
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 rounded-lg border p-3 sm:grid-cols-4">
              {(
                [
                  ["Required", required, setRequired],
                  ["Searchable", searchable, setSearchable],
                  ["Filterable", filterable, setFilterable],
                  ["Sortable", sortable, setSortable],
                ] as const
              ).map(([label, value, setter]) => (
                <label
                  key={label}
                  className={`flex items-center gap-2 text-sm ${
                    label === "Required" && isComputed ? "opacity-50" : ""
                  }`}
                >
                  <Checkbox
                    checked={value}
                    disabled={label === "Required" && isComputed}
                    onCheckedChange={(c) => setter(Boolean(c))}
                  />
                  {label}
                </label>
              ))}
            </div>

            {hasOptions && (
              <div className="space-y-3 rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <Label>Options</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      setOptions((prev) => [...prev, { label: "", value: "", isDefault: false }])
                    }
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" /> Add
                  </Button>
                </div>
                {!options.length && (
                  <p className="text-xs text-muted-foreground">No options added yet.</p>
                )}
                {options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      placeholder="Label"
                      value={option.label}
                      onChange={(e) =>
                        setOptions((prev) =>
                          prev.map((o, i) =>
                            i === index
                              ? {
                                  ...o,
                                  label: e.target.value,
                                  value: o.value || slugify(e.target.value),
                                }
                              : o,
                          ),
                        )
                      }
                    />
                    <Input
                      placeholder="Value"
                      value={option.value}
                      onChange={(e) =>
                        setOptions((prev) =>
                          prev.map((o, i) => (i === index ? { ...o, value: e.target.value } : o)),
                        )
                      }
                    />
                    <label className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                      <Checkbox
                        checked={option.isDefault}
                        onCheckedChange={(c) =>
                          setOptions((prev) =>
                            prev.map((o, i) => ({ ...o, isDefault: i === index && Boolean(c) })),
                          )
                        }
                      />
                      Default
                    </label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setOptions((prev) => prev.filter((_, i) => i !== index))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {canCompute && (
              <div className="space-y-3 rounded-lg border p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Computed field</Label>
                    <p className="text-xs text-muted-foreground">
                      Value derived from other match number fields.
                    </p>
                  </div>
                  <Switch checked={isComputed} onCheckedChange={setIsComputed} />
                </div>

                {isComputed && (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label>
                          Numerator <span className="text-destructive">*</span>
                        </Label>
                        <Select value={numeratorId} onValueChange={setNumeratorId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select numerator field" />
                          </SelectTrigger>
                          <SelectContent>
                            {sourceChoices.map((f) => (
                              <SelectItem
                                key={f.id}
                                value={f.id}
                                disabled={f.id === denominatorId}
                              >
                                {f.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label>
                          Denominator <span className="text-destructive">*</span>
                        </Label>
                        <Select value={denominatorId} onValueChange={setDenominatorId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select denominator field" />
                          </SelectTrigger>
                          <SelectContent>
                            {sourceChoices.map((f) => (
                              <SelectItem
                                key={f.id}
                                value={f.id}
                                disabled={f.id === numeratorId}
                              >
                                {f.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {formulaSameField && (
                      <p className="text-xs text-destructive">
                        Numerator and denominator cannot be the same field.
                      </p>
                    )}

                    {!sourceChoices.length && (
                      <p className="text-xs text-destructive">
                        Add at least one non-computed NUMBER match field first.
                      </p>
                    )}

                    <div className="grid gap-2">
                      <Label>Multiplier</Label>
                      <Input
                        type="number"
                        placeholder="e.g. 100"
                        value={formulaMultiplier}
                        onChange={(e) => setFormulaMultiplier(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label>Active</Label>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={submit}
            disabled={
              isPending ||
              !name.trim() ||
              metricMissing ||
              formulaIncomplete ||
              formulaSameField
            }
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {field ? "Save changes" : "Create field"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
