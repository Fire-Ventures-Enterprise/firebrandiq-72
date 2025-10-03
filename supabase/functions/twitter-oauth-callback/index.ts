import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple encryption using base64 (in production, use proper encryption)
function encryptToken(token: string): string {
  return btoa(token);
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const encodedState = url.searchParams.get('state');
    const error = url.searchParams.get('error');

    if (error) {
      // Redirect to frontend with error
      return Response.redirect(
        `https://smddydqeufdgywqarbxv.lovable.app/social?error=${encodeURIComponent(error)}`,
        302
      );
    }

    if (!code || !encodedState) {
      throw new Error('Missing code or state parameter');
    }

    // Decode state to get code_verifier and userId
    const stateData = JSON.parse(atob(encodedState));
    const { codeVerifier, userId } = stateData;

    if (!codeVerifier || !userId) {
      throw new Error('Invalid state parameter');
    }

    // Exchange code for access token
    const TWITTER_CLIENT_ID = Deno.env.get('TWITTER_CLIENT_ID');
    const TWITTER_CLIENT_SECRET = Deno.env.get('TWITTER_CLIENT_SECRET');
    const redirectUri = `https://smddydqeufdgywqarbxv.supabase.co/functions/v1/twitter-oauth-callback`;

    if (!TWITTER_CLIENT_ID || !TWITTER_CLIENT_SECRET) {
      throw new Error('Missing Twitter credentials');
    }

    // Create basic auth header
    const basicAuth = btoa(`${TWITTER_CLIENT_ID}:${TWITTER_CLIENT_SECRET}`);

    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Twitter token error:', errorText);
      throw new Error(`Failed to exchange code for token: ${errorText}`);
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    // Get user info from Twitter
    const userResponse = await fetch('https://api.twitter.com/2/users/me', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to get Twitter user info');
    }

    const userData = await userResponse.json();
    const twitterUsername = userData.data.username;
    const twitterUserId = userData.data.id;

    // Initialize Supabase client with service role to bypass RLS
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Calculate token expiry
    const tokenExpiresAt = new Date(Date.now() + expires_in * 1000);

    // Check if connection already exists
    const { data: existingConnection } = await supabase
      .from('social_connections')
      .select('id')
      .eq('user_id', userId)
      .eq('platform', 'twitter')
      .single();

    let connectionId: string;

    if (existingConnection) {
      // Update existing connection
      connectionId = existingConnection.id;
      await supabase
        .from('social_connections')
        .update({
          username: twitterUsername,
          platform_user_id: twitterUserId,
          is_active: true,
          token_expires_at: tokenExpiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', connectionId);
    } else {
      // Create new connection
      const { data: newConnection, error: connectionError } = await supabase
        .from('social_connections')
        .insert({
          user_id: userId,
          platform: 'twitter',
          username: twitterUsername,
          platform_user_id: twitterUserId,
          is_active: true,
          token_expires_at: tokenExpiresAt.toISOString(),
        })
        .select('id')
        .single();

      if (connectionError) {
        throw connectionError;
      }

      connectionId = newConnection.id;
    }

    // Store encrypted tokens in vault
    const { error: vaultError } = await supabase
      .from('social_token_vault')
      .upsert({
        connection_id: connectionId,
        encrypted_access_token: encryptToken(access_token),
        encrypted_refresh_token: refresh_token ? encryptToken(refresh_token) : null,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'connection_id'
      });

    if (vaultError) {
      console.error('Error storing tokens:', vaultError);
      throw vaultError;
    }

    // Redirect to frontend success page
    return Response.redirect(
      `https://smddydqeufdgywqarbxv.lovable.app/social?connected=twitter&username=${encodeURIComponent(twitterUsername)}`,
      302
    );
  } catch (error) {
    console.error('Error in twitter-oauth-callback:', error);
    return Response.redirect(
      `https://smddydqeufdgywqarbxv.lovable.app/social?error=${encodeURIComponent(error.message)}`,
      302
    );
  }
});
