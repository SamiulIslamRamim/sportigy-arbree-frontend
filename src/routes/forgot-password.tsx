import { forgotPasswordSchema, type ForgotPasswordValues } from "#/features/schemas/auth.schema";
import { useForgotPassword } from "#/hooks/auth.hooks";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot password — Spotig" }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const forgot = useForgotPassword();
  const form = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: ForgotPasswordValues) => {
    forgot.mutate(values, {
      onSuccess: () => {
        toast.success("OTP sent to your email");
        navigate({ to: "/reset-password", search: { email: values.email } });
      },
    });
  };

  return (
    <AuthLayout
      title="Reset password"
      subtitle="Enter your email and we'll send you a 6-digit code."
      footer={
        <>
          Remembered it?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Back to sign in
          </Link>
        </>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@spotig.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={forgot.isPending}>
            {forgot.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send code
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
}
