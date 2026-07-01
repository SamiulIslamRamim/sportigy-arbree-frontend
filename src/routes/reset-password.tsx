import { Button } from "#/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "#/components/ui/input-otp";
import { AuthLayout } from "#/features/auth/components/AuthLayout";
import { PasswordInput } from "#/features/auth/components/PasswordInput";
import { resetPasswordSchema } from "#/features/schemas/auth.schema";
import type { ResetPasswordValues } from "#/features/schemas/auth.schema";
import { useResetPassword } from "#/hooks/auth.hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const searchSchema = z.object({ email: z.string().email().optional() });

export const Route = createFileRoute("/reset-password")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Set new password — Spotig" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const { email } = useSearch({ from: "/reset-password" });
  const reset = useResetPassword();

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email, otp: "", password: "", confirmPassword: "" },
  });

  const onSubmit = (values: ResetPasswordValues) => {
    reset.mutate(
      { email: values.email, otp: values.otp, password: values.password },
      {
        onSuccess: () => {
          toast.success("Password updated. Please sign in.");
          navigate({ to: "/login" });
        },
      },
    );
  };

  return (
    <AuthLayout
      title="Set new password"
      subtitle="Enter the code we sent and choose a new password."
      footer={
        <Link to="/login" className="text-primary hover:underline">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
  <FieldGroup className="gap-4">
    <Controller
      name="email"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="reset-email">Email</FieldLabel>
          <Input
            {...field}
            id="reset-email"
            type="email"
            readOnly={!!email}
            aria-invalid={fieldState.invalid}
          />
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />

    <Controller
      name="otp"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="reset-otp">6-digit code</FieldLabel>
          <InputOTP
            maxLength={6}
            value={field.value}
            onChange={field.onChange}
            id="reset-otp"
          >
            <InputOTPGroup>
              {Array.from({ length: 6 }).map((_, i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
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
          <FieldLabel htmlFor="reset-password">New password</FieldLabel>
          <PasswordInput
            {...field}
            id="reset-password"
            aria-invalid={fieldState.invalid}
            autoComplete="new-password"
          />
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />

    <Controller
      name="confirmPassword"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="reset-confirm-password">
            Confirm password
          </FieldLabel>
          <PasswordInput
            {...field}
            id="reset-confirm-password"
            aria-invalid={fieldState.invalid}
            autoComplete="new-password"
          />
          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} />
          )}
        </Field>
      )}
    />
  </FieldGroup>

  <Button type="submit" className="w-full" disabled={reset.isPending}>
    {reset.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
    Update password
  </Button>
</form>
    </AuthLayout>
  );
}