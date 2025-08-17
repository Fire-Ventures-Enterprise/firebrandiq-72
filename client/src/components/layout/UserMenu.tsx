import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  User, 
  Settings, 
  CreditCard, 
  LogOut, 
  HelpCircle,
  Moon,
  Sun,
  Monitor
} from "lucide-react";

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  company: string;
  plan: string;
}

const mockUser: UserProfile = {
  name: "John Doe",
  email: "john@example.com",
  company: "TechStartup Inc",
  plan: "Pro"
};

export function UserMenu() {
  const [user] = useState<UserProfile>(mockUser);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleProfileClick = () => {
    navigate('/settings');
    toast({
      title: "Opening Profile Settings",
      description: "Redirecting to your profile page...",
    });
  };

  const handleBillingClick = () => {
    navigate('/settings');
    toast({
      title: "Opening Billing",
      description: "Redirecting to billing management...",
    });
  };

  const handleHelpClick = () => {
    toast({
      title: "Help Center",
      description: "Opening help documentation...",
    });
    // Could open help modal or external link
    window.open('https://docs.lovable.dev/', '_blank');
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    toast({
      title: "Theme Changed",
      description: `Switched to ${newTheme} theme`,
    });
    // Here you would implement actual theme switching logic
  };

  const handleLogout = () => {
    toast({
      title: "Logging Out",
      description: "You have been successfully logged out",
    });
    // Implement logout logic here
    navigate('/');
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.company} • {user.plan} Plan</p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleProfileClick} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          <span>Profile Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={handleBillingClick} className="cursor-pointer">
          <CreditCard className="mr-2 h-4 w-4" />
          <span>Billing & Usage</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={() => handleThemeChange("light")} className="cursor-pointer">
          <Sun className="mr-2 h-4 w-4" />
          <span>Light Theme</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleThemeChange("dark")} className="cursor-pointer">
          <Moon className="mr-2 h-4 w-4" />
          <span>Dark Theme</span>
        </DropdownMenuItem>
        
        <DropdownMenuItem onClick={() => handleThemeChange("system")} className="cursor-pointer">
          <Monitor className="mr-2 h-4 w-4" />
          <span>System Theme</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleHelpClick} className="cursor-pointer">
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help & Support</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}