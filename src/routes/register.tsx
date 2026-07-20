import { Button } from '#/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { RadioGroup, RadioGroupItem } from '#/components/ui/radio-group'
import { AuthLayout } from '#/features/auth/components/AuthLayout'
import { PasswordInput } from '#/features/auth/components/PasswordInput'
import type { UserRole } from '#/features/auth/types/auth.types'

import {
  playerSection1,
  playerSection2,
  orgSection1,
  orgSection2,
  orgSection3,
  playerSection3,
} from '#/features/auth/schemas/auth.schema'
import { useRegisterOrganization, useRegisterPlayer } from '#/hooks/auth.hooks'
import { cn } from '#/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, ArrowRight, Building2, Loader2, Trophy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'
import type z from 'zod'
import { useCategories, useOrgCategories } from '#/hooks/categories.hooks'
import { MultiSelect } from '#/components/multi-select'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import {
  COUNTRY_LIST,
  getCountryCode,
  getDynamicPrefix,
  validatePhoneNumber,
} from '#/features/player/utils/country'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

export const Route = createFileRoute('/register')({
  head: () => ({ meta: [{ title: 'Create account — Spotig' }] }),
  component: RegisterPage,
})

function Stepper({ step, total }: { step: number; total: number }) {
  return (
    <div className="mb-6 flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-1.5 flex-1 rounded-full transition-colors',
            i <= step ? 'bg-primary' : 'bg-muted',
          )}
        />
      ))}
    </div>
  )
}

type PlayerS1 = z.infer<typeof playerSection1>
type PlayerS2 = z.infer<typeof playerSection2>
type PlayerS3 = z.infer<typeof playerSection3>
type OrgS1 = z.infer<typeof orgSection1>
type OrgS2 = z.infer<typeof orgSection2>
type OrgS3 = z.infer<typeof orgSection3>

function RegisterPage() {
  const [role, setRole] = useState<UserRole>('player')
  return (
    <AuthLayout
      title="Create account"
      subtitle="Join the platform. Pick how you want to play."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <RadioGroup
        value={role}
        onValueChange={(v) => setRole(v as UserRole)}
        className="mb-6 grid grid-cols-2 gap-3"
      >
        {[
          { v: 'player', label: 'Player', Icon: Trophy },
          { v: 'organization', label: 'Organization', Icon: Building2 },
        ].map(({ v, label, Icon }) => (
          <Label
            key={v}
            htmlFor={`role-${v}`}
            className={cn(
              'flex cursor-pointer items-center gap-3 rounded-xl border bg-card/40 p-4 transition-colors',
              role === v
                ? 'border-primary bg-primary/10 text-foreground'
                : 'hover:border-primary/40',
            )}
          >
            <RadioGroupItem id={`role-${v}`} value={v} className="sr-only" />
            <Icon className="h-5 w-5 text-primary" />
            <span className="font-medium">{label}</span>
          </Label>
        ))}
      </RadioGroup>
      {role === 'player' ? <PlayerFlow /> : <OrgFlow />}
    </AuthLayout>
  )
}

/* ============= Player ============= */
function PlayerFlow() {
  const navigate = useNavigate()
  const register = useRegisterPlayer()
  const [step, setStep] = useState(0)
  const [s1, setS1] = useState<PlayerS1 | null>(null)
  const [s2, setS2] = useState<PlayerS2 | null>(null)

  return (
    <>
      <Stepper step={step} total={3} />
      {step === 0 && (
        <PlayerStep1
          defaults={s1}
          onNext={(v) => {
            setS1(v)
            setStep(1)
          }}
        />
      )}
      {step === 1 && (
        <PlayerStep2
          defaults={s2}
          onBack={() => setStep(0)}
          onNext={(v) => {
            setS2(v)
            setStep(2)
          }}
        />
      )}
      {step === 2 && s1 && s2 && (
        <PlayerStep3
          isPending={register.isPending}
          onBack={() => setStep(1)}
          onSubmit={(v) => {
            register.mutate(
              { ...s1, ...s2, password: v.password },
              {
                onSuccess: () => {
                  toast.success(
                    'Account created. Check your email for the code.',
                  )
                  navigate({ to: '/verify-otp', search: { email: s1.email } })
                },
              },
            )
          }}
        />
      )}
    </>
  )
}

