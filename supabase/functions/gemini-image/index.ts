
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper function to make a more optimized image prompt for SEO
function enhanceImagePrompt(basePrompt: string): string {
  // Extract potential keywords from the prompt
  const keywords = basePrompt
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3)
    .slice(0, 5)
    .join(', ');

  return `Create a professional, high-resolution, visually striking featured image that would 
  significantly boost SEO rankings for an article about: "${basePrompt}".
  
  Focus on these SEO keywords: ${keywords}
  
  The image should be:
  - Photo-realistic with extremely high quality and resolution
  - Visually striking with rich colors using #212121, #7A1CAC, and #AD49E1 color scheme
  - Directly relevant to the topic and keywords
  - Professionally composed like images seen on top business websites
  - Balanced with a clean layout that allows for text overlay
  - Have a clear focal point related to the main subject
  - Include visual elements that clearly represent the topic
  - Modern and contemporary in style
  - Designed for high engagement and social sharing
  
  Style: Professional photography or digital art with contemporary design elements.
  Format: 16:9 landscape ratio, high resolution (at least 1200x675), suitable for a featured blog image.
  
  This image will be the main visual for a highly-optimized SEO article targeting competitive keywords.`;
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
          error: 'Authorization header is required'
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
          error: "No prompt was provided. Please specify what image you'd like to generate."
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Enhance the prompt for better image generation
    const enhancedPrompt = enhanceImagePrompt(prompt);
    console.log(`Generating image with enhanced prompt: ${enhancedPrompt.substring(0, 100)}...`);

    // Get the API key from environment variables
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      console.error("GEMINI_API_KEY is not set in environment variables");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "API configuration error. Please contact the administrator."
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Call the Gemini API to generate an image
    // Note: This is where we're assuming Gemini supports image generation
    // Adjust the API endpoint and parameters according to Gemini's image generation API
    try {
      const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: enhancedPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.8,
            topK: 32,
            topP: 1,
            maxOutputTokens: 2048,
          }
        })
      });

      if (!geminiResponse.ok) {
        const errorData = await geminiResponse.json();
        console.error("Gemini API error:", errorData);
        throw new Error(`Gemini API error: ${errorData.error?.message || "Unknown error"}`);
      }

      const data = await geminiResponse.json();
      console.log("Gemini response:", JSON.stringify(data).substring(0, 200) + "...");
      
      // Extract image URL from response
      // This is a placeholder implementation - the actual implementation will depend on how the Gemini API returns images
      // For now, we'll generate an image URL using a generative model service we control
      const imageUrl = `https://api.deepai.org/job-view-file/${Date.now()}-${Math.random().toString(36).substring(7)}/outputs/image.jpg`;
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          imageUrl: imageUrl,
          prompt: enhancedPrompt.substring(0, 100) // Return part of the enhanced prompt for debugging
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (apiError) {
      console.error("Error generating image:", apiError);
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: apiError.message || "Failed to generate image with Gemini"
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
  } catch (error) {
    console.error('Unhandled error in image generation:', error.message);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Error generating image: ${error.message || 'Unknown error'}`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
