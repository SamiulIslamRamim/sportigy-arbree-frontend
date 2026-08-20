import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Textarea } from "#/components/ui/textarea";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "#/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog";
import { toDateInputValue } from "../utils/date";
import { useUpdateBasicProfile, useUpdateSportProfile } from "../hooks/usePlayerProfile";
import { editProfileSchema } from "../schemas/player.schema";
import type { EditProfileFormValues } from "../schemas/player.schema";
import type { BasicProfile } from "../types/player.types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  basic: BasicProfile;
  sportId: string | null;
  academy: string | null;
}

const GENDER_LABELS: Record<string, string> = { male: "Male", female: "Female", other: "Other" };

const defaultsFrom = (basic: BasicProfile, academy: string | null): EditProfileFormValues => ({
  name: basic.name,
  bio: basic.bio ?? "",
  gender: basic.gender ?? "other",
  birthday: toDateInputValue(basic.birthday),
  height: basic.height ?? "",
  weight: basic.weight ?? "",
  contactNo: basic.contactNo ?? "",
  city: basic.city ?? "",
  state: basic.state ?? "",
  country: basic.country ?? "",
  academy: academy ?? "",
});

export function PlayerProfileEditDialog({ open, onOpenChange, basic, sportId, academy }: Props) {
  const updateBasic = useUpdateBasicProfile();
  const updateSport = useUpdateSportProfile();
  const submitting = updateBasic.isPending || updateSport.isPending;

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: defaultsFrom(basic, academy),
  });

  useEffect(() => {
    if (open) form.reset(defaultsFrom(basic, academy));
  }, [open, basic, academy, form]);

  const onSubmit = form.handleSubmit((values) => {
    const finish = () => onOpenChange(false);
    const afterBasic = () => {
      if (!sportId) {
        finish();
        return;
      }
      updateSport.mutate(
        { sportId, input: { academy: values.academy || null } },
        { onSuccess: finish },
      );
    };

    updateBasic.mutate(
      {
        name: values.name,
        bio: values.bio || null,
        gender: values.gender,
        birthday: values.birthday,
        height: values.height || null,
        weight: values.weight || null,
        contactNo: values.contactNo || null,
        city: values.city || null,
        state: values.state || null,
        country: values.country,
      },
      { onSuccess: afterBasic },
    );
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit player information</DialogTitle>
          <DialogDescription>Update your profile details.</DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
          <FieldGroup className="contents">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="md:col-span-2" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    placeholder="Full name"
                    aria-invalid={fieldState.invalid}
                  />
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
                  <Textarea
                    {...field}
                    id="bio"
                    value={field.value ?? ""}
                    rows={3}
                    placeholder="Short bio"
                    aria-invalid={fieldState.invalid}
                  />
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
                  <Select value={field.value ?? "other"} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(GENDER_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
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
                  <Input
                    {...field}
                    id="birthday"
                    type="date"
                    aria-invalid={fieldState.invalid}
                  />
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
                  <Input
                    {...field}
                    id="weight"
                    value={field.value ?? ""}
                    placeholder="73"
                    aria-invalid={fieldState.invalid}
                  />
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
                  <Input
                    {...field}
                    id="height"
                    value={field.value ?? ""}
                    placeholder="178"
                    aria-invalid={fieldState.invalid}
                  />
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
                  <Input
                    {...field}
                    id="contactNo"
                    value={field.value ?? ""}
                    placeholder="+880..."
                    aria-invalid={fieldState.invalid}
                  />
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
                  <Input
                    {...field}
                    id="city"
                    value={field.value ?? ""}
                    placeholder="City"
                    aria-invalid={fieldState.invalid}
                  />
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
                  <Input
                    {...field}
                    id="state"
                    value={field.value ?? ""}
                    placeholder="State"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="country"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="country">Country</FieldLabel>
                  <Input
                    {...field}
                    id="country"
                    placeholder="Country"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {sportId ? (
              <Controller
                name="academy"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="academy">Academy</FieldLabel>
                    <Input
                      {...field}
                      id="academy"
                      value={field.value ?? ""}
                      placeholder="Academy"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            ) : null}
          </FieldGroup>

          <DialogFooter className="md:col-span-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}