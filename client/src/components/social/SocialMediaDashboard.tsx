import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { UserSocialService, type UserSocialConnection, type SocialMetricsData } from '@/services/userSocialService';
import { 
  TwitterIcon, 
  InstagramIcon, 
  LinkedinIcon, 
  FacebookIcon,
  TrendingUpIcon,
  UsersIcon,
  MessageSquareIcon,
  ShareIcon,
  HeartIcon,
  BarChart3Icon,
  CalendarIcon,
  SendIcon,
  RefreshCwIcon,
  ExternalLinkIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  ZapIcon
} from 'lucide-react';
import SocialConnectionsManager from './SocialConnectionsManager';
import { SocialConnectionWizard } from './SocialConnectionWizard';
import { ContentScheduler } from './ContentScheduler';
import { PerformanceDashboard } from './PerformanceDashboard';
import { ContentRecommendationEngine } from './ContentRecommendationEngine';
import { SocialMediaAlerts } from './SocialMediaAlerts';

interface SocialPost {
  id: string;
  content: string;
  mediaUrls: string[];
  hashtags: string[];
  mentions: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  publishedAt: Date;
}

const platformIcons: Record<string, React.ComponentType<any>> = {
  twitter: TwitterIcon,
  instagram: InstagramIcon,
  linkedin: LinkedinIcon,
  facebook: FacebookIcon,
};

const platformColors: Record<string, string> = {
  twitter: 'text-blue-500',
  instagram: 'text-pink-500',
  linkedin: 'text-blue-600',
  facebook: 'text-blue-700',
};

