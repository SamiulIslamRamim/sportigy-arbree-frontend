import { useLogout } from "#/hooks/auth.hooks";
import { cn } from "#/lib/utils";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
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
  Zap,
} from "lucide-react";

const items = [
  { title: "Dashboard", url: "/player-dashboard", icon: LayoutDashboard },
  { title: "Career Statistics", url: "/player-dashboard", icon: BarChart3, hash: "career" },
  { title: "Matches", url: "/player-dashboard", icon: Trophy, hash: "matches" },
  { title: "Team History", url: "/player-dashboard", icon: History },
  { title: "Upload", url: "/player-dashboard", icon: Upload },
  { title: "Profile", url: "/player-dashboard", icon: User },
  { title: "Transactions", url: "/player-dashboard", icon: Receipt },
  { title: "Reports", url: "/player-dashboard", icon: FileText },
  { title: "Reviews", url: "/player-dashboard", icon: Star },
  { title: "Settings", url: "/player-dashboard", icon: Settings },
];

export function PlayerSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <aside className="flex h-full w-full flex-col gap-2 bg-card p-4">
      <Link to="/player/dashboard" className="mb-4 flex items-center gap-2 px-2" onClick={onNavigate}>
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
          <Zap className="h-5 w-5" />
        </span>
        <span className="font-display text-2xl tracking-widest">SPORTIGY</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item, i) => {
          const active = i === 0 && pathname === item.url;
          return (
            <Link
              key={`${item.title}-${i}`}
              to={item.url}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
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
