import { useLogout } from "#/hooks/auth.hooks";
import { cn } from "#/lib/utils";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Image } from "@unpic/react";
import spotigy from '/f65d113906e0f6c5861d515830c6c6f3a4622fdf.png'
import {
  LayoutDashboard,
  BarChart3,
  Trophy,
  History,
  Upload,
  User,
  Receipt,
  FileText,
  Star,
  Settings,
  LogOut,
} from "lucide-react";

const items = [
  { title: "Dashboard", url: "/player/dashboard" as const, icon: LayoutDashboard },
  { title: "Career Statistics", url: "/player/career" as const, icon: BarChart3 },
  { title: "Matches", url: "/player/matches" as const, icon: Trophy },
  { title: "Team History", url: "/player/teams" as const, icon: History },
  { title: "Upload", url: "/player/upload" as const, icon: Upload },
  { title: "Profile", url: "/player/profile" as const, icon: User },
  { title: "Transactions", url: "/player/transactions" as const, icon: Receipt },
  { title: "Reports", url: "/player/reports" as const, icon: FileText },
  { title: "Reviews", url: "/player/reviews" as const, icon: Star },
  { title: "Settings", url: "/player/settings" as const, icon: Settings },
];

export function PlayerSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate({ to: "/login" });
  };

  return (
    <aside className="flex h-full w-full flex-col gap-2 bg-card p-4">
      <Link to="/player/dashboard" className="mb-4 flex items-center gap-2 px-2" onClick={onNavigate}>
        <Image
        src= {spotigy}
        alt="sportigy"
        layout="constrained"
        height={65}
        width={200}
        />
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => {
          const active = pathname === item.url;
          return (
            <Link
              key={item.title}
              to={item.url}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-navy text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <LogOut className="h-4 w-4" />
        Log out
      </button>
    </aside>
  );
}
