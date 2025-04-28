
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, redirectUri, userId } = await req.json();

    if (!code) {
      throw new Error("Authorization code is required");
    }

    if (!redirectUri) {
      throw new Error("Redirect URI is required");
    }

    // Google OAuth configuration
    const GOOGLE_CLIENT_ID = Deno.env.get("GOOGLE_CLIENT_ID");
    const GOOGLE_CLIENT_SECRET = Deno.env.get("GOOGLE_CLIENT_SECRET");
    
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      throw new Error("Google OAuth credentials not configured");
    }

    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      throw new Error(`Failed to exchange code for tokens: ${JSON.stringify(errorData)}`);
    }

    const tokens = await tokenResponse.json();
    
    // Calculate token expiration
    const expiresAt = Date.now() + (tokens.expires_in * 1000);
    
    // Store credentials in Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase credentials are not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Store the tokens in the user_integrations table
    const { error: dbError } = await supabase
      .from('user_integrations')
      .upsert({
        user_id: userId,
        platform: 'blogger',
        credentials: {
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_at: expiresAt
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,platform'
      });

    if (dbError) {
      throw new Error(`Failed to store tokens: ${dbError.message}`);
    }

    // Validate the token by fetching the user's blogs
    const userBlogsResponse = await fetch('https://www.googleapis.com/blogger/v3/users/self/blogs', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    });

    let blogs = [];
    let hasBloggerAccount = false;
    
    if (userBlogsResponse.ok) {
      const blogsData = await userBlogsResponse.json();
      blogs = blogsData.items || [];
      hasBloggerAccount = true;
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        hasBloggerAccount,
        blogsCount: blogs.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
    
  } catch (error) {
    console.error('Error in blogger-callback function:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
