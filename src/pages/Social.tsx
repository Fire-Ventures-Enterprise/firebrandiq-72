import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Instagram, Twitter, Linkedin, TrendingUp, Users, Heart, BarChart3, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { SocialMetricsService, SocialMetrics, SocialAlert } from "@/services/socialMetricsService";
import SocialMetricsCard from "@/components/social/SocialMetricsCard";

const mockSocialAccounts = [
  {
    id: "1",
    platform: "Instagram",
    username: "@techstartup_inc",
    followers: 15400,
    following: 234,
    posts: 156,
    engagement: 4.2,
    growth: "+12%",
    icon: Instagram,
    color: "text-pink-500"
  },
  {
    id: "2",
    platform: "Twitter", 
    username: "@techstartup",
    followers: 8900,
    following: 445,
    posts: 1200,
    engagement: 3.8,
    growth: "+8%", 
    icon: Twitter,
    color: "text-blue-400"
  },
  {
    id: "3",
    platform: "LinkedIn",
    username: "TechStartup Inc",
    followers: 5200,
    following: 89,
    posts: 67,
    engagement: 5.1,
    growth: "+15%",
    icon: Linkedin,
    color: "text-blue-600"
  }
];

const mockRecentPosts = [
  {
    id: "1",
    platform: "Instagram",
    content: "🚀 Excited to announce our new AI-powered features! #innovation #tech",
    likes: 234,
    comments: 45,
    shares: 12,
    time: "2 hours ago"
  },
  {
    id: "2", 
    platform: "Twitter",
    content: "Customer success is our top priority. Here's how we're improving our support...",
    likes: 89,
    comments: 23,
    shares: 34,
    time: "5 hours ago"
  },
  {
    id: "3",
    platform: "LinkedIn",
    content: "The future of SaaS: trends every business should know about in 2024",
    likes: 156,
    comments: 67,
    shares: 45,
    time: "1 day ago"
  }
];

export default function Social() {
  const [socialMetrics, setSocialMetrics] = useState<SocialMetrics[]>([]);
  const [alerts, setAlerts] = useState<SocialAlert[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSocialData();
  }, []);

  const loadSocialData = async () => {
    try {
      setLoading(true);
      const [metrics, socialAlerts] = await Promise.all([
        SocialMetricsService.getAllMetrics(),
        SocialMetricsService.getAlerts()
      ]);
      
      setSocialMetrics(metrics);
      setAlerts(socialAlerts);
    } catch (error) {
      console.error('Failed to load social data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectAccount = () => {
    console.log('Connect social account');
    // Implement social account connection
  };

  const handleOptimize = (platform: string) => {
    console.log('Optimize', platform);
    // Implement optimization suggestions
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      default: return 'bg-blue-500 text-white';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Social Media</h1>
          <p className="text-muted-foreground">
            AI-powered social media analytics and optimization
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button onClick={handleConnectAccount}>
            <Plus className="h-4 w-4 mr-2" />
            Connect Account
          </Button>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Social Media Alerts
            </CardTitle>
            <CardDescription>
              Real-time notifications about your social media performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Badge className={getAlertSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                    <div>
                      <h4 className="font-medium">{alert.title}</h4>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{alert.platform}</Badge>
                    {alert.actionRequired && (
                      <Button size="sm">Take Action</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Social Accounts */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Connected Accounts</h2>
          <Badge variant="outline" className="text-primary">
            {socialMetrics.length} Connected
          </Badge>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {socialMetrics.map((metrics) => (
            <SocialMetricsCard
              key={metrics.platform}
              metrics={metrics}
              onViewDetails={() => console.log('View details for', metrics.platform)}
              onOptimize={() => handleOptimize(metrics.platform)}
            />
          ))}
        </div>
      </div>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
          <CardDescription>Latest social media activity across all platforms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockRecentPosts.map((post) => (
            <div key={post.id} className="flex items-start space-x-4 p-4 border rounded-lg">
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{post.platform}</Badge>
                  <span className="text-sm text-muted-foreground">{post.time}</span>
                </div>
                <p className="text-sm">{post.content}</p>
                
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <span className="flex items-center space-x-1">
                    <Heart className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span>💬</span>
                    <span>{post.comments}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <span>🔄</span>
                    <span>{post.shares}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}