
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "AIzaSyD_e9waaKFm1O8Wa0prngusI8tSp0IgvNY";

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
    
    // Call Gemini for text-to-image generation
    // Note: Gemini's image generation capabilities are still evolving
    // For now, we're using a free alternative image generation service
    const imageServiceUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;
    
    try {
      // Verify the image service is accessible
      const response = await fetch(imageServiceUrl, { method: "HEAD" });
      
      if (!response.ok) {
        throw new Error(`Image service error: ${response.status} ${response.statusText}`);
      }
      
      // Return the image URL
      // pollinations.ai provides direct image URLs based on the prompt
      return new Response(
        JSON.stringify({
          success: true,
          imageUrl: imageServiceUrl,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    } catch (imgError) {
      console.error("Error accessing image service:", imgError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to generate image. Image service unavailable.",
          details: imgError instanceof Error ? imgError.message : "Unknown error"
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
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
