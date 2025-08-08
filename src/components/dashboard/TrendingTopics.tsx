import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Hash, TrendingUp, TrendingDown, Eye } from "lucide-react";

interface Topic {
  id: string;
  keyword: string;
  mentions: number;
  change: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  category: string;
}

const trendingTopics: Topic[] = [
  {
    id: '1',
    keyword: 'customer support',
    mentions: 234,
    change: 45,
    sentiment: 'positive',
    category: 'Service'
  },
  {
    id: '2',
    keyword: 'new feature',
    mentions: 189,
    change: 78,
    sentiment: 'positive',
    category: 'Product'
  },
  {
    id: '3',
    keyword: 'pricing',
    mentions: 156,
    change: -12,
    sentiment: 'neutral',
    category: 'Business'
  },
  {
    id: '4',
    keyword: 'UI design',
    mentions: 143,
    change: 23,
    sentiment: 'positive',
    category: 'Design'
  },
  {
    id: '5',
    keyword: 'integration',
    mentions: 98,
    change: 34,
    sentiment: 'neutral',
    category: 'Technical'
  },
  {
    id: '6',
    keyword: 'mobile app',
    mentions: 87,
    change: -8,
    sentiment: 'negative',
    category: 'Product'
  }
];

export default function TrendingTopics() {
  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-3 w-3 text-success" />;
    return <TrendingDown className="h-3 w-3 text-destructive" />;
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-success';
      case 'negative': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Service': 'bg-blue-100 text-blue-700 border-blue-200',
      'Product': 'bg-green-100 text-green-700 border-green-200',
      'Business': 'bg-purple-100 text-purple-700 border-purple-200',
      'Design': 'bg-pink-100 text-pink-700 border-pink-200',
      'Technical': 'bg-orange-100 text-orange-700 border-orange-200'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Hash className="h-5 w-5 text-primary" />
          <span>Trending Topics</span>
          <Badge variant="outline" className="ml-auto">Live</Badge>
        </CardTitle>
        <CardDescription>Most discussed topics related to your brand</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {trendingTopics.map((topic, index) => (
          <div key={topic.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="text-sm font-bold text-muted-foreground">#{index + 1}</div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm">{topic.keyword}</span>
                  <Badge variant="outline" className={getCategoryColor(topic.category)}>
                    {topic.category}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {topic.mentions} mentions
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                {getTrendIcon(topic.change)}
                <span className={`text-xs font-medium ${topic.change > 0 ? 'text-success' : 'text-destructive'}`}>
                  {topic.change > 0 ? '+' : ''}{topic.change}%
                </span>
              </div>
              
              <div className={`w-2 h-2 rounded-full ${getSentimentColor(topic.sentiment).replace('text-', 'bg-')}`} />
              
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Eye className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}

        <div className="pt-3 border-t">
          <Button variant="outline" className="w-full">
            <Hash className="h-4 w-4 mr-2" />
            View All Topics
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}