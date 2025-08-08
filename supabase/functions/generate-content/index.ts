// Supabase Edge Function
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, brandName, industry, tone, topics, platform, targetKeywords, landingPageUrl, budget, objective, targetAudience }: GenerateContentRequest = await req.json()

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not found')
    }

    let prompt = ''
    let maxTokens = 2000

    if (type === 'social_posts') {
      prompt = `
        Generate 5 engaging social media posts for ${brandName}, a ${industry} company.
        Tone: ${tone || 'professional'}
        Platform: ${platform || 'general social media'}
        Topics to focus on: ${topics?.join(', ') || 'industry trends, company updates, tips'}
        
        For each post, provide:
        1. Engaging content (appropriate length for platform)
        2. Relevant hashtags
        3. Call-to-action
        4. Target audience description
        
        Format each post as:
        Post [number]:
        [content]
        Hashtags: [hashtags]
        CTA: [call-to-action]
        Target: [target audience]
        
        Make posts authentic, valuable, and brand-appropriate.
      `
    } else if (type === 'google_ads') {
      prompt = `
        Generate 3 Google Ads campaigns for ${brandName}, a ${industry} company.
        Target keywords: ${targetKeywords?.join(', ') || 'relevant keywords'}
        Landing page: ${landingPageUrl || 'company website'}
        Budget: $${budget || 1000}/month
        
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
        
        Focus on high-converting, relevant ad copy that drives clicks and conversions.
      `
      maxTokens = 1500
    } else if (type === 'social_ads') {
      prompt = `
        Generate 3 ${platform} ad campaigns for ${brandName}.
        Objective: ${objective}
        Target audience: ${targetAudience}
        Budget: $${budget}/month
        
        For each ad, provide:
        1. Eye-catching headline
        2. Engaging ad copy
        3. Strong call-to-action
        4. Audience targeting recommendations
        
        Format each ad as:
        Ad [number]:
        Headline: [headline]
        Copy: [ad copy]
        CTA: [call-to-action]
        Target: [target audience]
        
        Optimize for ${platform} best practices and ${objective} goals.
      `
      maxTokens = 1500
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: maxTokens,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const generatedText = data.choices[0].message.content

    // Parse the response based on content type
    let parsedContent = []
    
    if (type === 'social_posts') {
      parsedContent = parseGeneratedPosts(generatedText, platform)
    } else {
      parsedContent = parseGeneratedAds(generatedText, type === 'google_ads' ? 'google_ad' : 'social_ad')
    }

    return new Response(
      JSON.stringify({ data: parsedContent }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }, 
        status: 500 
      },
    )
  }
})

function parseGeneratedPosts(text: string, platform?: string) {
  try {
    const postSections = text.split(/Post \d+:/g).filter(section => section.trim())
    
    return postSections.slice(0, 5).map((section, index) => {
      const lines = section.split('\n').filter(line => line.trim())
      
      const contentLines = []
      let hashtags = []
      let callToAction = ''
      let targetAudience = ''
      
      for (const line of lines) {
        if (line.startsWith('Hashtags:')) {
          const hashtagText = line.replace('Hashtags:', '').trim()
          hashtags = hashtagText.match(/#\w+/g) || hashtagText.split(/[,\s]+/).filter(Boolean).map(tag => tag.startsWith('#') ? tag : `#${tag}`)
        } else if (line.startsWith('CTA:')) {
          callToAction = line.replace('CTA:', '').trim()
        } else if (line.startsWith('Target:')) {
          targetAudience = line.replace('Target:', '').trim()
        } else if (line.trim() && !line.includes(':')) {
          contentLines.push(line.trim())
        }
      }
      
      return {
        id: crypto.randomUUID(),
        type: 'social_post',
        platform: platform || 'twitter',
        content: contentLines.join(' ').trim(),
        hashtags,
        callToAction,
        targetAudience,
        createdAt: new Date().toISOString(),
        status: 'draft',
      }
    })
  } catch (error) {
    console.error('Error parsing posts:', error)
    return []
  }
}

function parseGeneratedAds(text: string, type: string) {
  try {
    const adSections = text.split(/Ad \d+:/g).filter(section => section.trim())
    
    return adSections.slice(0, 3).map((section, index) => {
      const lines = section.split('\n').filter(line => line.trim())
      
      let title = ''
      let content = ''
      let callToAction = ''
      let targetAudience = ''
      
      for (const line of lines) {
        if (line.startsWith('Headline:')) {
          title = line.replace('Headline:', '').trim()
        } else if (line.startsWith('Description:') || line.startsWith('Copy:')) {
          content = line.replace(/^(Description|Copy):/, '').trim()
        } else if (line.startsWith('CTA:')) {
          callToAction = line.replace('CTA:', '').trim()
        } else if (line.startsWith('Target:')) {
          targetAudience = line.replace('Target:', '').trim()
        }
      }
      
      return {
        id: crypto.randomUUID(),
        type,
        platform: type === 'google_ad' ? 'google' : 'meta',
        title,
        content,
        callToAction,
        targetAudience,
        createdAt: new Date().toISOString(),
        status: 'draft',
      }
    })
  } catch (error) {
    console.error('Error parsing ads:', error)
    return []
  }
}