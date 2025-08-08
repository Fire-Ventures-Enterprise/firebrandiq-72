import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, Users, MessageSquare, Building2 } from "lucide-react";

const mockCompetitors = [
  {
    id: "1",
    name: "CompetitorCorp",
    website: "competitorcorp.com",
    industry: "Technology",
    followers: 23400,
    mentions: 456,
    sentiment: 7.8,
    marketShare: "15%"
  },
  {
    id: "2",
    name: "RivalTech",
    website: "rivaltech.com", 
    industry: "Technology",
    followers: 18900,
    mentions: 234,
    sentiment: 7.2,
    marketShare: "12%"
  },
  {
    id: "3",
    name: "InnovateSoft",
    website: "innovatesoft.com",
    industry: "Technology", 
    followers: 15600,
    mentions: 189,
    sentiment: 8.1,
    marketShare: "8%"
  }
];

export default function Competitors() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Competitors</h1>
          <p className="text-muted-foreground">
            Track and analyze your competitors' performance
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Competitor
        </Button>
      </div>

      {/* Competitor Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockCompetitors.map((competitor) => (
          <Card key={competitor.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{competitor.name}</CardTitle>
                    <CardDescription>{competitor.website}</CardDescription>
                  </div>
                </div>
                <Badge variant="outline">{competitor.marketShare}</Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-semibold">{(competitor.followers / 1000).toFixed(1)}K</div>
                  <div className="text-xs text-muted-foreground">Followers</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-semibold">{competitor.mentions}</div>
                  <div className="text-xs text-muted-foreground">Mentions</div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="text-center p-3 bg-muted/50 rounded-lg w-full">
                  <div className="text-lg font-semibold">{competitor.sentiment}/10</div>
                  <div className="text-xs text-muted-foreground">Sentiment Score</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Compare
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Mentions
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Competitive Analysis */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Market Position</CardTitle>
            <CardDescription>Your position vs competitors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">TechStartup Inc (You)</span>
                <Badge variant="default">22%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>CompetitorCorp</span>
                <Badge variant="outline">15%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>RivalTech</span>
                <Badge variant="outline">12%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>InnovateSoft</span>
                <Badge variant="outline">8%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Comparison</CardTitle>
            <CardDescription>Key metrics vs competitors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Social Followers</span>
                  <span className="text-success">Leading</span>
                </div>
                <div className="text-xs text-muted-foreground">45.2K vs avg 19.3K</div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Brand Mentions</span>
                  <span className="text-warning">Average</span>
                </div>
                <div className="text-xs text-muted-foreground">1,234 vs avg 1,156</div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Sentiment Score</span>
                  <span className="text-success">Leading</span>
                </div>
                <div className="text-xs text-muted-foreground">8.2 vs avg 7.7</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}