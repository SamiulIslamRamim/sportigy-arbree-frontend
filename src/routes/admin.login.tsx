import { Button } from '#/components/ui/button'
import { Checkbox } from '#/components/ui/checkbox'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { useAdminAuthStore } from '#/features/admin/auth/admin-auth.store'
import { useAdminLogin } from '#/features/admin/hooks/useAdminLogin'
import { adminLoginSchema } from '#/features/admin/schemas/admin-login.schema'
import type { AdminLoginValues } from '#/features/admin/schemas/admin-login.schema'
import { PasswordInput } from '#/features/auth/components/PasswordInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Image } from '@unpic/react'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import spotigy from '/f65d113906e0f6c5861d515830c6c6f3a4622fdf.png'

export const Route = createFileRoute('/admin/login')({
  ssr: false,
  head: () => ({
    meta: [
      { title: 'Admin Sign in — Spotig' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: AdminLoginPage,
})

function AdminLoginPage() {
  const navigate = useNavigate()
  const login = useAdminLogin()
  const isAuthenticated = useAdminAuthStore((s) => s.isAuthenticated)

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/admin/dashboard', replace: true })
    }
  }, [isAuthenticated, navigate])

  const form = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { username: '', password: '', remember: false },
  })

  const onSubmit = (values: AdminLoginValues) => {
    login.mutate(
      { username: values.username, password: values.password },
      { onSuccess: () => navigate({ to: '/admin/dashboard', replace: true }) },
    )
  }

  return (
    <>
      <div className="relative flex flex-col min-h-screen items-center  overflow-hidden bg-white p-8 text-gray-900">
        <div className="flex justify-center">
          <Link to="/">
            <Image
              src={spotigy}
              alt="sportigy"
              layout="constrained"
              height={65}
              width={200}
            />
          </Link>
        </div>

        <div className="my-auto flex w-full justify-center py-12">
          <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              'radial-gradient(circle at 15% 20%, rgba(239,68,68,0.15), transparent 50%), radial-gradient(circle at 85% 80%, rgba(220,38,38,0.10), transparent 55%)',
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-100"
          style={{
            backgroundImage:
              'linear-gradient(rgba(220,38,38,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.06) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative w-full max-w-md">
          <div className="mb-6 flex flex-col items-center gap-3 text-center">
            <div>
              <h1 className="font-display text-4xl md:text-5xl">
                Admin Portal
              </h1>
              <p className="mt-3 text-sm text-muted-foreground text-balance">
                Sign in to manage the platform
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-xl md:p-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FieldGroup className="gap-5">
                <Controller
                  name="username"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="username" className="text-gray-700">
                        Username
                      </FieldLabel>

                      <Input
                        {...field}
                        id="username"
                        placeholder="admin"
                        autoComplete="username"
                        aria-invalid={fieldState.invalid}
                        className="border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus-visible:ring-red-500/40"
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="password" className="text-gray-700">
                        Password
                      </FieldLabel>

                      <PasswordInput
                        {...field}
                        id="password"
                        autoComplete="current-password"
                        aria-invalid={fieldState.invalid}
                        className="border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus-visible:ring-red-500/40"
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="remember"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      orientation="horizontal"
                      className="items-center gap-2"
                      data-invalid={fieldState.invalid}
                    >
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-gray-300 data-[state=checked]:border-red-500 data-[state=checked]:bg-red-500"
                      />

                      <FieldLabel className="font-normal text-gray-500">
                        Remember me on this device
                      </FieldLabel>

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <Button
                type="submit"
                disabled={login.isPending}
                className="w-full"
              >
                {login.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Sign in to Admin
              </Button>
            </form>
          </div>

          <p className="mt-3 text-sm text-muted-foreground text-balance text-center">
            Restricted area. Unauthorized access is prohibited.
          </p>
        </div>
        </div>
      </div>
    </>
  )
}