export function SocialMediaDashboard() {
  const [connections, setConnections] = useState<UserSocialConnection[]>([]);
  const [metrics, setMetrics] = useState<SocialMetricsData[]>([]);
  const [posts, setPosts] = useState<Record<string, SocialPost[]>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [publishContent, setPublishContent] = useState('');
  const [selectedConnections, setSelectedConnections] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);
  const [showConnectionWizard, setShowConnectionWizard] = useState(false);

  const mockUserId = "user-123"; // In real app, get from auth context

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load connections
      const userConnections = await UserSocialService.getUserConnections(mockUserId);
      setConnections(userConnections);

      // Load metrics for each connection
      const metricsData = await UserSocialService.getAllUserMetrics(mockUserId);
      setMetrics(metricsData);

      // Load recent posts for each connection
      const postsData: Record<string, SocialPost[]> = {};
      for (const connection of userConnections) {
        try {
          const connectionPosts = await UserSocialService.getSocialPosts(connection.id, 5);
          postsData[connection.id] = connectionPosts;
        } catch (error) {
          console.error(`Error loading posts for ${connection.platform}:`, error);
          postsData[connection.id] = [];
        }
      }
      setPosts(postsData);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load social media data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!publishContent.trim() || selectedConnections.length === 0) {
      toast({
        title: "Error",
        description: "Please enter content and select at least one platform",
        variant: "destructive"
      });
      return;
    }

    setPublishing(true);
    const results: Array<{ platform: string; success: boolean; error?: string }> = [];

    for (const connectionId of selectedConnections) {
      const connection = connections.find(c => c.id === connectionId);
      if (!connection) continue;

      try {
        const result = await UserSocialService.publishPost(connectionId, publishContent);
        results.push({
          platform: connection.platform,
          success: result.success,
          error: result.error
        });
      } catch (error) {
        results.push({
          platform: connection.platform,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.length - successCount;

    if (successCount > 0) {
      toast({
        title: "Publishing Complete",
        description: `Successfully published to ${successCount} platform${successCount !== 1 ? 's' : ''}${failCount > 0 ? `, ${failCount} failed` : ''}`,
      });
      
      if (successCount === results.length) {
        setPublishContent('');
        setSelectedConnections([]);
        loadData(); // Refresh posts
      }
    } else {
      toast({
        title: "Publishing Failed",
        description: "Failed to publish to any platforms",
        variant: "destructive"
      });
    }

    setPublishing(false);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getConnectionStatus = (connection: UserSocialConnection) => {
    const now = new Date();
    const tokenExpiresAt = connection.tokenExpiresAt ? new Date(connection.tokenExpiresAt) : null;
    
    if (!connection.isActive) return { status: 'inactive', color: 'text-gray-500', icon: XCircleIcon };
    if (tokenExpiresAt && tokenExpiresAt < now) return { status: 'expired', color: 'text-red-500', icon: AlertCircleIcon };
    return { status: 'active', color: 'text-green-500', icon: CheckCircleIcon };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCwIcon className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading social media data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="social-media-dashboard">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Social Media</h1>
          <p className="text-muted-foreground">AI-powered social media analytics and optimization</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadData} size="sm">
            <RefreshCwIcon className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button onClick={() => setShowConnectionWizard(true)} size="sm">
            <ZapIcon className="h-4 w-4 mr-2" />
            Connect Account
          </Button>
        </div>
      </div>

      {/* Social Media Alerts */}
      <SocialMediaAlerts />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="scheduler">Scheduler</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="ai-content">AI Content</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Connected Platforms Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {connections.map(connection => {
              const Icon = platformIcons[connection.platform] || MessageSquareIcon;
              const statusInfo = getConnectionStatus(connection);
              const StatusIcon = statusInfo.icon;
              
              return (
                <Card key={connection.id} data-testid={`connection-card-${connection.platform}`}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center space-x-2">
                      <Icon className={`h-5 w-5 ${platformColors[connection.platform]}`} />
                      <span className="capitalize font-semibold">{connection.platform}</span>
                    </div>
                    <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">@{connection.username}</span>
                        {connection.profileUrl && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={connection.profileUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLinkIcon className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center">
                          <UsersIcon className="h-3 w-3 mr-1" />
                          {formatNumber(connection.followerCount || 0)}
                        </div>
                        <div className="flex items-center">
                          <MessageSquareIcon className="h-3 w-3 mr-1" />
                          {formatNumber(connection.postCount || 0)}
                        </div>
                      </div>
                      {connection.lastSyncAt && (
                        <div className="text-xs text-muted-foreground">
                          Last sync: {new Date(connection.lastSyncAt).toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Recent Posts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Posts</CardTitle>
              <CardDescription>Latest posts from your connected platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(posts).map(([connectionId, connectionPosts]) => {
                  const connection = connections.find(c => c.id === connectionId);
                  if (!connection || connectionPosts.length === 0) return null;

                  const Icon = platformIcons[connection.platform] || MessageSquareIcon;

                  return (
                    <div key={connectionId} className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Icon className={`h-4 w-4 ${platformColors[connection.platform]}`} />
                        <span className="font-medium capitalize">{connection.platform}</span>
                        <Badge variant="secondary">@{connection.username}</Badge>
                      </div>
                      
                      {connectionPosts.slice(0, 3).map(post => (
                        <div key={post.id} className="border rounded-lg p-4 ml-6">
                          <p className="text-sm mb-2">{post.content}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <HeartIcon className="h-3 w-3 mr-1" />
                              {formatNumber(post.likesCount)}
                            </div>
                            <div className="flex items-center">
                              <MessageSquareIcon className="h-3 w-3 mr-1" />
                              {formatNumber(post.commentsCount)}
                            </div>
                            <div className="flex items-center">
                              <ShareIcon className="h-3 w-3 mr-1" />
                              {formatNumber(post.sharesCount)}
                            </div>
                            <div className="flex items-center">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              {new Date(post.publishedAt).toLocaleDateString()}
                            </div>
                          </div>
                          {post.hashtags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {post.hashtags.map((tag, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                      <Separator className="ml-6" />
                    </div>
                  );
                })}
                
                {Object.keys(posts).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent posts found. Connect your social media accounts to see your content here.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduler" className="space-y-6">
          <ContentScheduler />
        </TabsContent>

        <TabsContent value="ai-content" className="space-y-6">
          <ContentRecommendationEngine />
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <PerformanceDashboard />
        </TabsContent>

        <TabsContent value="publish" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publish New Post</CardTitle>
              <CardDescription>Create and publish content across your connected platforms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="content">Post Content</Label>
                <Textarea
                  id="content"
                  placeholder="What's happening?"
                  value={publishContent}
                  onChange={(e) => setPublishContent(e.target.value)}
                  rows={4}
                  data-testid="publish-content-input"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  {publishContent.length}/280 characters
                </div>
              </div>

              <div>
                <Label>Select Platforms</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {connections.filter(conn => conn.isActive).map(connection => {
                    const Icon = platformIcons[connection.platform] || MessageSquareIcon;
                    const isSelected = selectedConnections.includes(connection.id);
                    
                    return (
                      <Button
                        key={connection.id}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedConnections(prev => prev.filter(id => id !== connection.id));
                          } else {
                            setSelectedConnections(prev => [...prev, connection.id]);
                          }
                        }}
                        className="justify-start"
                        data-testid={`platform-selector-${connection.platform}`}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {connection.platform} (@{connection.username})
                      </Button>
                    );
                  })}
                </div>
              </div>

              <Button
                onClick={handlePublish}
                disabled={publishing || !publishContent.trim() || selectedConnections.length === 0}
                className="w-full"
                data-testid="publish-button"
              >
                {publishing ? (
                  <>
                    <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <SendIcon className="h-4 w-4 mr-2" />
                    Publish to {selectedConnections.length} Platform{selectedConnections.length !== 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium capitalize">
                    {metric.platform} Metrics
                  </CardTitle>
                  <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="font-semibold">{formatNumber(metric.followers)}</div>
                      <div className="text-muted-foreground">Followers</div>
                    </div>
                    <div>
                      <div className="font-semibold">{formatNumber(metric.posts)}</div>
                      <div className="text-muted-foreground">Posts</div>
                    </div>
                    <div>
                      <div className="font-semibold">{metric.engagement.rate}%</div>
                      <div className="text-muted-foreground">Engagement</div>
                    </div>
                    <div>
                      <div className="font-semibold">{formatNumber(metric.engagement.likes)}</div>
                      <div className="text-muted-foreground">Likes</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {metrics.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <BarChart3Icon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Analytics Data</h3>
                <p className="text-muted-foreground">Connect your social media accounts to view analytics.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="connections">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Social Media Connections</h3>
                <p className="text-muted-foreground">Manage your connected social media accounts</p>
              </div>
              <Button 
                onClick={() => setShowConnectionWizard(true)}
                data-testid="button-open-wizard"
              >
                <ZapIcon className="h-4 w-4 mr-2" />
                Connection Wizard
              </Button>
            </div>
            <SocialConnectionsManager />
          </div>
        </TabsContent>
      </Tabs>

      {/* Social Connection Wizard */}
      <SocialConnectionWizard
        isOpen={showConnectionWizard}
        onClose={() => setShowConnectionWizard(false)}
        onSuccess={() => {
          setShowConnectionWizard(false);
          loadData(); // Refresh data after successful connection
        }}
      />
    </div>
  );
}