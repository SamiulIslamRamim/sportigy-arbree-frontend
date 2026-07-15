import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Controller, useForm } from 'react-hook-form'
import {
  BATTING_STYLE_LABELS,
  BATTING_STYLES,
  BOWLING_STYLE_LABELS,
  BOWLING_STYLES,
  CRICKET_PLAYING_ROLES,
  PLAYING_ROLE_LABELS,
} from '../types/player.types'
import type { PlayerInformation } from '../types/player.types'
import { Button } from '#/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { toDateInputValue } from '../utils/date'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'
import { useUpdatePlayerInformation } from '../hooks/useUpdatePlayerInformation'
import { updatePlayerInformationSchema } from '../schemas/player.schema'
import type { UpdatePlayerInformationFormValues } from '../schemas/player.schema'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  player: PlayerInformation
}

const defaultsFrom = (
  p: PlayerInformation,
): UpdatePlayerInformationFormValues => ({
  name: p.name ?? '',
  academy: p.academy ?? '',
  weight: p.weight ?? '',
  height: p.height ?? '',
  playingRole: p.playingRole ?? 'BATSMAN',
  battingStyle: p.battingStyle ?? 'RIGHT_HAND_BAT',
  bowlingStyle: p.bowlingStyle ?? 'NONE',
  birthday: toDateInputValue(p.birthday),
  city: p.city ?? '',
  state: p.state ?? '',
  country: p.country ?? '',
})

export function PlayerProfileEditDialog({ open, onOpenChange, player }: Props) {
  const mutation = useUpdatePlayerInformation()

  const form = useForm<UpdatePlayerInformationFormValues>({
    resolver: zodResolver(updatePlayerInformationSchema),
    defaultValues: defaultsFrom(player),
  })

  useEffect(() => {
    if (open) form.reset(defaultsFrom(player))
  }, [open, player, form])

  const onSubmit = form.handleSubmit((values) => {
    mutation.mutate(values, {
      onSuccess: () => onOpenChange(false),
    })
  })

  const submitting = mutation.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit player information</DialogTitle>
          <DialogDescription>
            Update your profile details. All fields are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
          <FieldGroup className="contents">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  className="md:col-span-2"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    placeholder="Full name"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="academy"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="academy">Academy</FieldLabel>
                  <Input
                    {...field}
                    id="academy"
                    placeholder="Academy"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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
                    placeholder="73"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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
                    placeholder="178"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="playingRole"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Playing Role</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {CRICKET_PLAYING_ROLES.map((role) => (
                        <SelectItem key={role} value={role}>
                          {PLAYING_ROLE_LABELS[role]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="battingStyle"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Batting Style</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select batting style" />
                    </SelectTrigger>
                    <SelectContent>
                      {BATTING_STYLES.map((style) => (
                        <SelectItem key={style} value={style}>
                          {BATTING_STYLE_LABELS[style]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="bowlingStyle"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Bowling Style</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select bowling style" />
                    </SelectTrigger>
                    <SelectContent>
                      {BOWLING_STYLES.map((style) => (
                        <SelectItem key={style} value={style}>
                          {BOWLING_STYLE_LABELS[style]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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
                    placeholder="City"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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
                    placeholder="State"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="country"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  className="md:col-span-2"
                  data-invalid={fieldState.invalid}
                >
                  <FieldLabel htmlFor="country">Country</FieldLabel>
                  <Input
                    {...field}
                    id="country"
                    placeholder="Country"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
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
                'Save changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
