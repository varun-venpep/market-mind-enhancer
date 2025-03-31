
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const SERP_API_KEY = "3c72d7e11aed80bff312ca7cbcd61ea8676b9fd3b4697350f9e9426601091cf0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Handle both GET and POST requests
    let keyword;
    let location = "us";
    
    if (req.method === "POST") {
      const body = await req.json();
      keyword = body.keyword;
      location = body.location || location;
    } else {
      const url = new URL(req.url);
      keyword = url.searchParams.get("keyword");
      location = url.searchParams.get("location") || location;
    }

    if (!keyword) {
      return new Response(
        JSON.stringify({ error: "Keyword is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Fetching SERP data for keyword: ${keyword}, location: ${location}`);

    // Construct SERP API URL with parameters
    const url = new URL("https://serpapi.com/search");
    url.searchParams.append("engine", "google");
    url.searchParams.append("q", keyword);
    url.searchParams.append("location", location);
    url.searchParams.append("gl", "us");
    url.searchParams.append("hl", "en");
    url.searchParams.append("api_key", SERP_API_KEY);
    url.searchParams.append("num", "20");
    url.searchParams.append("include_html", "false");

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`SERP API error (${response.status}): ${errorText}`);
      throw new Error(`SERP API returned status: ${response.status} - ${errorText}`);
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
  } catch (error) {
    console.error(`SERP API Error: ${error.message}`);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
