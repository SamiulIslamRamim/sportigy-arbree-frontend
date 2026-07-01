import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: Props) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, color-mix(in oklab, var(--primary) 25%, transparent), transparent 50%), radial-gradient(circle at 80% 90%, color-mix(in oklab, var(--accent) 18%, transparent), transparent 55%)",
        }}
      />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-8">
        <Link to="/" className="inline-flex items-center gap-2 group w-fit">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
            <Zap className="h-4 w-4" />
          </span>
          <span className="font-display text-2xl tracking-wider">SPOTIG</span>
        </Link>

        <div className="my-auto flex w-full justify-center py-12">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <h1 className="font-display text-4xl md:text-5xl">{title}</h1>
              {subtitle && (
                <p className="mt-3 text-sm text-muted-foreground text-balance">
                  {subtitle}
                </p>
              )}
            </div>
            <div className="rounded-2xl border bg-card/60 p-6 backdrop-blur-sm shadow-[var(--shadow-elegant)]">
              {children}
            </div>
            {footer && (
              <div className="mt-6 text-center text-sm text-muted-foreground">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}