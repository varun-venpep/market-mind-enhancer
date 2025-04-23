
// Only generate images using Gemini (do not fallback or use Unsplash, picsum, etc)

import { supabase } from "@/integrations/supabase/client";

type ContentGenerationOptions = {
  temperature?: number;
  maxOutputTokens?: number;
};

export async function generateContent(
  prompt: string, 
  options: ContentGenerationOptions = {}
): Promise<string> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) throw new Error("Authentication required to use Gemini API");

    const response = await supabase.functions.invoke("gemini-content", {
      body: { 
        prompt,
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.maxOutputTokens || 2048
      },
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.error) throw new Error(response.error.message || "Failed to generate content");
    if (!response.data) throw new Error("Received invalid response from Gemini API");

    const { success, error, content, fallbackContent } = response.data;
    if (!success && fallbackContent) return fallbackContent;
    if (!success) throw new Error(error || "Failed to generate content");
    if (!content || typeof content !== 'string') throw new Error("Received empty or invalid content from Gemini API");

    return content;
  } catch (error) {
    console.error("Gemini content generation error:", error);
    throw error;
  }
}

// Exclusively use gemini-image function, no fallbacks
export async function generateImage(
  prompt: string
): Promise<string> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) throw new Error("Authentication required to use image generation");

    // Call gemini-image only
    const response = await supabase.functions.invoke("gemini-image", {
      body: { prompt },
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.error) {
      console.error("Error from gemini-image function:", response.error);
      throw new Error(response.error.message || "Failed to generate image");
    }
    
    if (!response.data) {
      throw new Error("Image Generation API returned unexpected response.");
    }

    const { success, error, imageUrl } = response.data;
    
    if (!success) {
      console.error("Gemini image generation failed:", error);
      throw new Error(error || "Failed to generate image");
    }
    
    if (!imageUrl || typeof imageUrl !== 'string') {
      throw new Error("Received empty or invalid image URL from Gemini image generation API");
    }

    return imageUrl;
  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
}
