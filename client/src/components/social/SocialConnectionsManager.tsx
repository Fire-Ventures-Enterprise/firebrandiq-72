import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Instagram, Twitter, Linkedin, Facebook, Youtube, Music, Plus, Unlink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
// Migrated to server-side API - no longer using Supabase client

interface SocialConnection {
  id: string;
  platform: string;
  username: string;
  is_active: boolean;
  created_at: string;
}

const platformConfigs: Record<string, {
  name: string;
  icon: any;
  color: string;
  useOAuth?: boolean;
  fields: Array<{ key: string; label: string; type: string; required: boolean }>;
}> = {
  instagram: {
    name: "Instagram",
    icon: Instagram,
    color: "text-pink-500",
    fields: [
      { key: "access_token", label: "Access Token", type: "password", required: true },
      { key: "username", label: "Username", type: "text", required: true }
    ]
  },
  twitter: {
    name: "Twitter/X",
    icon: Twitter,
    color: "text-blue-400",
    useOAuth: true,
    fields: []
  },
  linkedin: {
    name: "LinkedIn",
    icon: Linkedin,
    color: "text-blue-600",
    fields: [
      { key: "access_token", label: "Access Token", type: "password", required: true },
      { key: "username", label: "Page/Profile Name", type: "text", required: true }
    ]
  },
  facebook: {
    name: "Facebook",
    icon: Facebook,
    color: "text-blue-600",
    fields: [
      { key: "access_token", label: "Page Access Token", type: "password", required: true },
      { key: "username", label: "Page Name", type: "text", required: true }
    ]
  },
  youtube: {
    name: "YouTube",
    icon: Youtube,
    color: "text-red-500",
    fields: [
      { key: "access_token", label: "API Key", type: "password", required: true },
      { key: "username", label: "Channel Name", type: "text", required: true }
    ]
  },
  tiktok: {
    name: "TikTok",
    icon: Music,
    color: "text-black",
    fields: [
      { key: "access_token", label: "Access Token", type: "password", required: true },
      { key: "username", label: "Username", type: "text", required: true }
    ]
  }
};

