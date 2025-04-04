
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    console.log("Gemini image generation function received request");
    
    if (!GEMINI_API_KEY) {
      console.error("Missing Gemini API key");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Gemini API key not configured. Please check your environment variables.",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Parse request body
    const body = await req.json();
    const { prompt } = body;
    
    if (!prompt) {
      console.error("Missing required prompt");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required prompt parameter",
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    console.log(`Generating image with prompt: ${prompt.substring(0, 50)}...`);
    
    // Call Gemini API for image generation model
    // Note: This is a simplified implementation as Gemini's image generation capabilities
    // are still limited. For now, we'll use a free image generation API.
    const response = await fetch(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`, {
      method: "GET"
    });
    
    if (!response.ok) {
      console.error(`Image generation API error: ${response.status} ${response.statusText}`);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Failed to generate image: ${response.statusText}`,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: response.status,
        }
      );
    }
    
    // Get the final URL after redirects
    const imageUrl = response.url;
    
    console.log("Successfully generated image:", imageUrl);
    
    return new Response(
      JSON.stringify({
        success: true,
        imageUrl,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in image generation function:", error);
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
