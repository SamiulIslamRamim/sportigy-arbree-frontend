import { Button } from '#/components/ui/button'
import { useAuthStore } from '#/features/auth/store/auth.store';
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { ArrowRight, Trophy, Users, Zap } from 'lucide-react';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: "Spotig — Where Athletes Get Spotted" },
      {
        name: "description",
        content:
          "Join Spotig. The platform connecting players and organizations across every sport.",
      },
    ],
  }),
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: Landing,
})

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        aria-hidden
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, color-mix(in oklab, var(--primary) 30%, transparent), transparent 45%), radial-gradient(circle at 85% 80%, color-mix(in oklab, var(--accent) 20%, transparent), transparent 50%)",
        }}
      />
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <Link to="/" className="inline-flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground shadow-[var(--shadow-glow)]">
            <Zap className="h-4 w-4" />
          </span>
          <span className="font-display text-2xl tracking-wider">SPOTIG</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link to="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Get started</Link>
          </Button>
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-6 pt-12 pb-24 md:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Now in beta
          </span>
          <h1 className="mt-6 font-display text-5xl md:text-7xl text-balance">
            Where athletes <span className="text-primary">get spotted</span>.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground text-balance">
            The platform built for players and organizations. Showcase your
            talent. Discover the next generation.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link to="/register">
                Create account <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/login">I already have an account</Link>
            </Button>
          </div>
        </div>

        <div className="mt-24 grid gap-6 md:grid-cols-3">
          {[
            { icon: Trophy, title: "For Players", body: "Build your profile, share your highlights, get discovered." },
            { icon: Users, title: "For Organizations", body: "Scout talent, manage trials, recruit the next stars." },
            { icon: Zap, title: "Built for Speed", body: "Modern, fast, mobile-first. Designed for athletes." },
          ].map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl border bg-card/60 p-6 backdrop-blur-sm transition-colors hover:border-primary/50"
            >
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
