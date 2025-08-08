import { ReviewRequest, ReviewCampaign } from "@/types/reviews";

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Mock storage service
const storage = {
  async getBrand(brandId: string) {
    return {
      id: brandId,
      name: 'Sample Business',
      googlePlaceId: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
      yelpId: 'sample-business-san-francisco',
      facebookId: 'samplebusiness'
    };
  },
  
  async saveCampaign(campaign: ReviewCampaign) {
    // In real implementation, save to Supabase
    console.log('Saving campaign:', campaign);
    return campaign;
  },
  
  async saveRequests(requests: ReviewRequest[]) {
    // In real implementation, save to Supabase
    console.log('Saving requests:', requests);
    return requests;
  }
};

export async function createReviewCampaign(
  brandId: string,
  campaignName: string,
  customerList: Array<{email: string, name: string}>,
  platforms: string[],
  customMessage?: string
) {
  const campaign: ReviewCampaign = {
    id: generateId(),
    name: campaignName,
    brandId,
    platforms,
    totalCustomers: customerList.length,
    requestsSent: 0,
    reviewsReceived: 0,
    status: 'active',
    createdAt: new Date(),
    customMessage
  };

  // Generate personalized review requests
  const requests: ReviewRequest[] = [];
  for (const customer of customerList) {
    for (const platform of platforms) {
      const request = await generateReviewRequest({
        brandId,
        customer,
        platform: platform as 'google' | 'yelp' | 'facebook',
        customMessage,
        campaignId: campaign.id
      });
      requests.push(request);
    }
  }

  // Save to storage
  await storage.saveCampaign(campaign);
  await storage.saveRequests(requests);

  return { campaign, requests };
}

async function generateReviewRequest(params: {
  brandId: string;
  customer: {email: string, name: string};
  platform: 'google' | 'yelp' | 'facebook';
  customMessage?: string;
  campaignId: string;
}) {
  const brand = await storage.getBrand(params.brandId);
  
  const platformUrls = {
    google: `https://search.google.com/local/writereview?placeid=${brand.googlePlaceId}`,
    yelp: `https://www.yelp.com/biz/${brand.yelpId}?utm_campaign=review_request`,
    facebook: `https://www.facebook.com/${brand.facebookId}/reviews`
  };

  // AI-generated personalized message
  const personalizedMessage = await generatePersonalizedReviewRequest(
    brand.name,
    params.customer.name,
    params.platform,
    params.customMessage
  );

  return {
    id: generateId(),
    brandId: params.brandId,
    customerEmail: params.customer.email,
    customerName: params.customer.name,
    platform: params.platform,
    reviewUrl: platformUrls[params.platform],
    message: personalizedMessage,
    status: 'pending' as const,
    campaignId: params.campaignId
  };
}

async function generatePersonalizedReviewRequest(
  businessName: string,
  customerName: string,
  platform: string,
  customMessage?: string
): Promise<string> {
  // In real implementation, use OpenAI API for personalization
  const templates = {
    google: `Hi ${customerName},

We hope you had a great experience with ${businessName}! We'd be grateful if you could take a moment to share your feedback on Google. Your review helps other customers discover us and helps us continue improving our service.

${customMessage || 'Thank you for being a valued customer!'}

Best regards,
The ${businessName} Team`,

    yelp: `Hello ${customerName},

Thank you for choosing ${businessName}! We'd love to hear about your experience. Could you please leave us a review on Yelp? It only takes a minute and means the world to us.

${customMessage || 'We appreciate your support!'}

Warmly,
${businessName}`,

    facebook: `Dear ${customerName},

We hope you enjoyed your experience with ${businessName}! Would you mind sharing your thoughts on our Facebook page? Your feedback helps us serve you and other customers better.

${customMessage || 'Thank you for your trust in us!'}

Best,
The ${businessName} Team`
  };

  return templates[platform as keyof typeof templates] || templates.google;
}

export async function sendReviewRequest(request: ReviewRequest): Promise<boolean> {
  try {
    // In real implementation, send via email service (Resend)
    console.log('Sending review request:', {
      to: request.customerEmail,
      subject: `We'd love your feedback!`,
      message: request.message,
      reviewUrl: request.reviewUrl
    });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  } catch (error) {
    console.error('Failed to send review request:', error);
    return false;
  }
}

export async function bulkSendRequests(campaignId: string, requests: ReviewRequest[]): Promise<{
  sent: number;
  failed: number;
  errors: string[];
}> {
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const request of requests) {
    try {
      const success = await sendReviewRequest(request);
      if (success) {
        sent++;
        // Update request status
        request.status = 'sent';
        request.sentDate = new Date();
      } else {
        failed++;
        errors.push(`Failed to send to ${request.customerEmail}`);
      }
    } catch (error) {
      failed++;
      errors.push(`Error sending to ${request.customerEmail}: ${error}`);
    }

    // Add small delay between sends to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return { sent, failed, errors };
}