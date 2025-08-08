import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Filter, ExternalLink, MessageSquare, Calendar } from "lucide-react";

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
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brand Mentions</h1>
          <p className="text-muted-foreground">
            Monitor what people are saying about your brand across the web
          </p>
        </div>
        <Button>
          <Search className="h-4 w-4 mr-2" />
          Search New Mentions
        </Button>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input 
                placeholder="Search mentions..." 
                className="w-full"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mentions Feed */}
      <div className="space-y-4">
        {mockMentions.map((mention) => (
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
                    <Button variant="ghost" size="sm">
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
                    <Button variant="outline" size="sm">
                      Reply
                    </Button>
                    <Button variant="outline" size="sm">
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