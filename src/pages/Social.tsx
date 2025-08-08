import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Instagram, Twitter, Linkedin, TrendingUp, Users, Heart } from "lucide-react";

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
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Social Media</h1>
          <p className="text-muted-foreground">
            Track your social media performance and engagement
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Connect Account
        </Button>
      </div>

      {/* Social Accounts */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockSocialAccounts.map((account) => {
          const IconComponent = account.icon;
          return (
            <Card key={account.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <IconComponent className={`h-6 w-6 ${account.color}`} />
                    <div>
                      <CardTitle className="text-lg">{account.platform}</CardTitle>
                      <CardDescription>{account.username}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-success">
                    {account.growth}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-xl font-semibold">{(account.followers / 1000).toFixed(1)}K</div>
                    <div className="text-xs text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-xl font-semibold">{account.engagement}%</div>
                    <div className="text-xs text-muted-foreground">Engagement</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Following:</span>
                    <span className="font-medium">{account.following}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Posts:</span>
                    <span className="font-medium">{account.posts}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          );
        })}
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