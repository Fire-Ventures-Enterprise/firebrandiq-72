import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ExternalLink, 
  MessageSquare, 
  Heart, 
  Repeat, 
  Share,
  Twitter,
  Instagram,
  Linkedin,
  AlertCircle
} from "lucide-react";

interface Activity {
  id: string;
  source: string;
  platform: 'twitter' | 'instagram' | 'linkedin' | 'reddit';
  author: string;
  avatar: string;
  content: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  time: string;
  engagement: {
    likes: number;
    shares: number;
    comments: number;
  };
  priority: 'high' | 'medium' | 'low';
  influencer?: boolean;
}

const activities: Activity[] = [
  {
    id: '1',
    source: 'Twitter',
    platform: 'twitter',
    author: 'Sarah Chen',
    avatar: '/placeholder.svg',
    content: 'Just had an amazing customer service experience with TechStartup Inc! Their support team went above and beyond. 🌟',
    sentiment: 'positive',
    time: '2 hours ago',
    engagement: { likes: 45, shares: 12, comments: 8 },
    priority: 'high',
    influencer: true
  },
  {
    id: '2',
    source: 'Reddit',
    platform: 'reddit',
    author: 'tech_reviewer',
    avatar: '/placeholder.svg',
    content: 'Has anyone tried TechStartup Inc\'s new feature? Looking for honest reviews before making the switch.',
    sentiment: 'neutral',
    time: '4 hours ago',
    engagement: { likes: 23, shares: 5, comments: 15 },
    priority: 'medium'
  },
  {
    id: '3',
    source: 'Instagram',
    platform: 'instagram',
    author: 'designerjohn',
    avatar: '/placeholder.svg',
    content: 'Love the new design update! The interface is so much cleaner now 🔥 #TechStartup #UIDesign',
    sentiment: 'positive',
    time: '6 hours ago',
    engagement: { likes: 127, shares: 34, comments: 22 },
    priority: 'high'
  },
  {
    id: '4',
    source: 'LinkedIn',
    platform: 'linkedin',
    author: 'Mike Roberts',
    avatar: '/placeholder.svg',
    content: 'Disappointed with the recent update. Several features are now harder to find. Hope they fix this soon.',
    sentiment: 'negative',
    time: '8 hours ago',
    engagement: { likes: 8, shares: 3, comments: 12 },
    priority: 'high'
  }
];

export default function EnhancedActivity() {
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter': return <Twitter className="h-4 w-4 text-blue-500" />;
      case 'instagram': return <Instagram className="h-4 w-4 text-pink-500" />;
      case 'linkedin': return <Linkedin className="h-4 w-4 text-blue-600" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <Badge className="bg-success/10 text-success border-success/20">Positive</Badge>;
      case 'negative':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Negative</Badge>;
      default:
        return <Badge variant="outline">Neutral</Badge>;
    }
  };

  const getPriorityBadge = (priority: string, influencer?: boolean) => {
    if (influencer) {
      return <Badge className="bg-purple-100 text-purple-700 border-purple-200">Influencer</Badge>;
    }
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-700 border-red-200">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Medium</Badge>;
      default:
        return null;
    }
  };

  const filterActivities = (filter: string) => {
    switch (filter) {
      case 'positive':
        return activities.filter(a => a.sentiment === 'positive');
      case 'negative':
        return activities.filter(a => a.sentiment === 'negative');
      case 'high-priority':
        return activities.filter(a => a.priority === 'high' || a.influencer);
      default:
        return activities;
    }
  };

  const ActivityList = ({ activities }: { activities: Activity[] }) => (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="p-4 border rounded-lg hover:bg-muted/30 transition-colors">
          <div className="flex items-start space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={activity.avatar} alt={activity.author} />
              <AvatarFallback>{activity.author.slice(0, 2)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getPlatformIcon(activity.platform)}
                  <span className="font-medium text-sm">{activity.author}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {getPriorityBadge(activity.priority, activity.influencer)}
                  {getSentimentBadge(activity.sentiment)}
                </div>
              </div>
              
              <p className="text-sm text-foreground">{activity.content}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Heart className="h-3 w-3" />
                    <span>{activity.engagement.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Repeat className="h-3 w-3" />
                    <span>{activity.engagement.shares}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageSquare className="h-3 w-3" />
                    <span>{activity.engagement.comments}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Share className="h-3 w-3 mr-1" />
                    Respond
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest brand mentions and social activity</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <AlertCircle className="h-4 w-4 mr-2" />
            Set Alerts
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="positive">Positive</TabsTrigger>
            <TabsTrigger value="negative">Negative</TabsTrigger>
            <TabsTrigger value="high-priority">High Priority</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <ActivityList activities={filterActivities('all')} />
          </TabsContent>
          
          <TabsContent value="positive">
            <ActivityList activities={filterActivities('positive')} />
          </TabsContent>
          
          <TabsContent value="negative">
            <ActivityList activities={filterActivities('negative')} />
          </TabsContent>
          
          <TabsContent value="high-priority">
            <ActivityList activities={filterActivities('high-priority')} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}