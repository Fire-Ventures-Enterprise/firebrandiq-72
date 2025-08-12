import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Bot, Wand2, Copy, Download, Sparkles, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ContentGenerationService, GeneratedContent } from "@/services/contentGeneration";

export default function ContentGenerator() {
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState({
    brandName: '',
    industry: '',
    tone: 'professional' as const,
    topics: '',
    platform: '',
    contentType: 'social_posts',
    objective: ''
  });

  const handleGenerate = async () => {
    if (!formData.brandName || !formData.industry) {
      toast.error("Please fill in brand name and industry");
      return;
    }

    setLoading(true);
    try {
      const topics = formData.topics.split(',').map(t => t.trim()).filter(Boolean);
      
      let content: GeneratedContent[] = [];
      
      if (formData.contentType === 'social_posts') {
        content = await ContentGenerationService.generateSocialPosts(
          formData.brandName,
          formData.industry,
          formData.tone,
          topics,
          formData.platform
        );
      }
      
      setGeneratedContent(content);
      // Select all posts by default
      setSelectedPosts(new Set(content.map(c => c.id)));
      toast.success(`Generated ${content.length} pieces of content!`);
    } catch (error) {
      console.error('Generation error:', error);
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const togglePostSelection = (postId: string) => {
    setSelectedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedPosts.size === generatedContent.length) {
      setSelectedPosts(new Set());
    } else {
      setSelectedPosts(new Set(generatedContent.map(c => c.id)));
    }
  };

  const exportSelectedContent = () => {
    const selectedContent = generatedContent
      .filter(content => selectedPosts.has(content.id))
      .map(c => c.content)
      .join('\n\n---\n\n');
    
    if (selectedContent) {
      copyToClipboard(selectedContent);
      toast.success(`Exported ${selectedPosts.size} selected posts to clipboard!`);
    } else {
      toast.error("No posts selected for export");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-2">
            <Bot className="h-8 w-8 text-primary" />
            <span>AI Post Generator</span>
          </h1>
          <p className="text-muted-foreground">
            Generate engaging social media posts with AI-powered content creation.
          </p>
        </div>
        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <Sparkles className="h-3 w-3 mr-1" />
          AI Powered
        </Badge>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Generation Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Content Settings</CardTitle>
            <CardDescription>Configure your AI content generation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brandName">Brand Name</Label>
              <Input
                id="brandName"
                placeholder="Your Brand Name"
                value={formData.brandName}
                onChange={(e) => setFormData(prev => ({ ...prev, brandName: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                placeholder="e.g., Technology, Healthcare, Fashion"
                value={formData.industry}
                onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <Select value={formData.tone} onValueChange={(value: any) => setFormData(prev => ({ ...prev, tone: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="authoritative">Authoritative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select value={formData.platform} onValueChange={(value) => setFormData(prev => ({ ...prev, platform: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="objective">Ad Objective</Label>
              <Select value={formData.objective} onValueChange={(value) => setFormData(prev => ({ ...prev, objective: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ad objective" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="awareness">Brand Awareness</SelectItem>
                  <SelectItem value="traffic">Drive Website Traffic</SelectItem>
                  <SelectItem value="engagement">Increase Engagement</SelectItem>
                  <SelectItem value="leads">Generate Leads</SelectItem>
                  <SelectItem value="sales">Boost Sales</SelectItem>
                  <SelectItem value="conversions">Drive Conversions</SelectItem>
                  <SelectItem value="app_installs">App Installs</SelectItem>
                  <SelectItem value="video_views">Video Views</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topics">Topics (comma-separated)</Label>
              <Textarea
                id="topics"
                placeholder="product launch, industry trends, tips"
                value={formData.topics}
                onChange={(e) => setFormData(prev => ({ ...prev, topics: e.target.value }))}
              />
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Wand2 className="h-4 w-4" />
                  <span>Generate Posts</span>
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Content */}
        <div className="lg:col-span-2 space-y-4">
          {generatedContent.length === 0 ? (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-16">
                <Bot className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Ready to Generate Content</h3>
                <p className="text-muted-foreground">
                  Fill out the form and click "Generate Posts" to create AI-powered content.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-semibold">Generated Posts ({generatedContent.length})</h3>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      checked={selectedPosts.size === generatedContent.length && generatedContent.length > 0}
                      onCheckedChange={toggleSelectAll}
                      data-testid="select-all-checkbox"
                      className="h-5 w-5"
                    />
                    <Label className="text-sm text-muted-foreground">
                      Select All ({selectedPosts.size}/{generatedContent.length})
                    </Label>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={exportSelectedContent}
                    disabled={selectedPosts.size === 0}
                    data-testid="export-selected-button"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Selected ({selectedPosts.size})
                  </Button>
                </div>
              </div>

              {generatedContent.map((content, index) => (
                <Card key={content.id} className={selectedPosts.has(content.id) ? 'ring-2 ring-blue-200 bg-blue-50/30' : ''}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <Checkbox 
                            checked={selectedPosts.has(content.id)}
                            onCheckedChange={() => togglePostSelection(content.id)}
                            data-testid={`post-checkbox-${index}`}
                            className="h-5 w-5 border-2 border-gray-400"
                            id={`post-${content.id}`}
                          />
                        </div>
                        <CardTitle className="text-base">Post {index + 1}</CardTitle>
                        {selectedPosts.has(content.id) && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            Selected
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{content.platform}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(content.content)}
                          data-testid={`copy-post-${index}`}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="prose prose-sm max-w-none">
                      <div 
                        className="text-sm leading-relaxed whitespace-pre-line"
                        style={{ lineHeight: '1.6' }}
                        data-testid={`post-content-${index}`}
                      >
                        {content.content}
                      </div>
                    </div>
                    
                    {content.hashtags && content.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2 border-t">
                        {content.hashtags.map((tag, i) => (
                          <Badge 
                            key={i} 
                            variant="secondary" 
                            className="text-xs px-2 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100"
                            data-testid={`hashtag-${index}-${i}`}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {content.callToAction && (
                      <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-400 rounded text-sm">
                        <div className="flex items-start space-x-2">
                          <span className="font-semibold text-green-700">📢 Call to Action:</span>
                          <span className="text-green-800">{content.callToAction}</span>
                        </div>
                      </div>
                    )}

                    {content.targetAudience && (
                      <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">🎯 Target Audience:</span>
                          <span>{content.targetAudience}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}