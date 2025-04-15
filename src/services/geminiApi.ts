
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
    
    if (!token) {
      throw new Error("Authentication required to use Gemini API");
    }
    
    const response = await supabase.functions.invoke("gemini-content", {
      body: { 
        prompt,
        temperature: options.temperature || 0.7,
        maxOutputTokens: options.maxOutputTokens || 2048
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Check for errors in the response
    if (response.error) {
      console.error("Gemini API Error:", response.error);
      throw new Error(response.error.message || "Failed to generate content");
    }

    // Ensure data exists
    if (!response.data) {
      console.error("Gemini API returned unexpected response:", response);
      throw new Error("Received invalid response from Gemini API");
    }

    const { success, error, content } = response.data;

    // Check Edge Function response
    if (!success) {
      console.error("Gemini API returned an error:", error || "Unknown error");
      throw new Error(error || "Failed to generate content");
    }

    // If content is empty or invalid, throw an error
    if (!content || typeof content !== 'string') {
      throw new Error("Received empty or invalid content from Gemini API");
    }

    return content;
  } catch (error) {
    console.error("Gemini API Client Error:", error);
    throw error;
  }
}

export async function generateImage(
  prompt: string
): Promise<string> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    
    if (!token) {
      throw new Error("Authentication required to use image generation");
    }
    
    const response = await supabase.functions.invoke("gemini-image", {
      body: { prompt },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Check for errors
    if (response.error) {
      console.error("Image Generation Error:", response.error);
      throw new Error(response.error.message || "Failed to generate image");
    }

    // Ensure data exists
    if (!response.data) {
      console.error("Image Generation API returned unexpected response:", response);
      throw new Error("Received invalid response from image generation API");
    }

    const { success, error, imageUrl } = response.data;

    // Check Edge Function response
    if (!success) {
      console.error("Image Generation API returned an error:", error || "Unknown error");
      throw new Error(error || "Failed to generate image");
    }

    // If imageUrl is empty or invalid, throw an error
    if (!imageUrl || typeof imageUrl !== 'string') {
      throw new Error("Received empty or invalid image URL from image generation API");
    }

    return imageUrl;
  } catch (error) {
    console.error("Image Generation Client Error:", error);
    throw error;
  }
}
