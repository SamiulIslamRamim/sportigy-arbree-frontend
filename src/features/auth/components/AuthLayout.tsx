import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import spotigy from '/f65d113906e0f6c5861d515830c6c6f3a4622fdf.png';
import { Image } from '@unpic/react';


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
        <div className="flex justify-center">
          <Link to="/" >
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