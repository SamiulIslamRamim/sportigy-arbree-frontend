import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { useAuthStore } from '#/features/auth/store/auth.store'
import { useLogout } from '#/hooks/auth.hooks'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Activity, LogOut, Trophy, Users } from 'lucide-react'
import spotigy from '/f65d113906e0f6c5861d515830c6c6f3a4622fdf.png'
import { Image } from '@unpic/react'

export const Route = createFileRoute('/_authenticated/dashboard')({
  head: () => ({ meta: [{ title: 'Dashboard — Spotig' }] }),
  component: Dashboard,
})

function Dashboard() {
  const user = useAuthStore((s) => s.user)
  console.log("username", user?.username);
  const logout = useLogout()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate({ to: '/login' })
  }

  const display = user?.name || user?.username || user?.email || 'Athlete'

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/40 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/dashboard">
            <Image src={spotigy} alt="sportigy" layout="constrained" height={65} width={200}/>
          </Link>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{display}</p>
              <p className="text-xs capitalize text-muted-foreground">
                {user?.role ?? 'member'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10">
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="font-display text-4xl md:text-5xl">
            Hello, <span className="text-primary">{display}</span>
          </h1>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { Icon: Trophy, label: 'Achievements', value: '0' },
            { Icon: Users, label: 'Connections', value: '0' },
            { Icon: Activity, label: 'Activity', value: '0' },
          ].map(({ Icon, label, value }) => (
            <Card key={label} className="border-border/60">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {label}
                </CardTitle>
                <Icon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="font-display text-3xl">{value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 border-border/60">
          <CardHeader>
            <CardTitle>Getting started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>You're signed in to Spotig. This is your personal dashboard.</p>
            <p>
              Backend wired:{' '}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                {import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'}
              </code>
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
