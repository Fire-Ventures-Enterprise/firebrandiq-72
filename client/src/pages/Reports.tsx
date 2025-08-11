import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range";
import { Download, FileText, Calendar, Send, Eye, Trash2, Plus, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Report {
  id: string;
  name: string;
  type: 'sentiment' | 'competitor' | 'performance' | 'custom';
  frequency: 'daily' | 'weekly' | 'monthly' | 'one-time';
  status: 'active' | 'draft' | 'completed';
  lastGenerated: string;
  nextDue: string;
  recipients: string[];
}

const mockReports: Report[] = [
  {
    id: '1',
    name: 'Weekly Brand Performance Report',
    type: 'performance',
    frequency: 'weekly',
    status: 'active',
    lastGenerated: '2024-01-08',
    nextDue: '2024-01-15',
    recipients: ['team@firebrandiq.com', 'marketing@company.com']
  },
  {
    id: '2',
    name: 'Monthly Sentiment Analysis',
    type: 'sentiment',
    frequency: 'monthly',
    status: 'active',
    lastGenerated: '2024-01-01',
    nextDue: '2024-02-01',
    recipients: ['ceo@company.com']
  },
  {
    id: '3',
    name: 'Competitor Analysis Q1',
    type: 'competitor',
    frequency: 'one-time',
    status: 'completed',
    lastGenerated: '2024-01-05',
    nextDue: 'N/A',
    recipients: ['strategy@company.com']
  },
  {
    id: '4',
    name: 'Custom Campaign Report',
    type: 'custom',
    frequency: 'daily',
    status: 'draft',
    lastGenerated: 'Never',
    nextDue: 'Not scheduled',
    recipients: []
  }
];

const reportTemplates = [
  {
    id: 'sentiment',
    name: 'Sentiment Analysis Report',
    description: 'Comprehensive sentiment tracking across all platforms',
    sections: ['Executive Summary', 'Sentiment Trends', 'Platform Breakdown', 'Key Insights']
  },
  {
    id: 'performance',
    name: 'Brand Performance Report',
    description: 'Overall brand performance metrics and KPIs',
    sections: ['Performance Overview', 'Engagement Metrics', 'Growth Analysis', 'Recommendations']
  },
  {
    id: 'competitor',
    name: 'Competitor Analysis Report',
    description: 'Detailed competitor comparison and market analysis',
    sections: ['Market Share', 'Competitive Positioning', 'Strategy Analysis', 'Opportunities']
  },
  {
    id: 'custom',
    name: 'Custom Report',
    description: 'Build your own report with selected metrics',
    sections: ['Custom Sections', 'Selected Metrics', 'Custom Analysis']
  }
];

export default function Reports() {
  const { toast } = useToast();
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [reportName, setReportName] = useState("");
  const [reportFrequency, setReportFrequency] = useState("");
  const [recipients, setRecipients] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredReports = reports.filter(report => 
    filterStatus === "all" || report.status === filterStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'draft': return 'secondary';
      case 'completed': return 'outline';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sentiment': return '💭';
      case 'performance': return '📊';
      case 'competitor': return '🎯';
      case 'custom': return '⚙️';
      default: return '📄';
    }
  };

  const handleCreateReport = () => {
    if (!reportName.trim() || !selectedTemplate || !reportFrequency) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newReport: Report = {
      id: Date.now().toString(),
      name: reportName,
      type: selectedTemplate as any,
      frequency: reportFrequency as any,
      status: 'draft',
      lastGenerated: 'Never',
      nextDue: 'Not scheduled',
      recipients: recipients.split(',').map(email => email.trim()).filter(email => email)
    };

    setReports([...reports, newReport]);
    setReportName("");
    setSelectedTemplate("");
    setReportFrequency("");
    setRecipients("");
    setDialogOpen(false);

    toast({
      title: "Report Created",
      description: `"${reportName}" has been created and saved as draft.`,
    });
  };

  const handleGenerateReport = (id: string) => {
    const report = reports.find(r => r.id === id);
    toast({
      title: "Generating Report",
      description: `"${report?.name}" is being generated. You'll receive it via email shortly.`,
    });
  };

  const handleDownloadReport = (id: string, format: string) => {
    const report = reports.find(r => r.id === id);
    toast({
      title: "Download Started",
      description: `Downloading "${report?.name}" as ${format.toUpperCase()}.`,
    });
  };

  const handleDeleteReport = (id: string) => {
    const report = reports.find(r => r.id === id);
    setReports(reports.filter(r => r.id !== id));
    toast({
      title: "Report Deleted",
      description: `"${report?.name}" has been removed.`,
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            Generate, schedule, and manage your brand intelligence reports
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Report</DialogTitle>
                <DialogDescription>
                  Set up a new report template and schedule
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Report Name</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Weekly Performance Report"
                      value={reportName}
                      onChange={(e) => setReportName(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select value={reportFrequency} onValueChange={setReportFrequency}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="one-time">One-time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Report Template</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {reportTemplates.map((template) => (
                      <Card 
                        key={template.id}
                        className={`cursor-pointer transition-colors ${
                          selectedTemplate === template.id ? 'ring-2 ring-primary' : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center">
                            <span className="mr-2">{getTypeIcon(template.id)}</span>
                            {template.name}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {template.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-2">
                          <div className="text-xs text-muted-foreground">
                            Sections: {template.sections.length}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="recipients">Email Recipients</Label>
                  <Textarea
                    id="recipients"
                    placeholder="Enter email addresses separated by commas"
                    value={recipients}
                    onChange={(e) => setRecipients(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateReport}>
                    Create Report
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.filter(r => r.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">Scheduled reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Generated This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Reports delivered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recipients</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {reports.reduce((sum, r) => sum + r.recipients.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Email addresses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.filter(r => r.status === 'draft').length}</div>
            <p className="text-xs text-muted-foreground">Pending setup</p>
          </CardContent>
        </Card>
      </div>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Reports</CardTitle>
          <CardDescription>Manage and generate your brand intelligence reports</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Generated</TableHead>
                <TableHead>Next Due</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <span>{getTypeIcon(report.type)}</span>
                      <span>{report.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {report.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">{report.frequency}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(report.status) as any}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {report.lastGenerated}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {report.nextDue}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {report.recipients.length} recipients
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleGenerateReport(report.id)}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadReport(report.id, 'pdf')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteReport(report.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredReports.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No reports found matching your filter.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}