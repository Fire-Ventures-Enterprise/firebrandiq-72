import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Zap, Heart } from 'lucide-react';

interface PsychologyResults {
  psychologyScore: {
    overall: number;
    breakdown: Record<string, number>;
  };
  engagementPrediction: {
    predicted: number;
    confidence: number;
  };
  conversionPotential: number;
  emotionalResonance: number;
}

interface PsychologyResultsDisplayProps {
  results: PsychologyResults;
  content?: string;
  className?: string;
}

export function PsychologyResultsDisplay({ results, content, className }: PsychologyResultsDisplayProps) {
  if (!results) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const principles = [
    { key: 'specialization', label: 'Specialization', icon: '🎯', description: 'Expertise focus' },
    { key: 'differentiation', label: 'Differentiation', icon: '✨', description: 'Unique positioning' },
    { key: 'segmentation', label: 'Segmentation', icon: '👥', description: 'Audience targeting' },
    { key: 'concentration', label: 'Concentration', icon: '🔥', description: 'Impact focus' }
  ];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📊 Psychology Performance Analytics
          <Badge variant="secondary" className="text-xs">Real-time</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <div className={`text-3xl font-bold ${getScoreColor(results.psychologyScore?.overall || 0)}`}>
              {results.psychologyScore?.overall || 0}%
            </div>
            <div className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
              <Target className="w-3 h-3" />
              Psychology Score
            </div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <div className="text-3xl font-bold text-green-600">
              +{results.engagementPrediction?.predicted || 0}%
            </div>
            <div className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Engagement Boost
            </div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">
              {results.conversionPotential || 0}x
            </div>
            <div className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
              <Zap className="w-3 h-3" />
              Conversion Rate
            </div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
            <div className="text-3xl font-bold text-orange-600">
              {results.emotionalResonance || 0}%
            </div>
            <div className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
              <Heart className="w-3 h-3" />
              Emotional Impact
            </div>
          </div>
        </div>

        {/* Psychology Principle Breakdown */}
        {results.psychologyScore?.breakdown && (
          <div className="space-y-4">
            <h5 className="font-semibold text-sm flex items-center gap-2">
              🧠 Psychology Principle Analysis
              <Badge variant="outline" className="text-xs">
                {results.engagementPrediction?.confidence || 0}% confidence
              </Badge>
            </h5>
            <div className="space-y-3">
              {principles.map(principle => {
                const score = results.psychologyScore.breakdown[principle.key] || 0;
                const percentage = Math.round(score * 100);
                
                return (
                  <div key={principle.key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{principle.icon}</span>
                        <div>
                          <span className="text-sm font-medium">{principle.label}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {principle.description}
                          </span>
                        </div>
                      </div>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getScoreBadgeColor(percentage)}`}
                      >
                        {percentage}%
                      </Badge>
                    </div>
                    <Progress 
                      value={percentage} 
                      className="h-2"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Performance Predictions */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
          <h6 className="font-medium text-sm mb-3 flex items-center gap-2">
            🔮 Performance Predictions
          </h6>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                +{Math.round((results.engagementPrediction?.predicted || 0) * 1.2)}%
              </div>
              <div className="text-xs text-muted-foreground">Likes & Comments</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                +{Math.round((results.engagementPrediction?.predicted || 0) * 0.8)}%
              </div>
              <div className="text-xs text-muted-foreground">Shares & Saves</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                +{Math.round((results.conversionPotential || 0) * 25)}%
              </div>
              <div className="text-xs text-muted-foreground">Click-through Rate</div>
            </div>
          </div>
        </div>

        {/* Psychology Enhancement Indicator */}
        <div className="flex items-center justify-center pt-2">
          <Badge variant="outline" className="text-xs text-muted-foreground">
            ✨ Psychology-Enhanced Content • FirebrandIQ Premium
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default PsychologyResultsDisplay;