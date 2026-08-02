import { Avatar, AvatarFallback } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import { Bell, Menu, MessageSquare } from "lucide-react";
import { useAdminAuthStore } from "../auth/admin-auth.store";

export function AdminNavbar({ onMenuClick }: { onMenuClick: () => void }) {
  const admin = useAdminAuthStore((s) => s.admin);
  const initials = (admin?.username ?? "AD").slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b bg-background/80 px-4 py-3 backdrop-blur md:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex-1">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Admin Portal
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full">
          <MessageSquare className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
        </Button>
        <div className="flex items-center gap-2 pl-2">
          <Avatar className="h-9 w-9 border">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden text-xs md:block">
            <p className="font-semibold leading-tight">{admin?.username ?? "Admin"}</p>
            <p className="text-muted-foreground capitalize">{admin?.role ?? "admin"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
