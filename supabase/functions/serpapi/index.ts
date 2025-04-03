
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const SERP_API_KEY = Deno.env.get("SERPAPI_KEY") || "3c72d7e11aed80bff312ca7cbcd61ea8676b9fd3b4697350f9e9426601091cf0";

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Handle both GET and POST requests
    let keyword;
    let location = "us";
    let engine = "google";
    let type = "search"; // can be "search", "autocomplete", "related", or "organic"
    
    if (req.method === "POST") {
      try {
        const body = await req.json();
        keyword = body.keyword;
        location = body.location || location;
        engine = body.engine || engine;
        type = body.type || type;
      } catch (error) {
        console.error("Error parsing request body:", error);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Invalid JSON in request body" 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
    } else {
      const url = new URL(req.url);
      keyword = url.searchParams.get("keyword");
      location = url.searchParams.get("location") || location;
      engine = url.searchParams.get("engine") || engine;
      type = url.searchParams.get("type") || type;
    }

    if (!keyword) {
      console.error("Missing required keyword parameter");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Keyword is required" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log(`Fetching SERP data: keyword=${keyword}, location=${location}, engine=${engine}, type=${type}`);

    // Construct SERP API URL with parameters
    let url;
    
    switch(type) {
      case "autocomplete":
        url = new URL("https://serpapi.com/search.json");
        url.searchParams.append("engine", "google_autocomplete");
        url.searchParams.append("q", keyword);
        url.searchParams.append("api_key", SERP_API_KEY);
        break;
        
      case "related":
        url = new URL("https://serpapi.com/search.json");
        url.searchParams.append("engine", engine);
        url.searchParams.append("q", keyword);
        url.searchParams.append("location", location);
        url.searchParams.append("gl", "us");
        url.searchParams.append("hl", "en");
        url.searchParams.append("api_key", SERP_API_KEY);
        // Only fetch related searches and questions
        url.searchParams.append("num", "0");
        break;
        
      case "organic":
        url = new URL("https://serpapi.com/search.json");
        url.searchParams.append("engine", engine);
        url.searchParams.append("q", keyword);
        url.searchParams.append("location", location);
        url.searchParams.append("gl", "us");
        url.searchParams.append("hl", "en");
        url.searchParams.append("api_key", SERP_API_KEY);
        url.searchParams.append("num", "20");
        url.searchParams.append("include_html", "false");
        // Only fetch organic results
        url.searchParams.append("no_cache", "true");
        break;
        
      default: // standard search
        url = new URL("https://serpapi.com/search.json");
        url.searchParams.append("engine", engine);
        url.searchParams.append("q", keyword);
        url.searchParams.append("location", location);
        url.searchParams.append("gl", "us");
        url.searchParams.append("hl", "en");
        url.searchParams.append("api_key", SERP_API_KEY);
        url.searchParams.append("num", "20");
        url.searchParams.append("include_html", "false");
    }

    console.log(`Calling SerpAPI with URL: ${url.toString()}`);
    
    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`SERP API error (${response.status}): ${errorText}`);
        
        return new Response(
          JSON.stringify({
            success: false,
            error: `SERP API returned status: ${response.status}`,
            details: errorText
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
      
      const data = await response.json();
      console.log(`Successfully retrieved SERP data for: ${keyword}`);

      return new Response(
        JSON.stringify({
          success: true,
          data: data
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    } catch (fetchError) {
      console.error(`Network error when calling SERP API: ${fetchError.message}`);
      
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to fetch data from SERP API",
          details: fetchError.message
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
  } catch (error) {
    console.error(`SERP API Edge Function Error: ${error.message}`);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Unexpected error in SERP API edge function",
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
