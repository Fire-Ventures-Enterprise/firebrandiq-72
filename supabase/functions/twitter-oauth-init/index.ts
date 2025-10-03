import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Generate random string for state and code verifier
function generateRandomString(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Generate code challenge from verifier using SHA-256
async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  
  // Convert to base64url
  const hashArray = Array.from(new Uint8Array(hash));
  const hashBase64 = btoa(String.fromCharCode.apply(null, hashArray));
  return hashBase64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const TWITTER_CLIENT_ID = Deno.env.get('TWITTER_CLIENT_ID');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    
    if (!TWITTER_CLIENT_ID) {
      throw new Error('Missing TWITTER_CLIENT_ID');
    }

    // Generate PKCE parameters
    const state = generateRandomString(32);
    const codeVerifier = generateRandomString(128);
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Store state and code_verifier temporarily in a table or use session
    // For now, we'll encode them in the state parameter (not recommended for production)
    const stateData = {
      state,
      codeVerifier,
      userId: user.id
    };
    const encodedState = btoa(JSON.stringify(stateData));

    // Build Twitter authorization URL
    const redirectUri = `https://smddydqeufdgywqarbxv.supabase.co/functions/v1/twitter-oauth-callback`;
    const scopes = ['tweet.read', 'tweet.write', 'users.read', 'offline.access'];
    
    const authUrl = new URL('https://twitter.com/i/oauth2/authorize');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', TWITTER_CLIENT_ID);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('scope', scopes.join(' '));
    authUrl.searchParams.append('state', encodedState);
    authUrl.searchParams.append('code_challenge', codeChallenge);
    authUrl.searchParams.append('code_challenge_method', 'S256');

    return new Response(
      JSON.stringify({ authUrl: authUrl.toString() }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in twitter-oauth-init:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
