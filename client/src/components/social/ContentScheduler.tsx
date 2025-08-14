import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { format, addDays, addHours } from 'date-fns';
import {
  Calendar as CalendarIcon,
  Clock,
  Send,
  Image,
  Video,
  Link,
  Hash,
  AtSign,
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Eye,
  Trash2,
  Copy,
  BarChart3,
  TrendingUp
} from 'lucide-react';

interface ScheduledPost {
  id: string;
  content: string;
  platforms: string[];
  scheduledTime: Date;
  mediaUrls: string[];
  hashtags: string[];
  mentions: string[];
  status: 'scheduled' | 'published' | 'failed';
  estimatedReach?: number;
  estimatedEngagement?: number;
}

const platformIcons = {
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  facebook: Facebook,
};

const platformColors = {
  twitter: 'text-blue-400 bg-blue-50',
  instagram: 'text-pink-500 bg-pink-50',
  linkedin: 'text-blue-600 bg-blue-50',
  facebook: 'text-blue-700 bg-blue-50',
};

const mockConnections = [
  { id: '1', platform: 'twitter', username: '@yourbrand', isActive: true },
  { id: '2', platform: 'instagram', username: '@yourbrand', isActive: true },
  { id: '3', platform: 'linkedin', username: 'Your Brand', isActive: true },
  { id: '4', platform: 'facebook', username: 'Your Brand Page', isActive: false },
];