export default function SocialConnectionsManager() {
  const { toast } = useToast();
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [formData, setFormData] = useState<Record<string, string>>({});

  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = async () => {
    try {
      // For now, using a mock userId - in real app this would come from auth context
      const mockUserId = "user-123";
      const { UserSocialService } = await import('@/services/userSocialService');
      const userConnections = await UserSocialService.getUserConnections(mockUserId);
      
      // Transform to component format
      const formattedConnections = userConnections.map(conn => ({
        id: conn.id,
        platform: conn.platform,
        username: conn.username,
        is_active: conn.isActive,
        created_at: conn.createdAt
      }));
      
      setConnections(formattedConnections);
    } catch (error) {
      console.error('Error loading connections:', error);
      toast({
        title: "Error", 
        description: "Failed to load social media connections",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConnectPlatform = async (platform: string) => {
    const config = platformConfigs[platform as keyof typeof platformConfigs];
    
    // Handle OAuth platforms differently
    if (config.useOAuth) {
      await initiateOAuthFlow(platform);
    } else {
      setSelectedPlatform(platform);
      setFormData({});
      setConnectDialogOpen(true);
    }
  };

  const initiateOAuthFlow = async (platform: string) => {
    try {
      if (platform === 'twitter') {
        const { supabase } = await import('@/integrations/supabase/client');
        
        // Get auth session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast({
            title: "Authentication Required",
            description: "Please log in to connect social accounts",
            variant: "destructive"
          });
          return;
        }

        // Call edge function to get authorization URL
        const { data, error } = await supabase.functions.invoke('twitter-oauth-init', {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });

        if (error) {
          throw error;
        }

        if (data?.authUrl) {
          // Redirect to Twitter authorization
          window.location.href = data.authUrl;
        } else {
          throw new Error('No authorization URL returned');
        }
      }
    } catch (error) {
      console.error('OAuth initiation error:', error);
      toast({
        title: "Connection Error",
        description: `Failed to initiate ${platform} connection. Please try again.`,
        variant: "destructive"
      });
    }
  };

  const handleSaveConnection = async () => {
    try {
      // First test the connection
      const { UserSocialService } = await import('@/services/userSocialService');
      const testResult = await UserSocialService.testConnection(
        selectedPlatform, 
        formData.access_token,
        formData.refresh_token
      );

      if (!testResult.success) {
        toast({
          title: "Connection Test Failed",
          description: testResult.error || "Invalid credentials",
          variant: "destructive"
        });
        return;
      }

      // Save the connection if test passed
      const mockUserId = "user-123"; // In real app, get from auth context
      const result = await UserSocialService.addConnection({
        userId: mockUserId,
        platform: selectedPlatform,
        username: formData.username,
        accessToken: formData.access_token,
        refreshToken: formData.refresh_token,
        platformUserId: formData.platform_user_id
      });

      if (result.success) {
        toast({
          title: "Success",
          description: `${platformConfigs[selectedPlatform as keyof typeof platformConfigs].name} connected successfully`,
        });
        setConnectDialogOpen(false);
        loadConnections();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save connection",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving connection:', error);
      toast({
        title: "Error",
        description: "Failed to save connection",
        variant: "destructive"
      });
    }
  };

  const handleDisconnect = async (connectionId: string, platform: string) => {
    try {
      const { UserSocialService } = await import('@/services/userSocialService');
      const result = await UserSocialService.removeConnection(connectionId);

      if (result.success) {
        toast({
          title: "Disconnected",
          description: `${platform} account has been disconnected`,
        });
        loadConnections();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to disconnect account",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast({
        title: "Error",
        description: "Failed to disconnect account",
        variant: "destructive"
      });
    }
  };

  const isConnected = (platform: string) => {
    return connections.some(conn => conn.platform === platform);
  };

  const getConnection = (platform: string) => {
    return connections.find(conn => conn.platform === platform);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Social Media Connections
        </CardTitle>
        <CardDescription>
          Connect your social media accounts to enable analytics and automation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(platformConfigs).map(([platform, config]) => {
            const connection = getConnection(platform);
            const Icon = config.icon;
            
            return (
              <div key={platform} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon className={`h-6 w-6 ${config.color}`} />
                  <div>
                    <div className="font-medium">{config.name}</div>
                    {connection ? (
                      <div className="text-sm text-muted-foreground">@{connection.username}</div>
                    ) : (
                      <div className="text-sm text-muted-foreground">Not connected</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {connection ? (
                    <>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Connected
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnect(connection.id, config.name)}
                      >
                        <Unlink className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Badge variant="secondary">Disconnected</Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleConnectPlatform(platform)}
                      >
                        Connect
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <Dialog open={connectDialogOpen} onOpenChange={setConnectDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                Connect {selectedPlatform && platformConfigs[selectedPlatform as keyof typeof platformConfigs]?.name}
              </DialogTitle>
              <DialogDescription>
                Enter your API credentials to connect your social media account.
              </DialogDescription>
            </DialogHeader>
            
            {selectedPlatform && (
              <div className="space-y-4">
                {platformConfigs[selectedPlatform as keyof typeof platformConfigs].fields.map((field) => (
                  <div key={field.key} className="space-y-2">
                    <Label htmlFor={field.key}>{field.label}</Label>
                    <Input
                      id={field.key}
                      type={field.type}
                      placeholder={`Enter your ${field.label.toLowerCase()}`}
                      value={formData[field.key] || ""}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        [field.key]: e.target.value 
                      }))}
                      required={field.required}
                    />
                  </div>
                ))}
                
                <div className="text-sm text-muted-foreground p-3 bg-muted rounded-lg">
                  <strong>Need help getting API credentials?</strong>
                  <br />
                  Visit the {platformConfigs[selectedPlatform as keyof typeof platformConfigs].name} Developer Platform to create an app and generate your API tokens.
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setConnectDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveConnection}>
                Connect Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}