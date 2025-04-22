
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Check auth
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("Missing authorization header in SERP API function");
      return new Response(JSON.stringify({ 
        error: "Authentication required",
        debug: {
          headers: Object.fromEntries([...req.headers]),
          method: req.method
        }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify the token
    const token = authHeader.replace("Bearer ", "");
    console.log("Verifying token:", token.substring(0, 10) + "...");
    
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      console.error("Error verifying token:", userError);
      return new Response(JSON.stringify({ 
        error: "Invalid token", 
        details: userError?.message || "User not found" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    console.log("User authenticated successfully:", user.id);

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

    // Use the corrected SERPAPI key
    const serpApiKey = "0e5b83cf0574604a9bc8016d699aba8d243a313f8978f8ec6f7ae188c7a9d962";
    
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
