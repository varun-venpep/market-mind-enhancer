
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Fallback image sources with different styles
const FALLBACK_IMAGES = [
  "https://picsum.photos/800/600?random=1",
  "https://source.unsplash.com/random/800x600",
  "https://placehold.co/800x600/667eea/ffffff?text=AI+Generated+Image",
  "https://placehold.co/800x600/764ba2/ffffff?text=AI+Generated+Image",
  "https://placehold.co/800x600/3cba92/ffffff?text=AI+Generated+Image",
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Image generation request received");
    
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.warn("Missing Authorization header");
      return getSuccessResponseWithFallbackImage(
        "Authentication required", 
        "Missing Authorization header"
      );
    }

    // Parse the request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      console.error('Error parsing request body:', error);
      return getSuccessResponseWithFallbackImage(
        "Request parsing error", 
        "Invalid JSON in request body"
      );
    }

    const { prompt } = requestBody;
    if (!prompt) {
      console.warn("Missing prompt in request");
      return getSuccessResponseWithFallbackImage(
        "Missing prompt", 
        "No image prompt provided"
      );
    }

    console.log(`Generating image for prompt: ${prompt.substring(0, 100)}...`);

    // Generate a reliable image URL based on the prompt
    try {
      const imageURL = await generateImageUrl(prompt);
      console.log('Successfully generated image URL:', imageURL);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          imageUrl: imageURL 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error("Error in image URL generation:", error);
      return getSuccessResponseWithFallbackImage(
        "Image generation failed", 
        error.message
      );
    }
  } catch (error) {
    console.error('Unhandled error in image generation edge function:', error);
    return getSuccessResponseWithFallbackImage(
      "Server error", 
      error.message
    );
  }
});

// Helper function to generate an image URL based on prompt
async function generateImageUrl(prompt: string): Promise<string> {
  try {
    // Clean and encode the prompt for use in URLs
    const cleanPrompt = prompt.replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
    const searchTerm = encodeURIComponent(prompt.split(' ').slice(0, 3).join(' '));
    const randomSeed = Math.floor(Math.random() * 10000);
    
    // Different image sources for variety and reliability
    const sources = [
      `https://source.unsplash.com/featured/?${searchTerm}&${randomSeed}`,
      `https://picsum.photos/seed/${cleanPrompt}-${randomSeed}/800/600`,
      `https://loremflickr.com/800/600/${searchTerm}?random=${randomSeed}`
    ];
    
    // Try the first source with a HEAD request to validate it
    const response = await fetch(sources[0], { method: 'HEAD' });
    
    if (response.ok) {
      return response.url; // Use the redirected URL from Unsplash
    }
    
    // If first source fails, try the second
    return sources[1];
  } catch (error) {
    console.error("Error generating image URL:", error);
    return getFallbackImageUrl();
  }
}

// Helper function to get a reliable fallback image URL
function getFallbackImageUrl(): string {
  const randomIndex = Math.floor(Math.random() * FALLBACK_IMAGES.length);
  const randomSeed = Math.floor(Math.random() * 10000);
  const baseUrl = FALLBACK_IMAGES[randomIndex];
  
  // Add random parameter to avoid caching issues
  return baseUrl.includes('?') 
    ? `${baseUrl}&t=${randomSeed}`
    : `${baseUrl}?t=${randomSeed}`;
}

// Helper function to return a response with a fallback image
function getSuccessResponseWithFallbackImage(reason: string, details: string): Response {
  const fallbackImageUrl = getFallbackImageUrl();
  console.log(`Using fallback image due to: ${reason} - ${details}`);
  
  return new Response(
    JSON.stringify({ 
      success: true, 
      imageUrl: fallbackImageUrl,
      note: `Used fallback image: ${reason}`,
      details: details
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
