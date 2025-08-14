import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import {
  Brain,
  Sparkles,
  TrendingUp,
  Target,
  Lightbulb,
  Calendar,
  Hash,
  AtSign,
  Image,
  Video,
  Link,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Share,
  MessageSquare,
  Eye,
  BarChart3,
  Clock,
  Globe,
  Twitter,
  Instagram,
  Linkedin,
  Facebook
} from 'lucide-react';

interface ContentSuggestion {
  id: string;
  content: string;
  platform: string;
  category: string;
  estimatedEngagement: number;
  estimatedReach: number;
  confidence: number;
  hashtags: string[];
  mediaType?: 'text' | 'image' | 'video' | 'carousel';
  optimalTime?: string;
  tone: string;
  reasoning: string;
}

interface TrendingTopic {
  id: string;
  topic: string;
  volume: number;
  category: string;
  platforms: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  growth: number;
}

const platformIcons = {
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  facebook: Facebook,
};

const platformColors = {
  twitter: 'text-blue-400 bg-blue-50 border-blue-200',
  instagram: 'text-pink-500 bg-pink-50 border-pink-200',
  linkedin: 'text-blue-600 bg-blue-50 border-blue-200',
  facebook: 'text-blue-700 bg-blue-50 border-blue-200',
};

export function ContentRecommendationEngine() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTone, setSelectedTone] = useState<string>('professional');
  const [targetAudience, setTargetAudience] = useState<string>('');
  const [businessGoals, setBusinessGoals] = useState<string>('engagement');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Mock data - in real app, this would come from AI service
  const mockSuggestions: ContentSuggestion[] = [
    {
      id: '1',
      content: '🚀 Just discovered an incredible productivity hack that saves me 2 hours daily! \n\nThe key? Time-blocking with AI-powered scheduling. Here\'s how it works:\n\n✅ AI analyzes your energy levels\n✅ Automatically schedules deep work\n✅ Blocks distractions during focus time\n\nWho else struggles with time management? Share your best tips below! 👇\n\n#Productivity #AI #TimeManagement #WorkSmarter',
      platform: 'linkedin',
      category: 'Tips & Advice',
      estimatedEngagement: 4.8,
      estimatedReach: 2500,
      confidence: 92,
      hashtags: ['#Productivity', '#AI', '#TimeManagement', '#WorkSmarter'],
      mediaType: 'image',
      optimalTime: '9:00 AM',
      tone: 'Professional & Helpful',
      reasoning: 'LinkedIn users engage 73% more with productivity content on Tuesday mornings. Question format increases comments by 45%.'
    },
    {
      id: '2',
      content: 'POV: You finally found the perfect work-life balance ⚖️✨\n\n*Shows aesthetic desk setup with plants*\n\nBut seriously, here\'s what actually works:\n\n🌱 Set boundaries (and stick to them!)\n💪 Exercise during lunch breaks\n📱 Phone-free dinners\n🧘 5-minute morning meditation\n\nWhat\'s your secret to staying balanced? Drop it in the comments! 💬\n\n#WorkLifeBalance #SelfCare #Mindfulness #Wellness',
      platform: 'instagram',
      category: 'Lifestyle',
      estimatedEngagement: 6.2,
      estimatedReach: 1800,
      confidence: 88,
      hashtags: ['#WorkLifeBalance', '#SelfCare', '#Mindfulness', '#Wellness'],
      mediaType: 'carousel',
      optimalTime: '7:30 PM',
      tone: 'Casual & Relatable',
      reasoning: 'Instagram Stories format with carousel performs 34% better. Evening posts get 2x more saves.'
    },
    {
      id: '3',
      content: 'THREAD: 5 AI tools that are quietly revolutionizing small businesses 🧵\n\n1/ Customer Service: AI chatbots now handle 80% of inquiries\n→ 24/7 support without hiring more staff\n→ Consistent, helpful responses\n→ Frees up humans for complex issues\n\n2/ Content Creation: AI writing assistants boost output 3x\n→ Blog posts in minutes, not hours\n→ Social media captions on autopilot\n→ Email campaigns that convert\n\n[Thread continues...]\n\n#SmallBusiness #AI #Automation #Entrepreneurship',
      platform: 'twitter',
      category: 'Business',
      estimatedEngagement: 5.4,
      estimatedReach: 3200,
      confidence: 90,
      hashtags: ['#SmallBusiness', '#AI', '#Automation', '#Entrepreneurship'],
      mediaType: 'text',
      optimalTime: '2:00 PM',
      tone: 'Educational & Authority',
      reasoning: 'Twitter threads about AI tools get 67% more retweets. Business content peaks at 2 PM EST.'
    }
  ];

  const mockTrendingTopics: TrendingTopic[] = [
    {
      id: '1',
      topic: 'AI Productivity Tools',
      volume: 45200,
      category: 'Technology',
      platforms: ['twitter', 'linkedin'],
      sentiment: 'positive',
      growth: 23.4
    },
    {
      id: '2',
      topic: 'Remote Work Best Practices',
      volume: 32100,
      category: 'Business',
      platforms: ['linkedin', 'facebook'],
      sentiment: 'positive',
      growth: 18.7
    },
    {
      id: '3',
      topic: 'Sustainable Business Practices',
      volume: 28900,
      category: 'Business',
      platforms: ['instagram', 'linkedin'],
      sentiment: 'positive',
      growth: 31.2
    },
    {
      id: '4',
      topic: 'Mental Health Awareness',
      volume: 67300,
      category: 'Health',
      platforms: ['instagram', 'twitter'],
      sentiment: 'positive',
      growth: 15.9
    }
  ];

  useEffect(() => {
    // Load initial data
    setSuggestions(mockSuggestions);
    setTrendingTopics(mockTrendingTopics);

    // Set up auto-refresh if enabled
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => {
        // Simulate new trending topics
        setTrendingTopics(prev => prev.map(topic => ({
          ...topic,
          volume: topic.volume + Math.floor(Math.random() * 1000)
        })));
      }, 30000); // Refresh every 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const generateNewSuggestions = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, this would call your AI service with the parameters
      const newSuggestions = mockSuggestions.map(suggestion => ({
        ...suggestion,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        estimatedEngagement: Math.max(1, suggestion.estimatedEngagement + (Math.random() - 0.5) * 2),
        estimatedReach: Math.max(100, suggestion.estimatedReach + Math.floor((Math.random() - 0.5) * 1000)),
        confidence: Math.max(50, Math.min(99, suggestion.confidence + Math.floor((Math.random() - 0.5) * 20)))
      }));
      
      setSuggestions(newSuggestions);
      
      toast({
        title: "New Suggestions Generated",
        description: `Generated ${newSuggestions.length} AI-powered content suggestions`,
      });
      
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate new suggestions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copySuggestion = (suggestion: ContentSuggestion) => {
    navigator.clipboard.writeText(suggestion.content);
    toast({
      title: "Copied to Clipboard",
      description: "Content has been copied and ready to use",
    });
  };

  const rateSuggestion = (suggestionId: string, rating: 'like' | 'dislike') => {
    // In real app, this would send feedback to improve AI
    toast({
      title: rating === 'like' ? "Thanks for the feedback!" : "Feedback Received",
      description: rating === 'like' ? "We'll generate more content like this" : "We'll improve future suggestions",
    });
  };

  const filteredSuggestions = suggestions.filter(suggestion => {
    const platformMatch = selectedPlatform === 'all' || suggestion.platform === selectedPlatform;
    const categoryMatch = selectedCategory === 'all' || suggestion.category === selectedCategory;
    return platformMatch && categoryMatch;
  });

  return (
    <div className="space-y-6" data-testid="content-recommendation-engine">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Brain className="h-6 w-6 mr-2 text-purple-600" />
            AI Content Engine
          </h2>
          <p className="text-muted-foreground">Get personalized content recommendations powered by AI</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Label htmlFor="auto-refresh" className="text-sm">Auto-refresh</Label>
            <Switch
              id="auto-refresh"
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
            />
          </div>
          <Button 
            onClick={generateNewSuggestions}
            disabled={isGenerating}
            data-testid="button-generate-suggestions"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate New
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="suggestions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
          <TabsTrigger value="trending">Trending Topics</TabsTrigger>
          <TabsTrigger value="settings">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="suggestions" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="platform-filter">Platform</Label>
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Platforms</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="category-filter">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Tips & Advice">Tips & Advice</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="tone-filter">Tone</Label>
                  <Select value={selectedTone} onValueChange={setSelectedTone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="humorous">Humorous</SelectItem>
                      <SelectItem value="inspiring">Inspiring</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="goal-filter">Goal</Label>
                  <Select value={businessGoals} onValueChange={setBusinessGoals}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engagement">Engagement</SelectItem>
                      <SelectItem value="reach">Reach</SelectItem>
                      <SelectItem value="leads">Lead Generation</SelectItem>
                      <SelectItem value="awareness">Brand Awareness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suggestions Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {filteredSuggestions.map((suggestion) => {
              const PlatformIcon = platformIcons[suggestion.platform as keyof typeof platformIcons];
              const platformColorClass = platformColors[suggestion.platform as keyof typeof platformColors];
              
              return (
                <Card key={suggestion.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge className={`${platformColorClass} border`}>
                          <PlatformIcon className="h-3 w-3 mr-1" />
                          {suggestion.platform}
                        </Badge>
                        <Badge variant="outline">{suggestion.category}</Badge>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <div className={`text-xs font-medium px-2 py-1 rounded ${
                          suggestion.confidence >= 90 ? 'bg-green-100 text-green-700' :
                          suggestion.confidence >= 75 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {suggestion.confidence}% confidence
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Content Preview */}
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{suggestion.content}</p>
                    </div>
                    
                    {/* Hashtags */}
                    {suggestion.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {suggestion.hashtags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {/* Performance Estimates */}
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-blue-600">{suggestion.estimatedEngagement}%</div>
                        <div className="text-muted-foreground">Engagement</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-green-600">{suggestion.estimatedReach.toLocaleString()}</div>
                        <div className="text-muted-foreground">Reach</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-purple-600">{suggestion.optimalTime}</div>
                        <div className="text-muted-foreground">Best Time</div>
                      </div>
                    </div>
                    
                    {/* AI Reasoning */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="text-sm font-semibold text-blue-900 mb-1 flex items-center">
                        <Lightbulb className="h-3 w-3 mr-1" />
                        AI Insight
                      </h4>
                      <p className="text-xs text-blue-700">{suggestion.reasoning}</p>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copySuggestion(suggestion)}
                          data-testid={`button-copy-${suggestion.id}`}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share className="h-3 w-3 mr-1" />
                          Schedule
                        </Button>
                      </div>
                      
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => rateSuggestion(suggestion.id, 'like')}
                          data-testid={`button-like-${suggestion.id}`}
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => rateSuggestion(suggestion.id, 'dislike')}
                          data-testid={`button-dislike-${suggestion.id}`}
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Trending Topics
              </CardTitle>
              <CardDescription>Real-time trending topics across social media platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {trendingTopics.map((topic) => (
                  <Card key={topic.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{topic.topic}</h4>
                        <Badge className={`${
                          topic.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                          topic.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {topic.sentiment}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Volume</span>
                          <span className="font-medium">{topic.volume.toLocaleString()}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Growth</span>
                          <span className="font-medium text-green-600 flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +{topic.growth}%
                          </span>
                        </div>
                        
                        <div className="flex space-x-1 mt-2">
                          {topic.platforms.map(platform => {
                            const Icon = platformIcons[platform as keyof typeof platformIcons];
                            return (
                              <Badge key={platform} variant="outline" className="text-xs">
                                <Icon className="h-3 w-3 mr-1" />
                                {platform}
                              </Badge>
                            );
                          })}
                        </div>
                        
                        <Button variant="outline" size="sm" className="w-full mt-2">
                          <Sparkles className="h-3 w-3 mr-1" />
                          Generate Content
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Preferences</CardTitle>
              <CardDescription>Customize the AI engine to match your brand and goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="target-audience">Target Audience</Label>
                  <Textarea
                    id="target-audience"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="Describe your target audience (age, interests, profession, etc.)"
                    rows={3}
                    data-testid="textarea-target-audience"
                  />
                </div>
                
                <div>
                  <Label htmlFor="brand-voice">Brand Voice</Label>
                  <Textarea
                    placeholder="Describe your brand's tone and personality"
                    rows={3}
                    data-testid="textarea-brand-voice"
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Content Preferences</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="include-hashtags">Include Hashtags</Label>
                      <p className="text-sm text-muted-foreground">Automatically suggest relevant hashtags</p>
                    </div>
                    <Switch id="include-hashtags" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="include-emojis">Include Emojis</Label>
                      <p className="text-sm text-muted-foreground">Add emojis to increase engagement</p>
                    </div>
                    <Switch id="include-emojis" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="suggest-media">Suggest Media</Label>
                      <p className="text-sm text-muted-foreground">Recommend images or videos</p>
                    </div>
                    <Switch id="suggest-media" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="optimal-timing">Optimal Timing</Label>
                      <p className="text-sm text-muted-foreground">Include best posting times</p>
                    </div>
                    <Switch id="optimal-timing" defaultChecked />
                  </div>
                </div>
              </div>
              
              <Button className="w-full">
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}