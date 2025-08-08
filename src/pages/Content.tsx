import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  PenTool, 
  Bot, 
  Megaphone, 
  Target, 
  Calendar, 
  Palette,
  Plus,
  TrendingUp,
  Eye,
  Heart
} from "lucide-react";

export default function Content() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Hub</h1>
          <p className="text-muted-foreground">
            Create, manage, and optimize your brand content with AI-powered tools.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Content
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-primary" />
              <span>AI Post Generator</span>
              <Badge className="bg-success/10 text-success">Popular</Badge>
            </CardTitle>
            <CardDescription>Generate engaging social media posts with AI</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              Generate Posts
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Megaphone className="h-5 w-5 text-orange-500" />
              <span>Ad Creator</span>
            </CardTitle>
            <CardDescription>Create high-converting ads for all platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              Create Ads
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              <span>Content Calendar</span>
            </CardTitle>
            <CardDescription>Plan and schedule your content strategy</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              View Calendar
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Content */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Content</CardTitle>
          <CardDescription>Your latest created content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              title: "Product Launch Announcement",
              type: "Social Post",
              platform: "LinkedIn",
              engagement: "1.2K",
              status: "Published"
            },
            {
              title: "Summer Sale Campaign",
              type: "Ad Creative",
              platform: "Facebook",
              engagement: "856",
              status: "Active"
            },
            {
              title: "Behind the Scenes Story",
              type: "Instagram Story",
              platform: "Instagram",
              engagement: "2.3K",
              status: "Published"
            }
          ].map((content, i) => (
            <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="font-medium">{content.title}</div>
                <div className="text-sm text-muted-foreground">
                  {content.type} • {content.platform}
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  <span>{content.engagement}</span>
                </div>
                <Badge variant="outline" className="text-success border-success">
                  {content.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}