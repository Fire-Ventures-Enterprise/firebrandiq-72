import { SidebarTrigger } from "@/components/ui/sidebar";
import { BrandSelector } from "./BrandSelector";
import { NotificationsPanel } from "@/components/notifications/NotificationsPanel";
import { UserMenu } from "./UserMenu";

export function Header() {
  return (
    <header className="h-16 border-b bg-background flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <BrandSelector />
      </div>
      
      <div className="flex items-center gap-4">
        <NotificationsPanel />
        <UserMenu />
      </div>
    </header>
  );
}