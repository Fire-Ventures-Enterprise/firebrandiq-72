import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

interface BrandHealthScoreProps {
  score: number;
  previousScore: number;
}

export default function BrandHealthScore({ score = 87, previousScore = 82 }: BrandHealthScoreProps) {
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const change = score - previousScore;

  const getScoreColor = () => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreLabel = () => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Good";
    if (score >= 60) return "Fair";
    return "Needs Attention";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Brand Health Score</span>
          <Badge variant="outline" className="text-success border-success">
            <TrendingUp className="h-3 w-3 mr-1" />
            +{change}
          </Badge>
        </CardTitle>
        <CardDescription>Overall brand performance indicator</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="hsl(var(--primary))"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${getScoreColor()}`}>{score}</span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <div className={`text-sm font-medium ${getScoreColor()}`}>
            {getScoreLabel()}
          </div>
          <div className="text-xs text-muted-foreground">
            Based on sentiment, engagement, and reach metrics
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full text-center">
          <div>
            <div className="text-lg font-semibold text-success">8.4</div>
            <div className="text-xs text-muted-foreground">Sentiment</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-primary">92%</div>
            <div className="text-xs text-muted-foreground">Engagement</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-warning">2.1M</div>
            <div className="text-xs text-muted-foreground">Reach</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}