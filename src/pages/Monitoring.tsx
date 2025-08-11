import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, Filter, Edit, Trash2, Play, Pause, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MonitoringKeyword {
  id: string;
  keyword: string;
  platforms: string[];
  status: 'active' | 'paused' | 'pending';
  mentions: number;
  lastUpdate: string;
  sentiment: number;
}

const mockKeywords: MonitoringKeyword[] = [
  {
    id: '1',
    keyword: 'FirebrandIQ',
    platforms: ['Twitter', 'Instagram', 'Facebook'],
    status: 'active',
    mentions: 247,
    lastUpdate: '2 min ago',
    sentiment: 85
  },
  {
    id: '2',
    keyword: '@firebrandiq',
    platforms: ['Twitter', 'TikTok'],
    status: 'active',
    mentions: 89,
    lastUpdate: '5 min ago',
    sentiment: 92
  },
  {
    id: '3',
    keyword: 'brand intelligence',
    platforms: ['LinkedIn', 'YouTube'],
    status: 'paused',
    mentions: 156,
    lastUpdate: '1 hour ago',
    sentiment: 78
  },
  {
    id: '4',
    keyword: 'social media analytics',
    platforms: ['Instagram', 'Facebook', 'Twitter'],
    status: 'pending',
    mentions: 0,
    lastUpdate: 'Never',
    sentiment: 0
  }
];

const platforms = [
  { id: 'twitter', name: 'Twitter/X', icon: '🐦' },
  { id: 'instagram', name: 'Instagram', icon: '📷' },
  { id: 'facebook', name: 'Facebook', icon: '👥' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
  { id: 'youtube', name: 'YouTube', icon: '📺' },
  { id: 'tiktok', name: 'TikTok', icon: '🎵' },
  { id: 'reddit', name: 'Reddit', icon: '🔶' },
  { id: 'news', name: 'News Sites', icon: '📰' }
];

export default function Monitoring() {
  const { toast } = useToast();
  const [keywords, setKeywords] = useState<MonitoringKeyword[]>(mockKeywords);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [newKeyword, setNewKeyword] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredKeywords = keywords.filter(keyword => {
    const matchesSearch = keyword.keyword.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || keyword.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'paused': return <Pause className="h-4 w-4 text-warning" />;
      case 'pending': return <Clock className="h-4 w-4 text-muted-foreground" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'secondary';
      case 'pending': return 'outline';
      default: return 'outline';
    }
  };

  const handleAddKeyword = () => {
    if (!newKeyword.trim() || selectedPlatforms.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a keyword and select at least one platform.",
        variant: "destructive"
      });
      return;
    }

    const keyword: MonitoringKeyword = {
      id: Date.now().toString(),
      keyword: newKeyword,
      platforms: selectedPlatforms,
      status: 'pending',
      mentions: 0,
      lastUpdate: 'Never',
      sentiment: 0
    };

    setKeywords([...keywords, keyword]);
    setNewKeyword("");
    setSelectedPlatforms([]);
    setDialogOpen(false);

    toast({
      title: "Keyword Added",
      description: `Now monitoring "${newKeyword}" across ${selectedPlatforms.length} platforms.`,
    });
  };

  const toggleKeywordStatus = (id: string) => {
    setKeywords(keywords.map(keyword => {
      if (keyword.id === id) {
        const newStatus = keyword.status === 'active' ? 'paused' : 'active';
        toast({
          title: `Monitoring ${newStatus === 'active' ? 'Resumed' : 'Paused'}`,
          description: `"${keyword.keyword}" is now ${newStatus}.`,
        });
        return { ...keyword, status: newStatus as any };
      }
      return keyword;
    }));
  };

  const deleteKeyword = (id: string) => {
    const keyword = keywords.find(k => k.id === id);
    setKeywords(keywords.filter(k => k.id !== id));
    toast({
      title: "Keyword Deleted",
      description: `"${keyword?.keyword}" has been removed from monitoring.`,
    });
  };

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Brand Monitoring</h1>
          <p className="text-muted-foreground">
            Set up and manage your brand monitoring keywords across social platforms
          </p>
        </div>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Keyword
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Monitoring Keyword</DialogTitle>
              <DialogDescription>
                Set up a new keyword to monitor across social platforms
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="keyword">Keyword or Phrase</Label>
                <Input
                  id="keyword"
                  placeholder="e.g., @yourbrand, your product name"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                />
              </div>
              
              <div>
                <Label>Select Platforms</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {platforms.map((platform) => (
                    <div key={platform.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={platform.id}
                        checked={selectedPlatforms.includes(platform.id)}
                        onCheckedChange={() => handlePlatformToggle(platform.id)}
                      />
                      <Label htmlFor={platform.id} className="text-sm">
                        {platform.icon} {platform.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddKeyword}>
                  Add Keyword
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Keywords</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{keywords.filter(k => k.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">Currently monitoring</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Mentions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{keywords.reduce((sum, k) => sum + k.mentions, 0)}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Sentiment</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(keywords.reduce((sum, k) => sum + k.sentiment, 0) / keywords.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Positive sentiment</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Monitoring Keywords</CardTitle>
          <CardDescription>Manage your brand monitoring keywords and settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead>Platforms</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Mentions</TableHead>
                <TableHead>Sentiment</TableHead>
                <TableHead>Last Update</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredKeywords.map((keyword) => (
                <TableRow key={keyword.id}>
                  <TableCell className="font-medium">{keyword.keyword}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {keyword.platforms.map((platform) => (
                        <Badge key={platform} variant="outline" className="text-xs">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(keyword.status)}
                      <Badge variant={getStatusColor(keyword.status) as any}>
                        {keyword.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{keyword.mentions}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm">{keyword.sentiment}%</div>
                      <div className={`w-12 h-2 rounded-full ${
                        keyword.sentiment >= 70 ? 'bg-success' :
                        keyword.sentiment >= 50 ? 'bg-warning' : 'bg-destructive'
                      }`} />
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {keyword.lastUpdate}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeywordStatus(keyword.id)}
                      >
                        {keyword.status === 'active' ? 
                          <Pause className="h-4 w-4" /> : 
                          <Play className="h-4 w-4" />
                        }
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteKeyword(keyword.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredKeywords.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No keywords found matching your search.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}