export function ContentScheduler() {
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState<Date>();
  const [scheduledTime, setScheduledTime] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>(['']);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([
    {
      id: '1',
      content: '🚀 Excited to announce our new AI-powered features! Transform your social media strategy with intelligent insights and automated content optimization. #AI #SocialMedia #Innovation',
      platforms: ['twitter', 'linkedin'],
      scheduledTime: addHours(new Date(), 2),
      mediaUrls: [],
      hashtags: ['#AI', '#SocialMedia', '#Innovation'],
      mentions: [],
      status: 'scheduled',
      estimatedReach: 2500,
      estimatedEngagement: 180
    },
    {
      id: '2',
      content: 'Behind the scenes at our tech headquarters! Our amazing team working on cutting-edge solutions for brands worldwide. 💪 #TeamWork #TechLife',
      platforms: ['instagram', 'facebook'],
      scheduledTime: addDays(new Date(), 1),
      mediaUrls: ['https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500'],
      hashtags: ['#TeamWork', '#TechLife'],
      mentions: [],
      status: 'scheduled',
      estimatedReach: 1800,
      estimatedEngagement: 220
    }
  ]);

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const addMediaUrl = () => {
    setMediaUrls(prev => [...prev, '']);
  };

  const updateMediaUrl = (index: number, url: string) => {
    setMediaUrls(prev => prev.map((u, i) => i === index ? url : u));
  };

  const removeMediaUrl = (index: number) => {
    setMediaUrls(prev => prev.filter((_, i) => i !== index));
  };

  const extractHashtags = (text: string): string[] => {
    const hashtags = text.match(/#\w+/g) || [];
    return Array.from(new Set(hashtags));
  };

  const extractMentions = (text: string): string[] => {
    const mentions = text.match(/@\w+/g) || [];
    return Array.from(new Set(mentions));
  };

  const calculateEstimates = (platforms: string[], contentLength: number) => {
    const baseReach = platforms.length * 500;
    const contentBonus = Math.min(contentLength / 10, 200);
    const hashtagBonus = extractHashtags(content).length * 50;
    
    const estimatedReach = baseReach + contentBonus + hashtagBonus;
    const estimatedEngagement = Math.floor(estimatedReach * 0.08); // 8% engagement rate
    
    return { estimatedReach, estimatedEngagement };
  };

  const handleSchedulePost = () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content for your post",
        variant: "destructive"
      });
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one platform",
        variant: "destructive"
      });
      return;
    }

    if (!scheduledDate || !scheduledTime) {
      toast({
        title: "Error",
        description: "Please select a date and time",
        variant: "destructive"
      });
      return;
    }

    const [hours, minutes] = scheduledTime.split(':').map(Number);
    const finalDateTime = new Date(scheduledDate);
    finalDateTime.setHours(hours, minutes, 0, 0);

    if (finalDateTime <= new Date()) {
      toast({
        title: "Error",
        description: "Please select a future date and time",
        variant: "destructive"
      });
      return;
    }

    const estimates = calculateEstimates(selectedPlatforms, content.length);
    
    const newPost: ScheduledPost = {
      id: Date.now().toString(),
      content,
      platforms: selectedPlatforms,
      scheduledTime: finalDateTime,
      mediaUrls: mediaUrls.filter(url => url.trim()),
      hashtags: extractHashtags(content),
      mentions: extractMentions(content),
      status: 'scheduled',
      ...estimates
    };

    setScheduledPosts(prev => [...prev, newPost]);
    
    // Reset form
    setContent('');
    setSelectedPlatforms([]);
    setScheduledDate(undefined);
    setScheduledTime('');
    setMediaUrls(['']);

    toast({
      title: "Post Scheduled",
      description: `Your post has been scheduled for ${format(finalDateTime, 'PPp')}`,
    });
  };

  const handleDeletePost = (postId: string) => {
    setScheduledPosts(prev => prev.filter(p => p.id !== postId));
    toast({
      title: "Post Deleted",
      description: "The scheduled post has been removed",
    });
  };

  const handleDuplicatePost = (post: ScheduledPost) => {
    setContent(post.content);
    setSelectedPlatforms(post.platforms);
    setMediaUrls(post.mediaUrls.length > 0 ? post.mediaUrls : ['']);
  };

  const getQuickScheduleOptions = () => [
    { label: 'In 1 hour', date: addHours(new Date(), 1) },
    { label: 'In 3 hours', date: addHours(new Date(), 3) },
    { label: 'Tomorrow 9 AM', date: (() => {
      const tomorrow = addDays(new Date(), 1);
      tomorrow.setHours(9, 0, 0, 0);
      return tomorrow;
    })() },
    { label: 'Tomorrow 6 PM', date: (() => {
      const tomorrow = addDays(new Date(), 1);
      tomorrow.setHours(18, 0, 0, 0);
      return tomorrow;
    })() },
  ];

  const handleQuickSchedule = (date: Date) => {
    setScheduledDate(date);
    setScheduledTime(format(date, 'HH:mm'));
  };

  return (
    <div className="space-y-6" data-testid="content-scheduler">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Scheduler</h2>
          <p className="text-muted-foreground">Schedule and preview your social media posts</p>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-700">
          {scheduledPosts.filter(p => p.status === 'scheduled').length} Scheduled
        </Badge>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Scheduler Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Send className="h-5 w-5 mr-2" />
              Create Post
            </CardTitle>
            <CardDescription>Compose and schedule your content across platforms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Content Input */}
            <div>
              <Label htmlFor="post-content">Post Content</Label>
              <Textarea
                id="post-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                rows={4}
                className="resize-none"
                data-testid="textarea-content"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{content.length}/280 characters</span>
                <div className="flex space-x-2">
                  {extractHashtags(content).length > 0 && (
                    <span className="flex items-center">
                      <Hash className="h-3 w-3 mr-1" />
                      {extractHashtags(content).length}
                    </span>
                  )}
                  {extractMentions(content).length > 0 && (
                    <span className="flex items-center">
                      <AtSign className="h-3 w-3 mr-1" />
                      {extractMentions(content).length}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Platform Selection */}
            <div>
              <Label>Select Platforms</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {mockConnections.map(connection => {
                  const Icon = platformIcons[connection.platform as keyof typeof platformIcons];
                  const isSelected = selectedPlatforms.includes(connection.platform);
                  const isDisabled = !connection.isActive;
                  
                  return (
                    <Button
                      key={connection.id}
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePlatformToggle(connection.platform)}
                      disabled={isDisabled}
                      className={`justify-start ${isSelected ? '' : platformColors[connection.platform as keyof typeof platformColors]}`}
                      data-testid={`platform-${connection.platform}`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {connection.username}
                      {isDisabled && <Badge variant="secondary" className="ml-2 text-xs">Inactive</Badge>}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Media URLs */}
            <div>
              <Label>Media (Optional)</Label>
              {mediaUrls.map((url, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    value={url}
                    onChange={(e) => updateMediaUrl(index, e.target.value)}
                    placeholder="Enter image/video URL"
                    data-testid={`input-media-${index}`}
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => removeMediaUrl(index)}
                    disabled={mediaUrls.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="ghost" size="sm" onClick={addMediaUrl} className="mt-2">
                <Image className="h-4 w-4 mr-2" />
                Add Media
              </Button>
            </div>

            <Separator />

            {/* Scheduling */}
            <div className="space-y-4">
              <Label>Schedule</Label>
              
              {/* Quick Schedule Options */}
              <div className="grid grid-cols-2 gap-2">
                {getQuickScheduleOptions().map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickSchedule(option.date)}
                    className="text-xs"
                    data-testid={`quick-schedule-${index}`}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>

              <div className="flex gap-2">
                {/* Date Picker */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex-1">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {scheduledDate ? format(scheduledDate, 'PPP') : 'Pick date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={scheduledDate}
                      onSelect={setScheduledDate}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>

                {/* Time Picker */}
                <div className="flex-1">
                  <Input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    data-testid="input-schedule-time"
                  />
                </div>
              </div>
            </div>

            {/* Estimates */}
            {content && selectedPlatforms.length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Estimated Performance
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-blue-600">Estimated Reach</div>
                    <div className="font-bold text-blue-900">
                      {calculateEstimates(selectedPlatforms, content.length).estimatedReach.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-blue-600">Estimated Engagement</div>
                    <div className="font-bold text-blue-900">
                      {calculateEstimates(selectedPlatforms, content.length).estimatedEngagement.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Schedule Button */}
            <Button 
              onClick={handleSchedulePost} 
              className="w-full"
              disabled={!content || selectedPlatforms.length === 0 || !scheduledDate || !scheduledTime}
              data-testid="button-schedule-post"
            >
              <Clock className="h-4 w-4 mr-2" />
              Schedule Post
            </Button>
          </CardContent>
        </Card>

        {/* Preview & Scheduled Posts */}
        <div className="space-y-4">
          {/* Live Preview */}
          {content && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-white">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      FB
                    </div>
                    <div>
                      <div className="font-semibold text-sm">FireBrandIQ</div>
                      <div className="text-xs text-muted-foreground">Just now</div>
                    </div>
                  </div>
                  <p className="text-sm mb-3">{content}</p>
                  {mediaUrls.filter(url => url.trim()).map((url, index) => (
                    <div key={index} className="bg-slate-100 rounded-lg p-2 mb-2 text-xs text-center">
                      📷 Media: {url.substring(0, 50)}...
                    </div>
                  ))}
                  <div className="flex space-x-4 text-xs text-muted-foreground border-t pt-2">
                    <span>👍 Like</span>
                    <span>💬 Comment</span>
                    <span>↗️ Share</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Scheduled Posts */}
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Posts</CardTitle>
              <CardDescription>Manage your upcoming content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scheduledPosts.map(post => (
                  <div key={post.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm mb-2">{post.content}</p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <CalendarIcon className="h-3 w-3" />
                          <span>{format(post.scheduledTime, 'PPp')}</span>
                          <Badge variant="secondary" className={`text-xs ${
                            post.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                            post.status === 'published' ? 'bg-green-100 text-green-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {post.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-1 ml-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDuplicatePost(post)}
                          data-testid={`button-duplicate-${post.id}`}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeletePost(post.id)}
                          data-testid={`button-delete-${post.id}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1">
                        {post.platforms.map(platform => {
                          const Icon = platformIcons[platform as keyof typeof platformIcons];
                          return (
                            <Badge key={platform} variant="outline" className="text-xs">
                              <Icon className="h-3 w-3 mr-1" />
                              {platform}
                            </Badge>
                          );
                        })}
                      </div>
                      
                      {post.estimatedReach && (
                        <div className="flex space-x-3 text-xs text-muted-foreground">
                          <span className="flex items-center">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {post.estimatedReach.toLocaleString()} reach
                          </span>
                          <span>{post.estimatedEngagement?.toLocaleString()} engagement</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {scheduledPosts.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No scheduled posts yet</p>
                    <p className="text-sm">Create your first scheduled post above</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}