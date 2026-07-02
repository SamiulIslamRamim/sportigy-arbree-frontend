import { Button } from "#/components/ui/button";
import { Checkbox } from "#/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { AuthLayout } from "#/features/auth/components/AuthLayout";
import { PasswordInput } from "#/features/auth/components/PasswordInput";
import { useAuthStore } from "#/features/auth/store/auth.store";
import { loginSchema } from "#/features/auth/schemas/auth.schema";
import type { LoginValues } from "#/features/auth/schemas/auth.schema";
import { useLogin } from "#/hooks/auth.hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, redirect, useNavigate, useSearch } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import z from "zod";

const searchSchema = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/login")({
  validateSearch: searchSchema,
  beforeLoad: ({ search }) => {
    const {isAuthenticated, user} = useAuthStore.getState();
    if(isAuthenticated){
      throw redirect({
        to: search.redirect ?? (user?.role === "player" ? "/player/dashboard" : "/dashboard")
      })
    }
  },
  head: () => ({ meta: [{ title: "Sign in — Spotig" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { redirect: redirectTo } = useSearch({ from: "/login" });
  const login = useLogin();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "", remember: false },
  });


  const onSubmit = (values: LoginValues) => {
    login.mutate(
      { identifier: values.identifier, password: values.password },
      { onSuccess: (data) => navigate({ to: redirectTo ?? (data.user?.role === "player"
              ? "/player/dashboard"
              : "/dashboard"), }) },
    );
  };

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Welcome back. Let's get you on the pitch."
      footer={
        <>
          New to Sportigy ?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Create an account
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
      name="identifier"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="login-identifier">
            Email or username
          </FieldLabel>
          <Input
            {...field}
            id="login-identifier"
            aria-invalid={fieldState.invalid}
            placeholder="you@spotig.com"
            autoComplete="username"
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
          <FieldLabel htmlFor="login-password">Password</FieldLabel>
          <PasswordInput
            {...field}
            id="login-password"
            aria-invalid={fieldState.invalid}
            autoComplete="current-password"
          />
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  </FieldGroup>

  <div className="flex items-center justify-between text-sm">
    <Controller
      name="remember"
      control={form.control}
      render={({ field }) => (
        <Field
          orientation="horizontal"
          className="flex items-center gap-2 space-y-0"
        >
          <Checkbox
            id="login-remember"
            checked={field.value}
            onCheckedChange={field.onChange}
          />
          <FieldLabel
            htmlFor="login-remember"
            className="font-normal text-muted-foreground"
          >
            Remember me
          </FieldLabel>
        </Field>
      )}
    />
    <Link to="/forgot-password" className="text-primary hover:underline">
      Forgot password?
    </Link>
  </div>

  <Button type="submit" className="w-full" disabled={login.isPending}>
    {login.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
    Sign in
  </Button>
</form>
    </AuthLayout>
  );
}