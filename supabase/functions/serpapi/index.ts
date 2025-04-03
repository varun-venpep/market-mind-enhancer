
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// Get the SERP API key from environment variables
const SERP_API_KEY = Deno.env.get("SERP_API_KEY") || "";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    console.log("SERP API function received request");
    
    // Verify SERP API key exists
    if (!SERP_API_KEY) {
      console.error("SERP API key is not configured");
      return new Response(
        JSON.stringify({
          success: false,
          error: "SERP API key not configured. Please set the SERP_API_KEY environment variable.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Parse request body
    const { keyword, location = "us", engine = "google", type = "search" } = await req.json();
    
    if (!keyword) {
      console.error("Missing required parameter: keyword");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required parameter: keyword",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    console.log(`SERP API request: keyword=${keyword}, location=${location}, engine=${engine}, type=${type}`);

    // Build the SERP API URL based on the request type
    let apiUrl;
    if (type === "autocomplete") {
      apiUrl = `https://serpapi.com/search.json?engine=${engine}&q=${encodeURIComponent(keyword)}&gl=${location}&api_key=${SERP_API_KEY}&source=suggestions`;
    } else if (type === "related") {
      apiUrl = `https://serpapi.com/search.json?engine=${engine}&q=${encodeURIComponent(keyword)}&gl=${location}&api_key=${SERP_API_KEY}`;
    } else {
      apiUrl = `https://serpapi.com/search.json?engine=${engine}&q=${encodeURIComponent(keyword)}&gl=${location}&api_key=${SERP_API_KEY}`;
    }

    // Make request to SERP API
    console.log(`Sending request to SERP API: ${apiUrl.replace(SERP_API_KEY, "API_KEY_HIDDEN")}`);
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`SERP API error: ${response.status} ${response.statusText}`, errorText);
      return new Response(
        JSON.stringify({
          success: false,
          error: `SERP API error: ${response.status} ${response.statusText}`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    const data = await response.json();
    console.log("SERP API response received successfully");

    return new Response(
      JSON.stringify({
        success: true,
        data: data,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in SERP API edge function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
