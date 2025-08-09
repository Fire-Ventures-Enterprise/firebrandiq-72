import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, Wand2, Copy, Download, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ContentGenerationService, GeneratedContent } from "@/services/contentGeneration";

export default function ContentGenerator() {
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
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
                <h3 className="text-lg font-semibold">Generated Posts ({generatedContent.length})</h3>
                <Button variant="outline" size="sm" onClick={() => {
                  const allContent = generatedContent.map(c => c.content).join('\n\n');
                  copyToClipboard(allContent);
                  toast.success("All content exported to clipboard!");
                }}>
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
              </div>

              {generatedContent.map((content, index) => (
                <Card key={content.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Post {index + 1}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{content.platform}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(content.content)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm leading-relaxed">{content.content}</p>
                    </div>
                    
                    {content.hashtags && content.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {content.hashtags.map((tag, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {content.callToAction && (
                      <div className="p-2 bg-muted/50 rounded text-sm">
                        <strong>CTA:</strong> {content.callToAction}
                      </div>
                    )}

                    {content.targetAudience && (
                      <div className="text-xs text-muted-foreground">
                        <strong>Target:</strong> {content.targetAudience}
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