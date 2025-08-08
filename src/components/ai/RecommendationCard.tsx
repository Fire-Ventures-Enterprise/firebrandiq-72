import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, AlertTriangle, TrendingUp, Target, Calendar } from "lucide-react";
import { AIRecommendation } from "@/services/aiService";

interface RecommendationCardProps {
  recommendation: AIRecommendation;
  onAccept?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'high': return 'bg-red-500 text-white';
    case 'medium': return 'bg-yellow-500 text-black';
    case 'low': return 'bg-green-500 text-white';
    default: return 'bg-secondary text-secondary-foreground';
  }
};

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 0.8) return 'text-green-600';
  if (confidence >= 0.6) return 'text-yellow-600';
  return 'text-red-600';
};

export default function RecommendationCard({ 
  recommendation, 
  onAccept, 
  onDismiss, 
  onViewDetails 
}: RecommendationCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              {recommendation.title}
            </CardTitle>
            <CardDescription>{recommendation.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{recommendation.category}</Badge>
            <Badge className={getImpactColor(recommendation.impact)}>
              {recommendation.impact.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Confidence Score */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">AI Confidence</span>
          <span className={`font-medium ${getConfidenceColor(recommendation.confidence)}`}>
            {Math.round(recommendation.confidence * 100)}%
          </span>
        </div>
        <Progress value={recommendation.confidence * 100} className="h-2" />

        {/* Expected Outcome */}
        <div className="bg-muted/50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="font-medium text-sm">Expected Outcome</span>
          </div>
          <p className="text-sm text-muted-foreground">{recommendation.expectedOutcome}</p>
        </div>

        {/* Timeline */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Timeline: {recommendation.timeline}</span>
        </div>

        {/* Action Items Preview */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Key Actions:</h4>
          <ul className="space-y-1">
            {recommendation.actionItems.slice(0, 2).map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-3 w-3 mt-1 text-muted-foreground" />
                <span>{item}</span>
              </li>
            ))}
            {recommendation.actionItems.length > 2 && (
              <li className="text-sm text-muted-foreground ml-5">
                +{recommendation.actionItems.length - 2} more actions
              </li>
            )}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t">
          <Button 
            onClick={() => onAccept?.(recommendation.id)}
            className="flex-1"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Accept
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onViewDetails?.(recommendation.id)}
          >
            Details
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => onDismiss?.(recommendation.id)}
          >
            Dismiss
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}