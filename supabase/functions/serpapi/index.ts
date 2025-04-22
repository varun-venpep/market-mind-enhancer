
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Check for authentication header first
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("Missing authorization header in SERP API function");
      return new Response(JSON.stringify({ 
        error: 'Authentication required',
        details: 'Missing authorization header' 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Get Supabase configuration
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        storage: globalThis.localStorage || null,
      },
    });
    
    // Authenticate user with token
    const token = authHeader.replace('Bearer ', '');
    console.log("Attempting to authenticate with token:", token.substring(0, 10) + "...");
    
    try {
      // First try with the access token directly
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);

      if (userError || !user) {
        console.error("User authentication error or no user found:", userError?.message);
        
        // Try to refresh the session
        try {
          console.log("Attempting session refresh...");
          
          // Try as an access token
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError || !sessionData?.session) {
            console.log("Failed to get session, trying as refresh token...");
            
            // Try as a refresh token
            const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
              refresh_token: token,
            });
            
            if (refreshError || !refreshData?.session) {
              console.error("Failed to refresh session:", refreshError?.message);
              return new Response(JSON.stringify({ 
                error: "Authentication failed: " + (refreshError?.message || "Invalid token")
              }), {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 401,
              });
            }
            
            console.log("Successfully refreshed session using refresh token");
          }
        } catch (refreshException) {
          console.error("Exception during session refresh:", refreshException?.message);
          return new Response(JSON.stringify({ 
            error: "Authentication error during refresh: " + (refreshException.message || "Unknown error")
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 401,
          });
        }
      }
    } catch (authError) {
      console.error("Error authenticating user:", authError);
      return new Response(JSON.stringify({ 
        error: "Authentication error: " + (authError.message || "Unknown error")
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Parse request body
    let requestData;
    try {
      requestData = await req.json();
    } catch (error) {
      console.error("Error parsing request body:", error);
      return new Response(JSON.stringify({ error: "Invalid request format" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const { keyword, query } = requestData;
    const searchQuery = query || keyword;
    
    if (!searchQuery) {
      return new Response(JSON.stringify({ error: "Query parameter is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    console.log(`Processing SERP request for query: "${searchQuery}"`);

    // Get the SERP API key from environment variables
    const serpApiKey = Deno.env.get("SERP_API_KEY") || "0e5b83cf0574604a9bc8016d699aba8d243a313f8978f8ec6f7ae188c7a9d962";
    
    if (!serpApiKey) {
      console.error("SERP API key is not configured");
      return new Response(JSON.stringify({ error: "SERP API key is not configured" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }
    
    // Call SERPAPI
    const params = new URLSearchParams({
      q: searchQuery,
      api_key: serpApiKey,
      engine: "google",
    });

    console.log(`Calling SERPAPI with query: ${searchQuery}`);
    const response = await fetch(`https://serpapi.com/search?${params.toString()}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`SERPAPI error (${response.status}): ${errorText}`);
      throw new Error(`SERPAPI request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("SERPAPI request successful");

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in SERPAPI function:", error);
    return new Response(JSON.stringify({ error: error.message || "An unknown error occurred" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
