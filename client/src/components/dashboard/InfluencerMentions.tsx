import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, ExternalLink, Heart, MessageSquare, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Influencer {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  platform: string;
  followers: number;
  engagement: number;
  mention: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  reach: number;
  time: string;
  verified: boolean;
}

const influencers: Influencer[] = [
  {
    id: '1',
    name: 'Sarah Martinez',
    handle: '@sarahtech',
    avatar: '/placeholder.svg',
    platform: 'Twitter',
    followers: 125000,
    engagement: 8.4,
    mention: 'Just discovered this amazing tool that\'s revolutionizing our workflow! 🚀',
    sentiment: 'positive',
    reach: 15600,
    time: '2h',
    verified: true
  },
  {
    id: '2',
    name: 'Tech Review Pro',
    handle: '@techreviewpro',
    avatar: '/placeholder.svg',
    platform: 'YouTube',
    followers: 89000,
    engagement: 12.1,
    mention: 'Comprehensive review of the latest features - some hits and misses',
    sentiment: 'neutral',
    reach: 22400,
    time: '5h',
    verified: true
  },
  {
    id: '3',
    name: 'Lisa Chen',
    handle: '@designwithLisa',
    avatar: '/placeholder.svg',
    platform: 'LinkedIn',
    followers: 67000,
    engagement: 6.8,
    mention: 'The UI improvements are fantastic, but customer support needs work',
    sentiment: 'neutral',
    reach: 8900,
    time: '1d',
    verified: false
  },
  {
    id: '4',
    name: 'StartupGuru',
    handle: '@startupguru',
    avatar: '/placeholder.svg',
    platform: 'Instagram',
    followers: 234000,
    engagement: 15.2,
    mention: 'Game-changing platform for small businesses! Love the innovation 💡',
    sentiment: 'positive',
    reach: 45200,
    time: '2d',
    verified: true
  }
];

export default function InfluencerMentions() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleViewInfluencer = (name: string, platform: string) => {
    toast({
      title: "Influencer Profile",
      description: `Viewing ${name}'s profile on ${platform}`,
    });
  };

  const handleViewAllInfluencers = () => {
    navigate('/mentions');
    toast({
      title: "All Influencers",
      description: "Viewing comprehensive influencer analytics",
    });
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

  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Star className="h-5 w-5 text-primary" />
          <span>Influencer Mentions</span>
        </CardTitle>
        <CardDescription>High-reach accounts discussing your brand</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {influencers.map((influencer) => (
          <div key={influencer.id} className="p-4 border rounded-lg space-y-3 hover:bg-muted/30 transition-colors">
            <div className="flex items-start space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={influencer.avatar} alt={influencer.name} />
                <AvatarFallback>{influencer.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-sm">{influencer.name}</span>
                    {influencer.verified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                    <span className="text-xs text-muted-foreground">{influencer.handle}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{influencer.time}</span>
                  </div>
                  {getSentimentBadge(influencer.sentiment)}
                </div>
                
                <p className="text-sm text-foreground">{influencer.mention}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{formatFollowers(influencer.followers)} followers</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="h-3 w-3" />
                      <span>{influencer.engagement}% engagement</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare className="h-3 w-3" />
                      <span>{influencer.reach.toLocaleString()} reach</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {influencer.platform}
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => handleViewInfluencer(influencer.name, influencer.platform)}>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="pt-3 border-t">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium">Total Reach: 92.1K</div>
            <div className="text-sm text-muted-foreground">4 influencers this week</div>
          </div>
          <Button variant="outline" className="w-full" onClick={handleViewAllInfluencers}>
            <Star className="h-4 w-4 mr-2" />
            View All Influencers
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}