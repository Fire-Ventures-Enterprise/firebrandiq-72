import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Building2, ExternalLink, Settings, TrendingUp } from "lucide-react";

const mockBrands = [
  {
    id: "1",
    name: "TechStartup Inc",
    industry: "Technology",
    website: "techstartup.com",
    description: "Innovative SaaS solutions for modern businesses",
    stage: "Growth",
    mentions: 234,
    sentiment: 8.2,
    followers: 15400
  },
  {
    id: "2", 
    name: "Green Coffee Co",
    industry: "Food & Beverage",
    website: "greencoffee.com",
    description: "Sustainable coffee roasting and retail",
    stage: "Established",
    mentions: 156,
    sentiment: 7.8,
    followers: 8900
  },
  {
    id: "3",
    name: "Fitness First",
    industry: "Health & Fitness", 
    website: "fitnessfirst.com",
    description: "Premium fitness and wellness center",
    stage: "Startup",
    mentions: 89,
    sentiment: 8.5,
    followers: 5200
  }
];

export default function Brands() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brands</h1>
          <p className="text-muted-foreground">
            Manage your brands and track their performance
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Brand
        </Button>
      </div>

      {/* Brand Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockBrands.map((brand) => (
          <Card key={brand.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{brand.name}</CardTitle>
                    <CardDescription>{brand.industry}</CardDescription>
                  </div>
                </div>
                <Badge variant="outline">{brand.stage}</Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{brand.description}</p>
              
              <div className="flex items-center gap-2 text-sm">
                <ExternalLink className="h-4 w-4" />
                <span className="text-primary">{brand.website}</span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-lg font-semibold">{brand.mentions}</div>
                  <div className="text-xs text-muted-foreground">Mentions</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{brand.sentiment}/10</div>
                  <div className="text-xs text-muted-foreground">Sentiment</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold">{(brand.followers / 1000).toFixed(1)}K</div>
                  <div className="text-xs text-muted-foreground">Followers</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}