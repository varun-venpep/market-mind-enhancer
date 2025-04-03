// supabase/functions/serpapi/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const SERP_API_KEY = Deno.env.get("SERP_API_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    console.log("SERP API function received request");

    if (!SERP_API_KEY) {
      console.error("SERP API key is not configured");
      return new Response(
        JSON.stringify({
          success: false,
          error: "SERP API key not configured"
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    let requestData;
    try {
      requestData = await req.json();
    } catch (e) {
      console.error("Failed to parse request body:", e.message);
      return new Response(
        JSON.stringify({ success: false, error: "Invalid request body. Expected JSON." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const { keyword, location = "us", engine = "google", type = "search" } = requestData;

    if (!keyword) {
      console.error("Missing required parameter: keyword");
      return new Response(
        JSON.stringify({ success: false, error: "Missing required parameter: keyword" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log(`SERP API request: keyword=${keyword}, location=${location}, engine=${engine}, type=${type}`);

    let apiUrl;
    switch (type) {
      case "autocomplete":
        apiUrl = `https://serpapi.com/search?engine=google_autocomplete&q=${encodeURIComponent(keyword)}&gl=${location}&api_key=${SERP_API_KEY}`;
        break;
      case "related":
        apiUrl = `https://serpapi.com/search?engine=${engine}&q=${encodeURIComponent(keyword)}&gl=${location}&api_key=${SERP_API_KEY}&num=0`;
        break;
      default: // "search" or "organic"
        apiUrl = `https://serpapi.com/search?engine=${engine}&q=${encodeURIComponent(keyword)}&gl=${location}&api_key=${SERP_API_KEY}&num=20`;
    }

    console.log(`Sending request to SERP API: ${apiUrl.replace(SERP_API_KEY, "API_KEY_HIDDEN")}`);

    const response = await fetch(apiUrl);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`SERP API error: ${response.status} ${response.statusText}`, errorText);
      return new Response(
        JSON.stringify({
          success: false,
          error: `SERP API error: ${response.status} ${response.statusText}`,
          details: errorText
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: response.status === 400 ? 400 : 500 }
      );
    }

    const data = await response.json();
    console.log("SERP API response received successfully");

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error in SERP API edge function:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Unknown error occurred" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});