import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Megaphone, Zap, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdCreator() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ad Creator</h1>
          <p className="text-muted-foreground">
            Create high-converting ads with AI-powered optimization.
          </p>
        </div>
        <Button>
          <Zap className="h-4 w-4 mr-2" />
          Create Ad
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              Facebook Ads
              <Badge variant="secondary">Popular</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Megaphone className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-sm">Create Facebook ad campaigns</p>
              <Button variant="outline" className="mt-4">Create</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Google Ads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Target className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-sm">Create Google ad campaigns</p>
              <Button variant="outline" className="mt-4">Create</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>LinkedIn Ads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="w-8 h-8 bg-blue-600 rounded mx-auto mb-2"></div>
              <p className="text-muted-foreground text-sm">Create LinkedIn ad campaigns</p>
              <Button variant="outline" className="mt-4">Create</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}