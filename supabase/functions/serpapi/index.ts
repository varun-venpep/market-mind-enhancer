
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
    let requestData;
    try {
      requestData = await req.json();
    } catch (e) {
      console.error("Failed to parse request body:", e);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid request body. Expected JSON.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    const { keyword, location = "us", engine = "google", type = "search" } = requestData;
    
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
    
    let response;
    try {
      response = await fetch(apiUrl);
    } catch (error) {
      console.error(`Network error when calling SERP API:`, error);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Network error when calling SERP API: ${error.message}`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`SERP API error: ${response.status} ${response.statusText}`, errorText);
      return new Response(
        JSON.stringify({
          success: false,
          error: `SERP API error: ${response.status} ${response.statusText}`,
          details: errorText
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    let data;
    try {
      data = await response.json();
    } catch (error) {
      console.error(`Error parsing SERP API response:`, error);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Error parsing SERP API response: ${error.message}`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
    
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
