import { 
  BarChart3, 
  Building2, 
  MessageSquare, 
  Instagram, 
  Bot, 
  Target, 
  TrendingUp, 
  Settings,
  FileText,
  Users,
  PenTool,
  Megaphone,
  Calendar,
  Palette,
  ChevronDown
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const navigationSections = [
  {
    title: "Analytics",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
      { title: "Social Media", url: "/social", icon: Instagram },
      { title: "Mentions", url: "/mentions", icon: MessageSquare, badge: "New" },
      { title: "AI Insights", url: "/insights", icon: Bot },
      { title: "Reports", url: "/reports", icon: FileText },
    ]
  },
  {
    title: "Content & Campaigns",
    items: [
      { title: "Content Hub", url: "/content", icon: PenTool, badge: "NEW" },
      { title: "AI Post Generator", url: "/content/generator", icon: Bot },
      { title: "Ad Creator", url: "/campaigns/ads", icon: Megaphone },
      { title: "Campaign Manager", url: "/campaigns", icon: Target },
      { title: "Content Calendar", url: "/content/calendar", icon: Calendar },
      { title: "Brand Assets", url: "/content/assets", icon: Palette },
    ]
  },
  {
    title: "Management",
    items: [
      { title: "Brands", url: "/brands", icon: Building2 },
      { title: "Competitors", url: "/competitors", icon: Users },
      { title: "Settings", url: "/settings", icon: Settings },
    ]
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const [selectedPlatform, setSelectedPlatform] = useState("facebook");

  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + "/");
  const isOnContentGenerator = currentPath === "/content/generator";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-bold text-primary px-4 py-6">
            {!collapsed && "FirebrandIQ"}
          </SidebarGroupLabel>

          {/* Platform Selector for Content Generator */}
          {isOnContentGenerator && !collapsed && (
            <div className="px-4 pb-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Ad Platform
                </label>
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="twitter">Twitter/X</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="google">Google Ads</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          {navigationSections.map((section) => (
            <div key={section.title}>
              {!collapsed && (
                <SidebarGroupLabel className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {section.title}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink 
                          to={item.url} 
                          className={({ isActive: linkIsActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                              isActive(item.url) || linkIsActive
                                ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                                : "hover:bg-sidebar-accent/50"
                            }`
                          }
                        >
                          <item.icon className="h-5 w-5" />
                          {!collapsed && (
                            <div className="flex items-center justify-between flex-1">
                              <span>{item.title}</span>
                              {item.badge && (
                                <Badge variant="secondary" className="text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </div>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </div>
          ))}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}