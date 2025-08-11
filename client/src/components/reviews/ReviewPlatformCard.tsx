import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ReviewPlatform } from "@/types/reviews";
import { Star, ExternalLink, TrendingUp } from "lucide-react";

interface ReviewPlatformCardProps {
  platform: ReviewPlatform;
}

export function ReviewPlatformCard({ platform }: ReviewPlatformCardProps) {
  const getPlatformIcon = (platformName: string) => {
    const icons = {
      google: '🌐',
      yelp: '🍽️',
      facebook: '📘',
      trustpilot: '⭐',
      amazon: '📦',
      glassdoor: '🏢'
    };
    return icons[platformName as keyof typeof icons] || '⭐';
  };

  const getExposureLevelColor = (level: string) => {
    switch (level) {
      case 'excellent':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'high':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      default:
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
    }
  };

  const progressPercentage = Math.min(100, (platform.totalReviews / platform.reviewGoals.targetCount) * 100);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="capitalize text-lg flex items-center gap-2">
            <span className="text-xl">{getPlatformIcon(platform.platform)}</span>
            {platform.platform}
          </CardTitle>
          <Badge className={getExposureLevelColor(platform.reviewGoals.exposureLevel)}>
            {platform.reviewGoals.exposureLevel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rating Display */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-2xl font-bold">{platform.averageRating}</span>
          </div>
          <span className="text-muted-foreground">({platform.totalReviews} reviews)</span>
        </div>

        {/* Progress to Goal */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to Goal</span>
            <span>{platform.totalReviews} / {platform.reviewGoals.targetCount}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Gap Analysis */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Reviews Needed</p>
            <p className="font-medium">{platform.reviewGoals.currentGap}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Monthly Target</p>
            <p className="font-medium">{platform.reviewGoals.monthlyTarget}</p>
          </div>
        </div>

        {/* Rating Goal */}
        <div className="text-sm">
          <p className="text-muted-foreground">Rating Target</p>
          <div className="flex items-center gap-2">
            <span className="font-medium">{platform.reviewGoals.targetRating}</span>
            {platform.averageRating < platform.reviewGoals.targetRating && (
              <Badge variant="outline" className="text-xs">
                +{(platform.reviewGoals.targetRating - platform.averageRating).toFixed(1)} needed
              </Badge>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <ExternalLink className="h-4 w-4 mr-1" />
            View Platform
          </Button>
          <Button size="sm" className="flex-1">
            <TrendingUp className="h-4 w-4 mr-1" />
            Analyze
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}