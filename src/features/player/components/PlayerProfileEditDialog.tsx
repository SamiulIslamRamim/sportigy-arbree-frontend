import { Controller, useForm } from "react-hook-form";
import { useUpdateBasicProfile } from "../hooks/useBasicProfile";
import { updateBasicProfileSchema } from "../schemas/basicProfile.schema";
import type {  UpdateBasicProfileFormValues } from "../schemas/basicProfile.schema";
import type { BasicProfile } from "../types";
import type { UpdateSportProfileInput } from "../types/sportProfile.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { SportProfileEditDialog } from "./SportProfileEditDialog";
import { useUpdateSportProfile } from "../hooks/useSportProfiles";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "#/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";
import { Button } from "#/components/ui/button";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  player: BasicProfile;
  sportId: string;
}

const defaultsFrom = (p: BasicProfile): UpdateBasicProfileFormValues => ({
  name: p.name,
  bio: p.bio ?? "",
  gender: p.gender ?? undefined,
  birthday: p.birthday ?? "",
  height: p.height ?? "",
  weight: p.weight ?? "",
  contactNo: p.contactNo ?? "",
  city: p.city ?? "",
  state: p.state ?? "",
  country: p.country,
});

export function PlayerProfileEditDialog({ open, onOpenChange, player, sportId }: Props) {
  const mutation = useUpdateBasicProfile();
  const sportMutation = useUpdateSportProfile();
  const [sportPayload, setSportPayload] = useState<UpdateSportProfileInput>({});
  const onSportChange = useCallback((input: UpdateSportProfileInput) => setSportPayload(input), []);

  const form = useForm<UpdateBasicProfileFormValues>({
    resolver: zodResolver(updateBasicProfileSchema),
    defaultValues: defaultsFrom(player),
  });

  useEffect(() => {
    if (open) form.reset(defaultsFrom(player));
  }, [open, player, form]);

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(values, {
      onSuccess: () => {
        if (!sportId) {
          onOpenChange(false);
          return;
        }
        sportMutation.mutate(
          { sportId, input: sportPayload },
          { onSuccess: () => onOpenChange(false) },
        );
      },
    });
  });

  const submitting = mutation.isPending || sportMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit player information</DialogTitle>
          <DialogDescription>Update your basic profile details.</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
          <FieldGroup className="contents">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="md:col-span-2" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input {...field} id="name" placeholder="Full name" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="bio"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="md:col-span-2" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="bio">Bio</FieldLabel>
                  <Input {...field} id="bio" placeholder="Short bio" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="gender"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Gender</FieldLabel>
                  <Select value={field.value ?? ""} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {(["male", "female", "other"] as const).map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="birthday"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="birthday">Birthday</FieldLabel>
                  <Input {...field} id="birthday" type="date" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="weight"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="weight">Weight (KG)</FieldLabel>
                  <Input {...field} id="weight" placeholder="73" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="height"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="height">Height (CM)</FieldLabel>
                  <Input {...field} id="height" placeholder="178" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="contactNo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="md:col-span-2" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="contactNo">Phone</FieldLabel>
                  <Input {...field} id="contactNo" placeholder="+1 812 345 678" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="city"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="city">City</FieldLabel>
                  <Input {...field} id="city" placeholder="City" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="state"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="state">State</FieldLabel>
                  <Input {...field} id="state" placeholder="State" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            <Controller
              name="country"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="md:col-span-2" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="country">Country</FieldLabel>
                  <Input {...field} id="country" placeholder="Country" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>

          <SportProfileEditDialog sportId={sportId} onChange={onSportChange} />

          <DialogFooter className="md:col-span-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {submitting ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}