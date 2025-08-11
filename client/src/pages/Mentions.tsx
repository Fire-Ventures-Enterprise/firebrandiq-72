import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, ExternalLink, MessageSquare, Calendar, Brain, TrendingUp, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import { AIService, BrandMention } from "@/services/aiService";
import { useInteractiveActions } from "@/hooks/useInteractiveActions";
import { useToast } from "@/hooks/use-toast";

const mockMentions = [
  {
    id: "1",
    title: "Amazing customer service experience!",
    snippet: "Just had the best customer service experience with TechStartup Inc. Their support team went above and beyond...",
    source: "twitter.com",
    domain: "Twitter",
    sentiment: "positive",
    type: "social",
    date: "2024-01-15T10:30:00Z",
    domainAuthority: 95
  },
  {
    id: "2", 
    title: "TechStartup Inc Review - Worth the Investment?",
    snippet: "After using TechStartup Inc for 6 months, here's my honest review. The platform has some great features but...",
    source: "techreview.com",
    domain: "Tech Review",
    sentiment: "neutral",
    type: "review",
    date: "2024-01-14T15:20:00Z",
    domainAuthority: 67
  },
  {
    id: "3",
    title: "Startup Spotlight: TechStartup Inc",
    snippet: "TechStartup Inc is revolutionizing the SaaS industry with their innovative approach to business solutions...",
    source: "startupnews.com", 
    domain: "Startup News",
    sentiment: "positive",
    type: "news",
    date: "2024-01-13T09:15:00Z",
    domainAuthority: 78
  },
  {
    id: "4",
    title: "Issues with recent update",
    snippet: "Has anyone else experienced problems with TechStartup Inc's latest update? The new interface seems buggy...",
    source: "reddit.com",
    domain: "Reddit",
    sentiment: "negative", 
    type: "forum",
    date: "2024-01-12T14:45:00Z",
    domainAuthority: 91
  }
];

const getSentimentColor = (sentiment: string) => {
  switch (sentiment) {
    case 'positive': return 'bg-success text-success-foreground';
    case 'negative': return 'bg-destructive text-destructive-foreground';
    default: return 'bg-secondary text-secondary-foreground';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'social': return '📱';
    case 'news': return '📰';
    case 'review': return '⭐';
    case 'forum': return '💬';
    default: return '📄';
  }
};

export default function Mentions() {
  const [mentions, setMentions] = useState(mockMentions);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentSummary, setSentimentSummary] = useState<any>(null);
  const { handleReply, handleSave, handleExternalLink } = useInteractiveActions();
  const { toast } = useToast();

  useEffect(() => {
    loadSentimentSummary();
  }, []);

  const loadSentimentSummary = async () => {
    // Calculate sentiment summary from mentions
    const positive = mentions.filter(m => m.sentiment === 'positive').length;
    const negative = mentions.filter(m => m.sentiment === 'negative').length;
    const neutral = mentions.filter(m => m.sentiment === 'neutral').length;
    const total = mentions.length;

    setSentimentSummary({
      positive: Math.round((positive / total) * 100),
      negative: Math.round((negative / total) * 100),
      neutral: Math.round((neutral / total) * 100),
      totalMentions: total,
      averageScore: 7.2 // Mock average sentiment score
    });
  };

  const analyzeMentionSentiment = async (mentionText: string) => {
    setLoading(true);
    try {
      toast({
        title: "AI Analysis Starting",
        description: "Analyzing mention sentiment...",
      });
      const sentiment = await AIService.analyzeSentiment(mentionText);
      toast({
        title: "Analysis Complete",
        description: "Sentiment analysis has been completed successfully",
      });
      console.log('Sentiment analysis:', sentiment);
    } catch (error) {
      console.error('Failed to analyze sentiment:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to complete sentiment analysis",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredMentions = mentions.filter(mention => 
    mention.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mention.snippet.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brand Mentions</h1>
          <p className="text-muted-foreground">
            AI-powered mention monitoring and sentiment analysis
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => analyzeMentionSentiment("Overall brand sentiment analysis")}>
            <Brain className="h-4 w-4 mr-2" />
            AI Analysis
          </Button>
          <Button onClick={() => setSearchQuery("")}>
            <Search className="h-4 w-4 mr-2" />
            Search New
          </Button>
        </div>
      </div>

      {/* Sentiment Summary */}
      {sentimentSummary && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Sentiment Overview
            </CardTitle>
            <CardDescription>
              Real-time sentiment analysis of brand mentions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-700">
                  {sentimentSummary.positive}%
                </div>
                <div className="text-sm text-green-600">Positive</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-700">
                  {sentimentSummary.neutral}%
                </div>
                <div className="text-sm text-gray-600">Neutral</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-700">
                  {sentimentSummary.negative}%
                </div>
                <div className="text-sm text-red-600">Negative</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">
                  {sentimentSummary.averageScore}
                </div>
                <div className="text-sm text-blue-600">Avg Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters & Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input 
                placeholder="Search mentions..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline" onClick={() => analyzeMentionSentiment("Generate insights from all mentions")}>
              <Brain className="h-4 w-4 mr-2" />
              AI Insights
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mentions Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Mentions</h2>
          <Badge variant="outline" className="text-primary">
            {filteredMentions.length} mentions
          </Badge>
        </div>
        
        {filteredMentions.map((mention) => (
          <Card key={mention.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getTypeIcon(mention.type)}</span>
                    <div>
                      <h3 className="font-semibold text-lg">{mention.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{mention.domain}</span>
                        <span>•</span>
                        <span>DA: {mention.domainAuthority}</span>
                        <span>•</span>
                        <span>{new Date(mention.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge className={getSentimentColor(mention.sentiment)}>
                      {mention.sentiment}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => handleExternalLink(mention.source)}>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <p className="text-muted-foreground">{mention.snippet}</p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{mention.type}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(mention.date).toLocaleTimeString()}</span>
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => analyzeMentionSentiment(mention.snippet)}
                      disabled={loading}
                    >
                      <Brain className="h-3 w-3 mr-1" />
                      Analyze
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleReply(mention.id)}>
                      Reply
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleSave(mention.id)}>
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}