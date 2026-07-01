import { forgotPasswordSchema } from '#/features/schemas/auth.schema'

import type { ForgotPasswordValues } from '#/features/schemas/auth.schema'
import { useForgotPassword } from '#/hooks/auth.hooks'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Controller, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { AuthLayout } from '#/features/auth/components/AuthLayout'
import { Button } from '#/components/ui/button'
import { Loader2 } from 'lucide-react'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'

export const Route = createFileRoute('/forgot-password')({
  head: () => ({ meta: [{ title: 'Forgot password — Spotig' }] }),
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const navigate = useNavigate()
  const forgot = useForgotPassword()
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = (values: ForgotPasswordValues) => {
    forgot.mutate(values, {
      onSuccess: () => {
        toast.success('OTP sent to your email')
        navigate({ to: '/reset-password', search: { email: values.email } })
      },
    })
  }

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Enter your email and we'll send you a 6-digit code."
      footer={
        <>
          Remembered it?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FieldGroup className="gap-4">
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="forgot-email">Email</FieldLabel>
                <Input
                  {...field}
                  id="forgot-email"
                  type="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="you@spotig.com"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <Button type="submit" className="w-full" disabled={forgot.isPending}>
          {forgot.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Send code
        </Button>
      </form>
    </AuthLayout>
  )
}
