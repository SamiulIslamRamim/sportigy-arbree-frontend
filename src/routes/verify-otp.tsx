import { Button } from "#/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "#/components/ui/input-otp";
import { AuthLayout } from "#/features/auth/components/AuthLayout";
import { otpSchema } from "#/features/schemas/auth.schema";
import type { OtpValues } from "#/features/schemas/auth.schema";
import { useVerifyOtp } from "#/hooks/auth.hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const searchSchema = z.object({ email: z.string().email().optional() });

export const Route = createFileRoute("/verify-otp")({
  validateSearch: searchSchema,
  head: () => ({ meta: [{ title: "Verify email — Spotig" }] }),
  component: VerifyOtpPage,
});

function VerifyOtpPage() {
  const navigate = useNavigate();
  const { email } = useSearch({ from: "/verify-otp" });
  const verify = useVerifyOtp();

  const form = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { email, otp: "" },
  });

  const onSubmit = (values: OtpValues) => {
    verify.mutate(values, {
      onSuccess: () => {
        toast.success("Account verified. Welcome to Spotig.");
        navigate({ to: "/login" });
      },
    });
  };

  return (
    <AuthLayout
      title="Verify email"
      subtitle="Enter the 6-digit code we sent to your inbox."
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
          <FieldLabel htmlFor="verify-email">Email</FieldLabel>
          <Input
            {...field}
            id="verify-email"
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
          <FieldLabel htmlFor="verify-otp">One-time code</FieldLabel>
          <InputOTP
            maxLength={6}
            value={field.value}
            onChange={field.onChange}
            id="verify-otp"
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
  </FieldGroup>

  <Button type="submit" className="w-full" disabled={verify.isPending}>
    {verify.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
    Verify
  </Button>
</form>
    </AuthLayout>
  );
}