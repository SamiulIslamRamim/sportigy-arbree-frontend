import { Briefcase, CreditCard, FileBarChart, FileEdit, FolderPlus, LayoutDashboard, Loader2, LogOut, Settings, Shield, Users, Zap } from "lucide-react";
import { useAdminLogout } from "../hooks/useAdminLogout";
import { cn } from "#/lib/utils";
import spotigy from '/f65d113906e0f6c5861d515830c6c6f3a4622fdf.png'
import { Link } from "@tanstack/react-router";
import { Image } from "@unpic/react";

type Item = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
};

const items: Item[] = [
  { title: "Dashboard", icon: LayoutDashboard, active: true },
  { title: "Add Categories", icon: FolderPlus },
  { title: "Hiring Request", icon: Briefcase },
  { title: "Player List", icon: Users },
  { title: "Team List", icon: Shield },
  { title: "Reports", icon: FileBarChart },
  { title: "Subscriptions", icon: CreditCard },
  { title: "Settings", icon: Settings },
  { title: "Manage Content", icon: FileEdit },
];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const logout = useAdminLogout();

  return (
    <aside className="flex h-full w-full flex-col gap-2 bg-card p-4">
      <Link to="/admin/dashboard" className=" flex items-center gap-0.5 px-2" onClick={onNavigate}>
        <Image
        src= {spotigy}
        alt="sportigy"
        layout="constrained"
        height={65}
        width={200}
        />
      </Link>
        <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground text-center"> Admin Portal</div>

      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
              item.active
                ? "bg-navy text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.title}</span>
          </button>
        ))}
      </nav>

      <button
        onClick={() => logout.mutate()}
        disabled={logout.isPending}
        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-60"
      >
        {logout.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="h-4 w-4" />
        )}
        Logout
      </button>
    </aside>
  );
}
