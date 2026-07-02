import { Avatar, AvatarFallback, AvatarImage } from "#/components/ui/avatar";
import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { useAuthStore } from "#/features/auth/store/auth.store";
import { Bell, Menu, MessageSquare, Search } from "lucide-react";

export function TopNavbar({ onMenuClick }: { onMenuClick: () => void }) {
  const user = useAuthStore((s) => s.user);
  const initials = (user?.name || user?.username || "SP").slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between lg:justify-end gap-3 border-b bg-background/80 px-4 py-3 backdrop-blur md:px-6">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
        <Menu className="h-5 w-5" />
      </Button>
      <div className="relative flex-1 max-w-3xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search players, matches, teams..." className="h-10 rounded-full bg-muted/60 pl-10 border-transparent focus-visible:bg-background" />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full">
          <MessageSquare className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
        </Button>
        {/* <Avatar className="h-9 w-9 border">
          <AvatarImage src={user?.name ? undefined : undefined} alt={user?.name ?? "User"} />
          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">{initials}</AvatarFallback>
        </Avatar> */}
      </div>
    </header>
  );
}
