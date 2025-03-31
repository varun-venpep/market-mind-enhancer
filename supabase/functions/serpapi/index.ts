
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const SERP_API_KEY = "3c72d7e11aed80bff312ca7cbcd61ea8676b9fd3b4697350f9e9426601091cf0";

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { keyword, location = "us" } = await req.json();

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

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`SERP API returned status: ${response.status}`);
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
