import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Bell, Key, User, CreditCard, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    company: "TechStartup Inc"
  });
  
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    brandMentions: true,
    weeklyReports: false,
    aiRecommendations: true
  });

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleToggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast({
      title: "Notification Setting Updated",
      description: "Your notification preferences have been updated.",
    });
  };

  const handleManageIntegrations = () => {
    toast({
      title: "Opening Integrations",
      description: "Redirecting to API integrations management...",
    });
  };

  const handleViewInvoices = () => {
    toast({
      title: "Loading Invoices",
      description: "Opening your billing history...",
    });
  };

  const handleUpgradePlan = () => {
    toast({
      title: "Upgrade Plan",
      description: "Redirecting to plan upgrade options...",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Account Deletion",
      description: "This action requires additional confirmation.",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and configuration
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
            <CardDescription>Manage your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input 
                id="company" 
                value={profile.company}
                onChange={(e) => setProfile(prev => ({ ...prev, company: e.target.value }))}
              />
            </div>
            <Button size="sm" onClick={handleSaveProfile}>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications for important updates
                </p>
              </div>
              <Switch 
                checked={notifications.emailAlerts}
                onCheckedChange={() => handleToggleNotification('emailAlerts')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Brand Mentions</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when your brand is mentioned
                </p>
              </div>
              <Switch 
                checked={notifications.brandMentions}
                onCheckedChange={() => handleToggleNotification('brandMentions')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Automatic weekly performance reports
                </p>
              </div>
              <Switch 
                checked={notifications.weeklyReports}
                onCheckedChange={() => handleToggleNotification('weeklyReports')}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>AI Recommendations</Label>
                <p className="text-sm text-muted-foreground">
                  Get AI-powered insights and recommendations
                </p>
              </div>
              <Switch 
                checked={notifications.aiRecommendations}
                onCheckedChange={() => handleToggleNotification('aiRecommendations')}
              />
            </div>
          </CardContent>
        </Card>

        {/* API Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Keys
            </CardTitle>
            <CardDescription>Manage your API integrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">OpenAI API</div>
                  <div className="text-sm text-muted-foreground">For AI insights generation</div>
                </div>
                <Badge variant="outline">Connected</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Twitter API</div>
                  <div className="text-sm text-muted-foreground">Social media monitoring</div>
                </div>
                <Badge variant="secondary">Not Connected</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">Instagram API</div>
                  <div className="text-sm text-muted-foreground">Instagram analytics</div>
                </div>
                <Badge variant="outline">Connected</Badge>
              </div>
            </div>
            
            <Button variant="outline" size="sm" onClick={handleManageIntegrations}>
              Manage Integrations
            </Button>
          </CardContent>
        </Card>

        {/* Billing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Billing & Subscription
            </CardTitle>
            <CardDescription>Manage your subscription and billing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5">
              <div>
                <div className="font-semibold">Pro Plan</div>
                <div className="text-sm text-muted-foreground">$99/month • Next billing: Feb 15, 2024</div>
              </div>
              <Badge>Active</Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Usage this month</span>
                <span>2,450 / 5,000 API calls</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '49%' }}></div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleViewInvoices}>
                View Invoices
              </Button>
              <Button variant="outline" size="sm" onClick={handleUpgradePlan}>
                Upgrade Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Delete Account</div>
              <div className="text-sm text-muted-foreground">
                Permanently delete your account and all associated data
              </div>
            </div>
            <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}