import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Users, Heart, MessageSquare, Share, ExternalLink } from "lucide-react";
import { SocialMetrics } from "@/services/socialMetricsService";

interface SocialMetricsCardProps {
  metrics: SocialMetrics;
  onViewDetails?: () => void;
  onOptimize?: () => void;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

const getTrendIcon = (change: number) => {
  if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
  if (change < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
  return null;
};

const getTrendColor = (change: number) => {
  if (change > 0) return 'text-green-600';
  if (change < 0) return 'text-red-600';
  return 'text-muted-foreground';
};

const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'instagram': return '📷';
    case 'twitter': return '🐦';
    case 'linkedin': return '💼';
    case 'facebook': return '👥';
    case 'tiktok': return '🎵';
    default: return '📱';
  }
};

const getEngagementLevel = (rate: number) => {
  if (rate >= 5) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-50' };
  if (rate >= 3) return { level: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-50' };
  if (rate >= 1) return { level: 'Average', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
  return { level: 'Low', color: 'text-red-600', bgColor: 'bg-red-50' };
};

export default function SocialMetricsCard({ 
  metrics, 
  onViewDetails, 
  onOptimize 
}: SocialMetricsCardProps) {
  const engagementLevel = getEngagementLevel(metrics.engagement.rate);
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{getPlatformIcon(metrics.platform)}</span>
            <div>
              <CardTitle className="text-lg">{metrics.platform}</CardTitle>
              <CardDescription>
                {formatNumber(metrics.followers)} followers
              </CardDescription>
            </div>
          </div>
          <div className="text-right">
            <div className={`flex items-center gap-1 ${getTrendColor(metrics.growth.followersChange)}`}>
              {getTrendIcon(metrics.growth.followersChange)}
              <span className="text-sm font-medium">
                {metrics.growth.followersChange > 0 ? '+' : ''}
                {metrics.growth.followersChange.toFixed(1)}%
              </span>
            </div>
            <div className="text-xs text-muted-foreground">{metrics.growth.period}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Engagement Rate</span>
              <span className={`font-medium ${engagementLevel.color}`}>
                {metrics.engagement.rate}%
              </span>
            </div>
            <Progress value={metrics.engagement.rate * 10} className="h-2" />
            <Badge variant="outline" className={`${engagementLevel.color} text-xs`}>
              {engagementLevel.level}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Posts</span>
              <span className="font-medium">{metrics.posts}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Following</span>
              <span className="font-medium">{formatNumber(metrics.following)}</span>
            </div>
          </div>
        </div>

        {/* Engagement Breakdown */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Recent Engagement</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-2 bg-muted/50 rounded">
              <div className="flex items-center justify-center gap-1 text-sm">
                <Heart className="h-3 w-3 text-red-500" />
                <span className="font-medium">{formatNumber(metrics.engagement.likes)}</span>
              </div>
              <div className="text-xs text-muted-foreground">Likes</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded">
              <div className="flex items-center justify-center gap-1 text-sm">
                <MessageSquare className="h-3 w-3 text-blue-500" />
                <span className="font-medium">{formatNumber(metrics.engagement.comments)}</span>
              </div>
              <div className="text-xs text-muted-foreground">Comments</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded">
              <div className="flex items-center justify-center gap-1 text-sm">
                <Share className="h-3 w-3 text-green-500" />
                <span className="font-medium">{formatNumber(metrics.engagement.shares)}</span>
              </div>
              <div className="text-xs text-muted-foreground">Shares</div>
            </div>
          </div>
        </div>

        {/* Growth Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Growth Trend</span>
            <span className={getTrendColor(metrics.growth.engagementChange)}>
              {metrics.growth.engagementChange > 0 ? '+' : ''}
              {metrics.growth.engagementChange.toFixed(1)}% engagement
            </span>
          </div>
          <Progress 
            value={Math.abs(metrics.growth.engagementChange) * 10} 
            className="h-1" 
          />
        </div>

        {/* Top Demographics */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Top Audience</h4>
          <div className="flex flex-wrap gap-1">
            {Object.entries(metrics.demographics.ageGroups)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 3)
              .map(([age, percentage]) => (
                <Badge key={age} variant="outline" className="text-xs">
                  {age}: {percentage}%
                </Badge>
              ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onViewDetails}
            className="flex-1"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Analytics
          </Button>
          <Button 
            size="sm" 
            onClick={onOptimize}
            className="flex-1"
          >
            Optimize
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}