import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Instagram, Twitter, Linkedin, Facebook, Youtube, Music, Plus, Unlink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SocialConnection {
  id: string;
  platform: string;
  username: string;
  is_active: boolean;
  created_at: string;
}

const platformConfigs = {
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
    fields: [
      { key: "access_token", label: "Bearer Token", type: "password", required: true },
      { key: "username", label: "Username", type: "text", required: true }
    ]
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
      const { data, error } = await supabase
        .from('social_connections')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConnections(data || []);
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

  const handleConnectPlatform = (platform: string) => {
    setSelectedPlatform(platform);
    setFormData({});
    setConnectDialogOpen(true);
  };

  const handleSaveConnection = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from('social_connections')
        .upsert({
          user_id: user.id,
          platform: selectedPlatform,
          username: formData.username,
          access_token: formData.access_token,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `${platformConfigs[selectedPlatform as keyof typeof platformConfigs].name} connected successfully`,
      });

      setConnectDialogOpen(false);
      loadConnections();
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
      const { error } = await supabase
        .from('social_connections')
        .update({ is_active: false })
        .eq('id', connectionId);

      if (error) throw error;

      toast({
        title: "Disconnected",
        description: `${platform} account has been disconnected`,
      });

      loadConnections();
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