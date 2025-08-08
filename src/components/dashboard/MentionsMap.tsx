import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, TrendingUp } from "lucide-react";

interface LocationData {
  country: string;
  mentions: number;
  sentiment: number;
  coordinates: [number, number];
}

const locationData: LocationData[] = [
  { country: 'United States', mentions: 1247, sentiment: 0.3, coordinates: [39.8283, -98.5795] },
  { country: 'United Kingdom', mentions: 342, sentiment: 0.5, coordinates: [55.3781, -3.4360] },
  { country: 'Canada', mentions: 189, sentiment: 0.2, coordinates: [56.1304, -106.3468] },
  { country: 'Germany', mentions: 156, sentiment: 0.4, coordinates: [51.1657, 10.4515] },
  { country: 'Australia', mentions: 98, sentiment: 0.6, coordinates: [-25.2744, 133.7751] }
];

export default function MentionsMap() {
  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 0.4) return 'text-success';
    if (sentiment >= 0) return 'text-warning';
    return 'text-destructive';
  };

  const getSentimentBadge = (sentiment: number) => {
    if (sentiment >= 0.4) return 'bg-success/10 text-success border-success/20';
    if (sentiment >= 0) return 'bg-warning/10 text-warning border-warning/20';
    return 'bg-destructive/10 text-destructive border-destructive/20';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-primary" />
          <span>Global Mentions</span>
        </CardTitle>
        <CardDescription>Geographic distribution of brand mentions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Simplified map representation */}
        <div className="bg-muted/30 rounded-lg p-6 relative overflow-hidden">
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-primary">2,032</div>
            <div className="text-sm text-muted-foreground">Total Global Mentions</div>
          </div>
          
          {/* Map dots simulation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-8 opacity-20">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-primary rounded-full animate-pulse" 
                     style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        </div>

        {/* Location breakdown */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Top Locations</h4>
          {locationData.map((location, index) => (
            <div key={location.country} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="text-lg font-bold text-muted-foreground">#{index + 1}</div>
                <div>
                  <div className="font-medium text-sm">{location.country}</div>
                  <div className="text-xs text-muted-foreground flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{location.mentions} mentions</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge className={getSentimentBadge(location.sentiment)}>
                  {location.sentiment > 0 ? '+' : ''}{(location.sentiment * 100).toFixed(0)}%
                </Badge>
                <TrendingUp className={`h-4 w-4 ${getSentimentColor(location.sentiment)}`} />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Updated 5 minutes ago</span>
            <span>Covering 47 countries</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}