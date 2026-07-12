import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Card } from '#/components/ui/card'
import { Pencil } from 'lucide-react'
import type { PlayerProfile } from '../types'

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-0">
    <p className="text-xs uppercase tracking-wider text-muted-foreground">
      {label}
    </p>
    <p className="mt-1 truncate text-sm font-semibold text-foreground">
      {value}
    </p>
  </div>
)
const avatarUrl = 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=400&q=80';

export function PlayerProfileCard({ profile }: { profile: PlayerProfile }) {
  return (
    <Card className="overflow-hidden border-border/60 p-4 md:p-6">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-4 md:gap-6">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-muted md:h-28 md:w-28">
          //fix: dummy data
          <img
            src={avatarUrl}
            alt={profile.fullName}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate font-display text-2xl md:text-3xl">
              {profile.fullName}
            </h2>
            <img
              src={profile.countryFlagUrl}
              alt={profile.countryName}
              className="h-5 w-7 rounded-sm object-cover"
            />
            <Badge variant="secondary" className="rounded-md">
              {profile.teamName}
            </Badge>
          </div>
          //fix: dummy data
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-primary">
              {profile.playingRole}
            </span>
            <span>· {profile.battingStyle}</span>
            <span>· {profile.bowlingStyle}</span>
          </div>
        </div>

        <Button variant="outline" size="icon" className="rounded-full shrink-0">
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
      //fix: dummy data
      <div className="mt-6 grid grid-cols-2 gap-4 border-t pt-4 sm:grid-cols-3 md:grid-cols-5">
        <Stat label="Weight" value={`${profile.weightKg} KG`} />
        <Stat label="Height" value={`${profile.heightCm} CM`} />
        <Stat label="Academy" value={profile.academy} />
        <Stat
          label="Age"
          value={`${profile.age} (${new Date(profile.birthDate).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })})`}
        />
        <Stat label="Address" value={profile.address} />
      </div>
    </Card>
  )
}
