import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Plus, Play, Pause, BarChart3, DollarSign } from "lucide-react";

export default function Campaigns() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaign Manager</h1>
          <p className="text-muted-foreground">
            Monitor and optimize your marketing campaigns across all platforms.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Campaign Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-success">+3 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4M</div>
            <p className="text-xs text-success">+18% vs last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8%</div>
            <p className="text-xs text-success">+0.3% improvement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ad Spend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12.4K</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
          <CardDescription>Monitor your running campaigns</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              name: "Q4 Product Launch",
              platform: "Facebook & Instagram",
              budget: "$5,000",
              spent: "$3,200",
              impressions: "245K",
              clicks: "12.4K",
              status: "Active"
            },
            {
              name: "Brand Awareness Campaign",
              platform: "LinkedIn",
              budget: "$2,500",
              spent: "$1,800",
              impressions: "89K",
              clicks: "4.2K",
              status: "Active"
            },
            {
              name: "Retargeting Campaign",
              platform: "Google Ads",
              budget: "$3,000",
              spent: "$2,900",
              impressions: "156K",
              clicks: "8.7K",
              status: "Ending Soon"
            }
          ].map((campaign, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-2">
                <div className="font-medium">{campaign.name}</div>
                <div className="text-sm text-muted-foreground">{campaign.platform}</div>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>Budget: {campaign.budget}</span>
                  <span>Spent: {campaign.spent}</span>
                  <span>Impressions: {campaign.impressions}</span>
                  <span>Clicks: {campaign.clicks}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={campaign.status === "Active" ? "default" : "secondary"}>
                  {campaign.status}
                </Badge>
                <Button variant="ghost" size="sm">
                  <BarChart3 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Pause className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}