function PlayerStep1({
  defaults,
  onNext,
}: {
  defaults: PlayerS1 | null
  onNext: (v: PlayerS1) => void
}) {
  const form = useForm<PlayerS1>({
    resolver: zodResolver(playerSection1),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: defaults ?? {
      name: '',
      email: '',
      birthday: '',
      username: '',
      contactNo: '',
      country: '',
    },
  })

  const country = form.watch('country')

  useEffect(() => {
    if (!country) return
    const code = getCountryCode(country)
    const prefix = getDynamicPrefix(code)
    if (!prefix) return

    const current = form.getValues('contactNo') || ''
    const national = current.replace(/^\+\d+/, '') // strip any previous prefix, keep digits typed
    const alreadyInteracted =
      form.formState.touchedFields.contactNo || form.formState.isSubmitted

    form.setValue('contactNo', `${prefix}${national}`, {
      shouldValidate: alreadyInteracted,
      shouldTouch: false,
      shouldDirty: false,
    })
  }, [country])

  return (
    <form onSubmit={form.handleSubmit(onNext)} className="space-y-4">
      <FieldGroup className="gap-4">
        <TextField
          form={form}
          name="name"
          label="Full name"
          placeholder="Jordan Ali"
        />
        <TextField form={form} name="email" label="Email" type="email" />
        <TextField
          form={form}
          name="birthday"
          label="Date of birth"
          type="date"
        />

        <TextField
          form={form}
          name="username"
          label="Username"
          placeholder="jordan_a"
        />
        {/* <TextField form={form} name="country" label="Country Name" placeholder="Africa" /> */}

        <Controller
          name="country"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Country Name</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_LIST.map((country) => (
                    <SelectItem key={country.label} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="contactNo"
          control={form.control}
          render={({ field, fieldState }) => {
            const code = getCountryCode(country)
            const prefix = getDynamicPrefix(code) || '+'
            const national = field.value.startsWith(prefix)
              ? field.value.slice(prefix.length)
              : field.value

            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Phone</FieldLabel>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 rounded-md border bg-muted text-muted-foreground select-none">
                    {prefix}
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    className="flex-1 rounded-md border px-3 py-2"
                    placeholder="1812345678"
                    value={national}
                    aria-invalid={fieldState.invalid}
                    onChange={(e) => {
                      // keep only digits for the national part
                      const digits = e.target.value.replace(/\D/g, '')
                      field.onChange(digits ? `${prefix}${digits}` : '')
                    }}
                    onBlur={field.onBlur}
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )
          }}
        />
      </FieldGroup>
      <NextButton />
    </form>
  )
}

function PlayerStep2({
  defaults,
  onBack,
  onNext,
}: {
  defaults: PlayerS2 | null
  onBack: () => void
  onNext: (v: PlayerS2) => void
}) {
  const form = useForm<PlayerS2>({
    resolver: zodResolver(playerSection2),
    defaultValues: defaults ?? {
      height: '',
      weight: '',
      categories: [],
      websiteUrl: '',
    },
  })
  const { data: categoryOptions = [], isLoading } = useCategories()
  return (
    <form onSubmit={form.handleSubmit(onNext)} className="flex flex-col gap-6">
      <FieldGroup className="gap-4">
        <div className="grid grid-cols-2 gap-3">
          <TextField
            form={form}
            name="height"
            label="Height"
            placeholder="180cm"
          />
          <TextField
            form={form}
            name="weight"
            label="Weight"
            placeholder="75kg"
          />
        </div>

        <Controller
          name="categories"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="field-categories">
                Sports category
              </FieldLabel>
              <MultiSelect
                id="field-categories"
                options={categoryOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder={isLoading ? 'Loading...' : 'Choose your sport(s)'}
                disabled={isLoading}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <TextField
          form={form}
          name="websiteUrl"
          label="Portfolio link"
          placeholder="https://"
          description="Optional"
        />
      </FieldGroup>

      <BackNextButtons onBack={onBack} />
    </form>
  )
}

function PlayerStep3({
  isPending,
  onBack,
  onSubmit,
}: {
  isPending: boolean
  onBack: () => void
  onSubmit: (v: PlayerS3) => void
}) {
  const form = useForm<PlayerS3>({
    resolver: zodResolver(playerSection3),
    defaultValues: { password: '', confirmPassword: '' },
  })
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <PasswordField form={form} name="password" label="Password" />
      <PasswordField
        form={form}
        name="confirmPassword"
        label="Confirm password"
      />
      <BackSubmit onBack={onBack} isPending={isPending} />
    </form>
  )
}

/* ============= Organization ============= */
function OrgFlow() {
  const navigate = useNavigate()
  const register = useRegisterOrganization()
  const [step, setStep] = useState(0)
  const [s1, setS1] = useState<OrgS1 | null>(null)
  const [s2, setS2] = useState<OrgS2 | null>(null)

  return (
    <>
      <Stepper step={step} total={3} />
      {step === 0 && (
        <OrgStep1
          defaults={s1}
          onNext={(v) => {
            setS1(v)
            setStep(1)
          }}
        />
      )}
      {step === 1 && (
        <OrgStep2
          defaults={s2}
          onBack={() => setStep(0)}
          onNext={(v) => {
            setS2(v)
            setStep(2)
          }}
        />
      )}
      {step === 2 && s1 && s2 && (
        <OrgStep3
          isPending={register.isPending}
          onBack={() => setStep(1)}
          onSubmit={(v) => {
            register.mutate(
              { ...s1, ...s2, password: v.password },
              {
                onSuccess: () => {
                  toast.success(
                    'Account created. Check your email for the code.',
                  )
                  navigate({ to: '/verify-otp', search: { email: s1.email } })
                },
              },
            )
          }}
        />
      )}
    </>
  )
}

function OrgStep1({
  defaults,
  onNext,
}: {
  defaults: OrgS1 | null
  onNext: (v: OrgS1) => void
}) {
  const form = useForm<OrgS1>({
    resolver: zodResolver(orgSection1),
    defaultValues: defaults ?? {
      name: '',
      email: '',
      username: '',
      categories: [],
      websiteUrl: '',
    },
  })
  const { data: categoryOptions = [], isLoading } = useOrgCategories()
  return (
    <form onSubmit={form.handleSubmit(onNext)} className="flex flex-col gap-6">
      <FieldGroup className="gap-4">
        <TextField form={form} name="name" label="Organization name" />
        <TextField form={form} name="email" label="Email" type="email" />
        <TextField form={form} name="username" label="Username" />

        <Controller
          name="categories"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="field-categories">
                Organization type
              </FieldLabel>
              <MultiSelect
                id="field-categories"
                options={categoryOptions}
                value={field.value}
                onChange={field.onChange}
                placeholder={isLoading ? 'Loading...' : 'Select type(s)'}
                disabled={isLoading}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <TextField
          form={form}
          name="websiteUrl"
          label="Portfolio link"
          description="Optional"
        />
      </FieldGroup>

      <NextButton />
    </form>
  )
}

function OrgStep2({
  defaults,
  onBack,
  onNext,
}: {
  defaults: OrgS2 | null
  onBack: () => void
  onNext: (v: OrgS2) => void
}) {
  const form = useForm<OrgS2>({
    resolver: zodResolver(orgSection2),

    defaultValues: defaults ?? {
      city: '',
      state: '',
      country: '',
      contactNo: '',
    },
  })
  const country = form.watch('country')

  useEffect(() => {
    if (!country) return
    const code = getCountryCode(country)
    const prefix = getDynamicPrefix(code)
    if (!prefix) return

    const current = form.getValues('contactNo') || ''
    const national = current.replace(/^\+\d+/, '') // strip any previous prefix, keep digits typed
    const alreadyInteracted =
      form.formState.touchedFields.contactNo || form.formState.isSubmitted

    form.setValue('contactNo', `${prefix}${national}`, {
      shouldValidate: alreadyInteracted,
      shouldTouch: false,
      shouldDirty: false,
    })
  }, [country]) 
  return (
    <form onSubmit={form.handleSubmit(onNext)} className="space-y-4">
      <TextField form={form} name="city" label="City" />
      <TextField form={form} name="state" label="State" />
      <Controller
          name="country"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Country Name</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger aria-invalid={fieldState.invalid}>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_LIST.map((country) => (
                    <SelectItem key={country.label} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="contactNo"
          control={form.control}
          render={({ field, fieldState }) => {
            const code = getCountryCode(country)
            const prefix = getDynamicPrefix(code) || '+'
            const national = field.value.startsWith(prefix)
              ? field.value.slice(prefix.length)
              : field.value

            return (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Phone</FieldLabel>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 rounded-md border bg-muted text-muted-foreground select-none">
                    {prefix}
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    className="flex-1 rounded-md border px-3 py-2"
                    placeholder="1812345678"
                    value={national}
                    aria-invalid={fieldState.invalid}
                    onChange={(e) => {
                      // keep only digits for the national part
                      const digits = e.target.value.replace(/\D/g, '')
                      field.onChange(digits ? `${prefix}${digits}` : '')
                    }}
                    onBlur={field.onBlur}
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )
          }}
        />

      <BackNextButtons onBack={onBack} />
    </form>
  )
}

function OrgStep3({
  isPending,
  onBack,
  onSubmit,
}: {
  isPending: boolean
  onBack: () => void
  onSubmit: (v: OrgS3) => void
}) {
  const form = useForm<OrgS3>({
    resolver: zodResolver(orgSection3),
    defaultValues: { password: '', confirmPassword: '' },
  })
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <PasswordField form={form} name="password" label="Password" />
      <PasswordField
        form={form}
        name="confirmPassword"
        label="Confirm password"
      />
      <BackSubmit onBack={onBack} isPending={isPending} />
    </form>
  )
}

/* ============= Reusable fields ============= */
function TextField<T extends FieldValues>({
  form,
  name,
  label,
  type = 'text',
  placeholder,
  description,
}: {
  form: UseFormReturn<T>
  name: Path<T>
  label: string
  type?: string
  placeholder?: string
  description?: string
}) {
  const id = `field-${name}`

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <Input
            {...field}
            id={id}
            type={type}
            value={field.value ?? ''}
            aria-invalid={fieldState.invalid}
            placeholder={placeholder}
          />
          {description && !fieldState.invalid && (
            <FieldDescription>{description}</FieldDescription>
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

function PasswordField<T extends FieldValues>({
  form,
  name,
  label,
}: {
  form: UseFormReturn<T>
  name: Path<T>
  label: string
}) {
  const id = `field-${name}`

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <PasswordInput
            {...field}
            id={id}
            value={field.value ?? ''}
            aria-invalid={fieldState.invalid}
            autoComplete="new-password"
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}

function NextButton() {
  return (
    <Button type="submit" className="w-full gap-2">
      Continue <ArrowRight className="h-4 w-4" />
    </Button>
  )
}

function BackNextButtons({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>
      <Button type="submit" className="flex-1 gap-2">
        Continue <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

function BackSubmit({
  onBack,
  isPending,
}: {
  onBack: () => void
  isPending: boolean
}) {
  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>
      <Button type="submit" className="flex-1" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create account
      </Button>
    </div>
  )
}
