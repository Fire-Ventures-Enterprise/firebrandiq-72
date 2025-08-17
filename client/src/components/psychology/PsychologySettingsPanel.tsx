import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface PsychologySettings {
  approach: string;
  emotions: string[];
  audienceSegment: string;
  intensity: string;
}

interface PsychologySettingsPanelProps {
  settings: PsychologySettings;
  onChange: (settings: PsychologySettings) => void;
  className?: string;
}

export function PsychologySettingsPanel({ settings, onChange, className }: PsychologySettingsPanelProps) {
  const psychologyApproaches = [
    { value: 'Social Proof & Trust', label: '🤝 Social Proof & Trust', description: 'Build credibility through community validation' },
    { value: 'Scarcity & Urgency', label: '⏰ Scarcity & Urgency', description: 'Drive action through time-sensitive offers' },
    { value: 'Fear & Security', label: '🛡️ Fear & Security', description: 'Address concerns and provide protection' },
    { value: 'Aspiration & Success', label: '🚀 Aspiration & Success', description: 'Inspire achievement and growth' }
  ];
  
  const targetEmotions = [
    { value: 'longing', label: 'Longing', color: 'bg-purple-100 text-purple-800' },
    { value: 'trust', label: 'Trust', color: 'bg-blue-100 text-blue-800' },
    { value: 'fear', label: 'Fear', color: 'bg-red-100 text-red-800' },
    { value: 'success', label: 'Success', color: 'bg-green-100 text-green-800' },
    { value: 'belonging', label: 'Belonging', color: 'bg-orange-100 text-orange-800' },
    { value: 'urgency', label: 'Urgency', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'curiosity', label: 'Curiosity', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'pride', label: 'Pride', color: 'bg-pink-100 text-pink-800' },
    { value: 'security', label: 'Security', color: 'bg-gray-100 text-gray-800' },
    { value: 'aspiration', label: 'Aspiration', color: 'bg-cyan-100 text-cyan-800' }
  ];
  
  const audienceSegments = [
    { value: 'security-focused', label: 'Security Focused', description: 'Risk-averse, values stability' },
    { value: 'growth-oriented', label: 'Growth Oriented', description: 'Innovation-seeking, fast decisions' },
    { value: 'efficiency-driven', label: 'Efficiency Driven', description: 'Process-focused, data-driven' }
  ];

  const intensityLevels = [
    { value: 'subtle', label: 'Subtle', description: 'Light psychological influence' },
    { value: 'moderate', label: 'Moderate', description: 'Balanced psychological approach' },
    { value: 'strong', label: 'Strong', description: 'High-impact psychological triggers' }
  ];

  const handleEmotionToggle = (emotion: string, checked: boolean) => {
    const updatedEmotions = checked
      ? [...settings.emotions, emotion]
      : settings.emotions.filter(e => e !== emotion);
    
    onChange({ ...settings, emotions: updatedEmotions });
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧠 Psychology Enhancement
          <Badge variant="secondary" className="text-xs">Premium</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Psychology Approach */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Psychology Approach</Label>
          <Select 
            value={settings.approach}
            onValueChange={(value) => onChange({ ...settings, approach: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select psychology approach" />
            </SelectTrigger>
            <SelectContent className="bg-background border z-50">
              {psychologyApproaches.map(approach => (
                <SelectItem key={approach.value} value={approach.value}>
                  <div className="flex flex-col">
                    <span>{approach.label}</span>
                    <span className="text-xs text-muted-foreground">{approach.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Target Emotions */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Target Emotions (Select 2-4)</Label>
          <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto">
            {targetEmotions.map(emotion => (
              <div key={emotion.value} className="flex items-center space-x-2">
                <Checkbox
                  id={emotion.value}
                  checked={settings.emotions.includes(emotion.value)}
                  onCheckedChange={(checked) => handleEmotionToggle(emotion.value, checked as boolean)}
                />
                <Label 
                  htmlFor={emotion.value}
                  className="text-sm cursor-pointer flex-1"
                >
                  <Badge variant="secondary" className={`${emotion.color} text-xs`}>
                    {emotion.label}
                  </Badge>
                </Label>
              </div>
            ))}
          </div>
          {settings.emotions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {settings.emotions.map(emotion => {
                const emotionData = targetEmotions.find(e => e.value === emotion);
                return emotionData ? (
                  <Badge key={emotion} variant="secondary" className={`${emotionData.color} text-xs`}>
                    {emotionData.label}
                  </Badge>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* Audience Segment */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Audience Segment</Label>
          <Select 
            value={settings.audienceSegment}
            onValueChange={(value) => onChange({ ...settings, audienceSegment: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select audience segment" />
            </SelectTrigger>
            <SelectContent className="bg-background border z-50">
              {audienceSegments.map(segment => (
                <SelectItem key={segment.value} value={segment.value}>
                  <div className="flex flex-col">
                    <span>{segment.label}</span>
                    <span className="text-xs text-muted-foreground">{segment.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Psychology Intensity */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Psychology Intensity</Label>
          <Select 
            value={settings.intensity}
            onValueChange={(value) => onChange({ ...settings, intensity: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select intensity level" />
            </SelectTrigger>
            <SelectContent className="bg-background border z-50">
              {intensityLevels.map(level => (
                <SelectItem key={level.value} value={level.value}>
                  <div className="flex flex-col">
                    <span>{level.label}</span>
                    <span className="text-xs text-muted-foreground">{level.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

export default PsychologySettingsPanel;