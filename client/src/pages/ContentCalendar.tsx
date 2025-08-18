import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";

export default function ContentCalendar() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Calendar</h1>
          <p className="text-muted-foreground">
            Plan and schedule your content across all platforms.
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Post
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Content Calendar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Content Calendar Coming Soon</h3>
            <p className="text-muted-foreground">
              Visual calendar interface for scheduling and managing your content.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}