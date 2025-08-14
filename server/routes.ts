import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertProfileSchema, insertClientSchema, insertSocialConnectionSchema } from "@shared/schema";

interface GenerateContentRequest {
  type: 'social_posts' | 'google_ads' | 'social_ads';
  brandName: string;
  industry: string;
  tone?: 'professional' | 'casual' | 'friendly' | 'authoritative';
  topics?: string[];
  platform?: string;
  targetKeywords?: string[];
  landingPageUrl?: string;
  budget?: number;
  objective?: 'awareness' | 'traffic' | 'conversions';
  targetAudience?: string;
}

// Validation schemas
const generateContentSchema = z.object({
  type: z.enum(['social_posts', 'google_ads', 'social_ads']),
  brandName: z.string(),
  industry: z.string(),
  tone: z.enum(['professional', 'casual', 'friendly', 'authoritative']).optional(),
  topics: z.array(z.string()).optional(),
  platform: z.string().optional(),
  targetKeywords: z.array(z.string()).optional(),
  landingPageUrl: z.string().optional(),
  budget: z.number().optional(),
  objective: z.enum(['awareness', 'traffic', 'conversions']).optional(),
  targetAudience: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // User management routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Profile routes
  app.get("/api/profiles/user/:userId", async (req, res) => {
    try {
      const profile = await storage.getProfileByUserId(req.params.userId);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/profiles", async (req, res) => {
    try {
      const profileData = insertProfileSchema.parse(req.body);
      const profile = await storage.createProfile(profileData);
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      console.error("Error creating profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Client management routes
  app.get("/api/clients", async (req, res) => {
    try {
      const agencyId = req.query.agencyId as string;
      if (!agencyId) {
        return res.status(400).json({ error: "Agency ID is required" });
      }
      const clients = await storage.getClients(agencyId);
      res.json(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const clientData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(clientData);
      res.status(201).json(client);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      console.error("Error creating client:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Content generation route (replaces generate-content Edge Function)
  // Social Media API Integration Routes
  app.get("/api/social/connections", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      
      const connections = await storage.getSocialConnections(userId);
      res.json(connections);
    } catch (error) {
      console.error("Error fetching social connections:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/social/connections", async (req, res) => {
    try {
      const connectionData = insertSocialConnectionSchema.parse(req.body);
      const connection = await storage.createSocialConnection(connectionData);
      res.status(201).json(connection);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      console.error("Error creating social connection:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/social/connections/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const connection = await storage.updateSocialConnection(id, updateData);
      
      if (!connection) {
        return res.status(404).json({ error: "Connection not found" });
      }
      
      res.json(connection);
    } catch (error) {
      console.error("Error updating social connection:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/social/connections/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteSocialConnection(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Connection not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting social connection:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/social/test-connection", async (req, res) => {
    try {
      const { platform, accessToken, refreshToken } = req.body;
      
      if (!platform || !accessToken) {
        return res.status(400).json({ error: "Platform and access token are required" });
      }

      const { createPlatformAPI } = await import('./services/socialMediaAPI');
      const api = createPlatformAPI(platform, accessToken, refreshToken);
      const result = await api.testConnection();
      
      res.json(result);
    } catch (error) {
      console.error("Error testing social connection:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/social/profile/:connectionId", async (req, res) => {
    try {
      const { connectionId } = req.params;
      const connection = await storage.getSocialConnection(connectionId);
      
      if (!connection) {
        return res.status(404).json({ error: "Connection not found" });
      }

      const { createPlatformAPI } = await import('./services/socialMediaAPI');
      const api = createPlatformAPI(connection.platform, connection.accessToken || '', connection.refreshToken || undefined);
      const profile = await api.getProfile();
      
      // Update connection with fresh profile data
      await storage.updateSocialConnection(connectionId, {
        username: profile.username,
        profileUrl: profile.profileUrl,
        avatarUrl: profile.avatarUrl,
        followerCount: profile.followerCount,
        followingCount: profile.followingCount,
        postCount: profile.postCount,
        lastSyncAt: new Date()
      });
      
      res.json(profile);
    } catch (error) {
      console.error("Error fetching social profile:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/social/metrics/:connectionId", async (req, res) => {
    try {
      const { connectionId } = req.params;
      const { start, end } = req.query;
      
      const connection = await storage.getSocialConnection(connectionId);
      if (!connection) {
        return res.status(404).json({ error: "Connection not found" });
      }

      const { createPlatformAPI } = await import('./services/socialMediaAPI');
      const api = createPlatformAPI(connection.platform, connection.accessToken || '', connection.refreshToken || undefined);
      
      const dateRange = start && end ? {
        start: new Date(start as string),
        end: new Date(end as string)
      } : undefined;
      
      const metrics = await api.getMetrics(dateRange);
      
      // Store metrics in database
      await storage.createSocialMetric({
        connectionId,
        date: new Date().toISOString().split('T')[0],
        followers: metrics.followers,
        following: metrics.following,
        posts: metrics.posts,
        likes: metrics.likes,
        comments: metrics.comments,
        shares: metrics.shares,
        impressions: metrics.impressions || 0,
        reach: metrics.reach || 0,
        engagementRate: metrics.engagementRate.toString()
      });
      
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching social metrics:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/social/posts/:connectionId", async (req, res) => {
    try {
      const { connectionId } = req.params;
      const { limit, since } = req.query;
      
      const connection = await storage.getSocialConnection(connectionId);
      if (!connection) {
        return res.status(404).json({ error: "Connection not found" });
      }

      const { createPlatformAPI } = await import('./services/socialMediaAPI');
      const api = createPlatformAPI(connection.platform, connection.accessToken || '', connection.refreshToken || undefined);
      
      const posts = await api.getPosts(
        limit ? parseInt(limit as string) : 10,
        since ? new Date(since as string) : undefined
      );
      
      // Store posts in database
      for (const post of posts) {
        await storage.createSocialPost({
          connectionId,
          platformPostId: post.id,
          content: post.content,
          mediaUrls: post.mediaUrls,
          hashtags: post.hashtags,
          mentions: post.mentions,
          likesCount: post.likesCount,
          commentsCount: post.commentsCount,
          sharesCount: post.sharesCount,
          engagementRate: post.likesCount && post.commentsCount ? 
            ((post.likesCount + post.commentsCount) / Math.max(1, post.likesCount + post.commentsCount + post.sharesCount) * 100).toFixed(2) : 
            "0",
          publishedAt: post.publishedAt
        });
      }
      
      res.json(posts);
    } catch (error) {
      console.error("Error fetching social posts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/social/publish/:connectionId", async (req, res) => {
    try {
      const { connectionId } = req.params;
      const { content, mediaUrls } = req.body;
      
      if (!content) {
        return res.status(400).json({ error: "Content is required" });
      }

      const connection = await storage.getSocialConnection(connectionId);
      if (!connection) {
        return res.status(404).json({ error: "Connection not found" });
      }

      const { createPlatformAPI } = await import('./services/socialMediaAPI');
      const api = createPlatformAPI(connection.platform, connection.accessToken || '', connection.refreshToken || undefined);
      
      const result = await api.publishPost(content, mediaUrls);
      
      if (result.success && result.postId) {
        // Store the published post
        await storage.createSocialPost({
          connectionId,
          platformPostId: result.postId,
          content,
          mediaUrls: mediaUrls || [],
          hashtags: content.match(/#\w+/g) || [],
          mentions: content.match(/@\w+/g) || [],
          likesCount: 0,
          commentsCount: 0,
          sharesCount: 0,
          engagementRate: "0",
          publishedAt: new Date()
        });
      }
      
      res.json(result);
    } catch (error) {
      console.error("Error publishing social post:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/generate-content", async (req, res) => {
    try {
      const requestData = generateContentSchema.parse(req.body);
      const { type, brandName, industry, tone, topics, platform, targetKeywords, landingPageUrl, budget, objective, targetAudience } = requestData;

      const openaiApiKey = process.env.OPENAI_API_KEY;
      if (!openaiApiKey) {
        return res.status(500).json({ error: "OpenAI API key not configured" });
      }

      let prompt = '';
      let maxTokens = 2000;

      if (type === 'social_posts') {
        prompt = `Generate 5 engaging social media posts for ${brandName}, a ${industry} company.
Tone: ${tone || 'professional'}
Platform: ${platform || 'general social media'}
Topics: ${topics?.join(', ') || 'industry trends, company updates, tips'}

Requirements:
- Write compelling, readable content with natural line breaks for readability
- Each post should tell a story or provide value
- Include 3-5 relevant hashtags
- Add clear call-to-action when appropriate
- Keep posts scannable with proper formatting

Format each post exactly as:
Post 1: [Opening hook or question]

[Main content with natural paragraph breaks for readability]

[Call to action if needed]

#hashtag1 #hashtag2 #hashtag3
CTA: [specific call to action]
Target: [target audience description]

Make each post authentic, valuable, and engaging for the target audience.`;
      } else if (type === 'google_ads') {
        prompt = `
          Generate 3 Google Ads campaigns for ${brandName}, a ${industry} company.
          Target keywords: ${targetKeywords?.join(', ') || 'relevant keywords'}
          Landing page: ${landingPageUrl || 'company website'}
          Budget: $${budget || 1000}/month
          Objective: ${objective || 'conversions'}
          
          For each ad, provide:
          1. Compelling headline (30 characters max)
          2. Description (90 characters max)
          3. Call-to-action
          4. Target audience
          
          Format each ad as:
          Ad [number]:
          Headline: [headline]
          Description: [description]
          CTA: [call-to-action]
          Target: [target audience]
          Keywords: [suggested keywords]
        `;
      } else if (type === 'social_ads') {
        prompt = `
          Generate 3 social media ad campaigns for ${brandName}, a ${industry} company.
          Platform: ${platform || 'Facebook/Instagram'}
          Budget: $${budget || 500}/month
          Objective: ${objective || 'conversions'}
          Target audience: ${targetAudience || 'relevant demographic'}
          
          For each ad, provide:
          1. Eye-catching headline
          2. Compelling description
          3. Call-to-action
          4. Visual suggestions
          
          Format each ad as:
          Ad [number]:
          Headline: [headline]
          Description: [description]
          CTA: [call-to-action]
          Visual: [visual suggestions]
          Targeting: [audience targeting suggestions]
        `;
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'user', content: prompt }
          ],
          max_tokens: maxTokens,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      res.json({
        success: true,
        content: data.choices[0]?.message?.content || 'No content generated',
        type,
        brandName,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid input", details: error.errors });
      }
      console.error("Error generating content:", error);
      res.status(500).json({ error: "Failed to generate content" });
    }
  });

  // Review analytics route (replaces review-analytics Edge Function)
  app.get("/api/review-analytics", async (req, res) => {
    try {
      const brandId = req.query.brandId as string || 'default-brand';

      // Mock review analytics calculation
      const analytics = {
        overallScore: 78,
        trendDirection: 'up',
        platformBreakdown: [
          {
            platform: 'google',
            totalReviews: 45,
            averageRating: 4.2,
            ratingDistribution: { 5: 20, 4: 15, 3: 8, 2: 2, 1: 0 },
            monthlyGrowth: 12.5,
            sentimentBreakdown: { positive: 38, neutral: 5, negative: 2 },
            responseRate: 85.2
          },
          {
            platform: 'yelp',
            totalReviews: 28,
            averageRating: 4.1,
            ratingDistribution: { 5: 12, 4: 10, 3: 4, 2: 2, 1: 0 },
            monthlyGrowth: 8.3,
            sentimentBreakdown: { positive: 22, neutral: 4, negative: 2 },
            responseRate: 67.9
          }
        ],
        competitorComparison: [
          {
            competitorName: 'Competitor A',
            platform: 'google',
            totalReviews: 89,
            averageRating: 4.3,
            gap: 44,
            opportunity: 'Significant review volume gap - focus on increasing Google reviews'
          }
        ],
        actionableInsights: [
          'Priority Focus: Increase review volume to build credibility and improve search visibility',
          'Opportunity: Improve to 4.5+ stars for premium positioning in search results',
          'Quick Win: Respond to more Google reviews to show engagement and improve local SEO'
        ],
        exposureOpportunities: [
          {
            platform: 'google',
            opportunity: 'Get 25 more Google reviews for local SEO boost',
            impact: 'high',
            effort: 'moderate',
            estimatedTimeframe: '2-3 months',
            priority: 1
          }
        ]
      };

      res.json(analytics);
    } catch (error) {
      console.error("Error in review analytics:", error);
      res.status(500).json({ error: "Failed to generate review analytics" });
    }
  });

  // Exposure analysis route (replaces exposure-analysis Edge Function)
  app.get("/api/exposure-analysis", async (req, res) => {
    try {
      const brandId = req.query.brandId as string || 'default-brand';

      // Mock Google exposure analysis
      const mockReviews = 18;
      const mockRating = 4.2;

      const exposureAnalysis = calculateGoogleExposureNeeds(mockReviews, mockRating);

      const response = {
        platform: 'google',
        current: {
          reviews: mockReviews,
          rating: mockRating
        },
        analysis: exposureAnalysis
      };

      res.json(response);
    } catch (error) {
      console.error("Error in exposure analysis:", error);
      res.status(500).json({ error: "Failed to generate exposure analysis" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function calculateGoogleExposureNeeds(currentReviews: number, currentRating: number) {
  let exposureLevel = 'low';
  let targetReviews = 50;
  let targetRating = 4.5;
  
  if (currentReviews < 10) {
    exposureLevel = 'low';
    targetReviews = 25;
  } else if (currentReviews < 25) {
    exposureLevel = 'medium';
    targetReviews = 50;
  } else if (currentReviews < 100) {
    exposureLevel = 'high';
    targetReviews = 100;
  } else {
    exposureLevel = 'excellent';
    targetReviews = currentReviews + 10;
  }

  return {
    currentLevel: exposureLevel,
    reviewsNeeded: Math.max(0, targetReviews - currentReviews),
    ratingImprovement: Math.max(0, targetRating - currentRating),
    recommendations: [
      `Aim for ${targetReviews} total reviews to reach ${exposureLevel === 'excellent' ? 'maintain excellent' : 'next'} level`,
      currentRating < 4.5 ? `Improve rating to ${targetRating} for better visibility` : 'Maintain current high rating',
      'Respond to all reviews to show engagement',
      'Encourage satisfied customers to leave reviews'
    ]
  };
}
