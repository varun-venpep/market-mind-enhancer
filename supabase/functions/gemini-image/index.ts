
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper function to generate a placeholder image URL with a seed
function getPlaceholderImageUrl(seed = Math.floor(Math.random() * 1000)) {
  return `https://picsum.photos/seed/${seed}/800/600`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Authorization header is required',
          imageUrl: getPlaceholderImageUrl()
        }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { prompt } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "No prompt was provided. Please specify what image you'd like to generate.",
          imageUrl: getPlaceholderImageUrl()
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Generating image with prompt: ${prompt.substring(0, 100)}...`);

    // Get the API key from environment variables
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      console.error("GEMINI_API_KEY is not set in environment variables");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "API configuration error. Please contact the administrator.",
          imageUrl: getPlaceholderImageUrl()
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    try {
      // Currently, Gemini doesn't have a direct image generation endpoint like DALL-E
      // For now, we'll use a placeholder image service with the seed derived from the hash of the prompt
      // This ensures the same prompt always returns the same image
      
      // When Gemini adds direct image generation, replace this code with the actual API call
      const promptHash = prompt.split('').reduce((hash, char) => char.charCodeAt(0) + hash, 0);
      const imageUrl = getPlaceholderImageUrl(promptHash);
      
      console.log(`Generated placeholder image URL: ${imageUrl}`);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          imageUrl: imageUrl
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (apiError) {
      console.error("Error generating image:", apiError);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: apiError.message || "Failed to generate image",
          imageUrl: getPlaceholderImageUrl()
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
  } catch (error) {
    console.error('Unhandled error in image generation:', error.message);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Error generating image: ${error.message || 'Unknown error'}`,
        imageUrl: getPlaceholderImageUrl()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
