import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, TrendingUp, AlertTriangle, Users, ArrowRight } from "lucide-react";

interface Insight {
  id: string;
  type: 'opportunity' | 'alert' | 'recommendation';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  action?: string;
}

const insights: Insight[] = [
  {
    id: '1',
    type: 'opportunity',
    title: 'High-Authority Mention Detected',
    description: 'TechCrunch mentioned your product in their latest article. This is a great opportunity for amplification.',
    impact: 'high',
    confidence: 94,
    action: 'Share on social media'
  },
  {
    id: '2',
    type: 'alert',
    title: 'Competitor Campaign Launch',
    description: 'Your main competitor launched a major marketing campaign. Consider counter-messaging strategy.',
    impact: 'medium',
    confidence: 87,
    action: 'Review competitor analysis'
  },
  {
    id: '3',
    type: 'recommendation',
    title: 'Optimize Content Strategy',
    description: 'Video content performs 3x better than text posts. Increase video content production.',
    impact: 'high',
    confidence: 92,
    action: 'Plan video content'
  }
];

export default function AIInsights() {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <TrendingUp className="h-4 w-4 text-success" />;
      case 'alert': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'recommendation': return <Brain className="h-4 w-4 text-primary" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'low': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-primary" />
          <span>AI Insights</span>
          <Badge variant="outline" className="ml-auto">Live</Badge>
        </CardTitle>
        <CardDescription>AI-powered recommendations and alerts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight) => (
          <div key={insight.id} className="p-4 border rounded-lg space-y-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                {getInsightIcon(insight.type)}
                <h4 className="font-medium text-sm">{insight.title}</h4>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className={getImpactColor(insight.impact)}>
                  {insight.impact}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {insight.confidence}% confidence
                </Badge>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">{insight.description}</p>
            
            {insight.action && (
              <Button variant="ghost" size="sm" className="w-full justify-between">
                {insight.action}
                <ArrowRight className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}

        <div className="pt-2 border-t">
          <Button variant="outline" className="w-full">
            <Users className="h-4 w-4 mr-2" />
            View All Insights
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}