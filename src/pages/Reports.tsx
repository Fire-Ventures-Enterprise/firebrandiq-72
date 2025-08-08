import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Download, Plus, FileText, TrendingUp } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

const mockReports = [
  {
    id: "1",
    name: "Monthly Brand Performance",
    description: "Comprehensive overview of brand metrics and performance",
    type: "Monthly",
    lastGenerated: "2024-01-15",
    status: "ready"
  },
  {
    id: "2", 
    name: "Social Media Analytics",
    description: "Deep dive into social media engagement and growth",
    type: "Weekly",
    lastGenerated: "2024-01-10",
    status: "ready"
  },
  {
    id: "3",
    name: "Competitor Benchmark",
    description: "Analysis of competitive landscape and positioning",
    type: "Quarterly",
    lastGenerated: "2024-01-01",
    status: "generating"
  },
  {
    id: "4",
    name: "Brand Mention Summary", 
    description: "Summary of brand mentions and sentiment analysis",
    type: "Weekly",
    lastGenerated: "2024-01-12",
    status: "ready"
  }
];

export default function Reports() {
  const [date, setDate] = useState<Date>();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Generate and download comprehensive brand analysis reports
          </p>
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {date ? format(date, "PPP") : "Select date range"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Report
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Quick Summary</h3>
                <p className="text-sm text-muted-foreground">Last 30 days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-success/10 rounded-lg">
                <FileText className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="font-semibold">Full Analysis</h3>
                <p className="text-sm text-muted-foreground">Detailed report</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-warning/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold">Competitor Report</h3>
                <p className="text-sm text-muted-foreground">Market analysis</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-destructive/10 rounded-lg">
                <FileText className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold">Custom Report</h3>
                <p className="text-sm text-muted-foreground">Build your own</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report History */}
      <Card>
        <CardHeader>
          <CardTitle>Report History</CardTitle>
          <CardDescription>Previously generated reports and scheduled reports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockReports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-muted rounded-lg">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{report.name}</h3>
                  <p className="text-sm text-muted-foreground">{report.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                    <span>Type: {report.type}</span>
                    <span>•</span>
                    <span>Last generated: {new Date(report.lastGenerated).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Badge 
                  variant={report.status === 'ready' ? 'default' : 'secondary'}
                >
                  {report.status}
                </Badge>
                {report.status === 'ready' && (
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}