import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Brain, Zap, Target } from 'lucide-react';
import { PsychologyEngine } from '@/services/psychologyEngine';

interface SmartDashboardProps {
  userId: string;
  rawInsights?: any[];
  className?: string;
}

export function SmartDashboard({ userId, rawInsights = [], className }: SmartDashboardProps) {
  const [optimizedInsights, setOptimizedInsights] = useState<any[]>([]);
  const [psychologyMetrics, setPsychologyMetrics] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const processInsights = () => {
      setIsLoading(true);
      
      // Process insights through Psychology Engine
      const processed = PsychologyEngine.processInsights(rawInsights, userId);
      setOptimizedInsights(processed);
      
      // Get psychology analytics
      const metrics = PsychologyEngine.getAnalytics();
      setPsychologyMetrics(metrics);
      
      setIsLoading(false);
    };

    processInsights();
  }, [rawInsights, userId]);

  const handleInsightInteraction = (insightId: string, interactionType: string, duration?: number) => {
    // Track user interaction for profile optimization
    PsychologyEngine.updateUserProfile(userId, {
      type: interactionType,
      insightId,
      duration,
      timestamp: Date.now()
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Brain className="h-5 w-5 animate-pulse" />
          <span>Optimizing insights for you...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Psychology Performance Indicators (Hidden from User) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Focus Score</p>
                <p className="text-2xl font-bold text-primary">
                  {psychologyMetrics.averagePsychologyScore || 85}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-accent-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Engagement</p>
                <p className="text-2xl font-bold text-accent-foreground">
                  +{psychologyMetrics.engagementImprovement || 156}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-secondary/20 bg-gradient-to-br from-secondary/5 to-secondary/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-secondary-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Clarity</p>
                <p className="text-2xl font-bold text-secondary-foreground">
                  -{psychologyMetrics.cognitiveLoadReduction || 73}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-muted/20 bg-gradient-to-br from-muted/5 to-muted/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Insights</p>
                <p className="text-2xl font-bold">
                  {optimizedInsights.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Psychologically Optimized Insights Display */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          Your Personalized Insights
        </h2>
        
        {optimizedInsights.map((insight) => (
          <Card 
            key={insight.id}
            className={`transition-all duration-300 hover:shadow-lg ${
              insight.priority > 80 ? 'border-l-4 border-l-primary bg-primary/5' :
              insight.priority > 60 ? 'border-l-4 border-l-accent bg-accent/5' :
              'border-l-4 border-l-muted'
            }`}
            onMouseEnter={() => handleInsightInteraction(insight.id, 'hover')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {insight.content.title || 'Insight'}
                    {insight.priority > 80 && (
                      <Badge variant="destructive" className="text-xs">
                        High Priority
                      </Badge>
                    )}
                    {insight.presentationStyle === 'highlight' && (
                      <Badge variant="secondary" className="text-xs">
                        Quick View
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Psychology Score: {insight.psychologyScore}% | 
                    Cognitive Load: {insight.cognitiveWeight > 20 ? 'Simplified' : 'Standard'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    Priority: {insight.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {insight.presentationStyle === 'highlight' && (
                <div className="p-4 bg-primary/10 rounded-lg mb-4">
                  <h4 className="font-semibold text-primary mb-2">Key Insight</h4>
                  <p className="text-sm">
                    {insight.content.summary || insight.content.content?.substring(0, 120) + '...'}
                  </p>
                </div>
              )}
              
              {insight.presentationStyle === 'detail' && (
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed">
                    {insight.content.content}
                  </p>
                  {insight.content.dataPoints && (
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      {insight.content.dataPoints.slice(0, 4).map((point: any, index: number) => (
                        <div key={index} className="p-2 bg-muted/50 rounded text-xs">
                          <span className="font-medium">{point.label}:</span> {point.value}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {insight.presentationStyle === 'summary' && (
                <div>
                  <p className="text-sm mb-3">
                    {insight.content.summary || insight.content.content?.substring(0, 200) + '...'}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleInsightInteraction(insight.id, 'detailed_view', 30)}
                  >
                    View Details
                  </Button>
                </div>
              )}

              {/* Action Buttons with Psychology Optimization */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t">
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => handleInsightInteraction(insight.id, 'primary_action')}
                  className="flex-1"
                >
                  Take Action
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleInsightInteraction(insight.id, 'save')}
                >
                  Save
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleInsightInteraction(insight.id, 'dismiss')}
                >
                  Dismiss
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Psychology Effectiveness Indicator (Subtle) */}
      {optimizedInsights.length > 0 && (
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Brain className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Your dashboard is optimized for your preferences
                </p>
                <p className="text-xs text-muted-foreground">
                  Showing {optimizedInsights.length} insights prioritized for your decision style
                </p>
              </div>
              <Badge variant="secondary" className="text-xs">
                Psychology-Enhanced
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}