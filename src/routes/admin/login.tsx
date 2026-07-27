import { Button } from "#/components/ui/button";
import { Field, FieldError, FieldGroup, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import { AuthLayout } from "#/features/auth/components/AuthLayout";
import { PasswordInput } from "#/features/auth/components/PasswordInput";
import { useAuthStore } from "#/features/auth/store/auth.store";
import { useAdminLogin } from "#/features/auth/hooks/admin-auth.hooks";
// import { adminLoginSchema, type AdminLoginValues } from "#/schema/admin.schema";
import { adminLoginSchema } from "#/schema/admin.schema";
import type { AdminLoginValues } from "#/schema/admin.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";





export const Route = createFileRoute("/admin/login")({
  beforeLoad: () => {
    const { isAuthenticated, user } = useAuthStore.getState();
    if (isAuthenticated && user?.role === "admin") {
      throw redirect({ to: "/admin/dashboard" });
    }
  },
  head: () => ({
    meta: [
      { title: "Admin sign in — Spotig" },
      {
        name: "description",
        content: "Secure administrator sign in for the Spotig platform.",
      },
      { property: "og:title", content: "Admin sign in — Spotig" },
      {
        property: "og:description",
        content: "Secure administrator sign in for the Spotig platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const login = useAdminLogin();
  const logout = useAuthStore((s) => s.logout);

  const form = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = (values: AdminLoginValues) => {
    login.mutate(values, {
      onSuccess: (data) => {
        if (data.admin?.role === "admin") {
          navigate({ to: "/admin/dashboard" });
          return;
        }
        logout();
        toast.error("Admin access required.");
      },
    });
  };

  return (
    <AuthLayout
      title="Admin sign in"
      subtitle="Restricted area. Administrator credentials required."
    >
    <form
  onSubmit={form.handleSubmit(onSubmit)}
  className="flex flex-col gap-6"
>
  <FieldGroup className="gap-4">
    <Controller
      name="username"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor="admin-username">
            Username
          </FieldLabel>
          <Input
            {...field}
            id="admin-username"
            aria-invalid={fieldState.invalid}
            placeholder="admin"
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
          <FieldLabel htmlFor="admin-password">
            Password
          </FieldLabel>
          <PasswordInput
            {...field}
            id="admin-password"
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

  <Button
    type="submit"
    className="w-full"
    disabled={login.isPending}
  >
    {login.isPending && (
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
    )}
    Sign in
  </Button>
</form>
    </AuthLayout>
  );
}