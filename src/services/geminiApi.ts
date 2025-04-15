
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
    // Provide fallback content to prevent application from breaking
    return `# Generated Content\n\nWe're experiencing some technical difficulties. Here's some placeholder content related to your request.\n\n## Key Points\n\n* This is an automatically generated fallback due to a service disruption\n* Your original request was about: "${prompt.substring(0, 50)}..."\n* Please try again later or contact support if the issue persists`;
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
    
    console.log("Calling gemini-image edge function with prompt:", prompt.substring(0, 50) + "...");
    
    const response = await supabase.functions.invoke("gemini-image", {
      body: { prompt },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Check for errors
    if (response.error) {
      console.error("Image Generation Error:", response.error);
      // Provide a fallback image URL
      return "https://picsum.photos/800/600?random=" + Math.floor(Math.random() * 1000);
    }

    // Ensure data exists
    if (!response.data) {
      console.error("Image Generation API returned unexpected response:", response);
      // Provide a fallback image URL
      return "https://picsum.photos/800/600?random=" + Math.floor(Math.random() * 1000);
    }

    const { success, error, imageUrl } = response.data;

    // Check Edge Function response
    if (!success) {
      console.error("Image Generation API returned an error:", error || "Unknown error");
      // Provide a fallback image URL
      return "https://picsum.photos/800/600?random=" + Math.floor(Math.random() * 1000);
    }

    // If imageUrl is empty or invalid, return a fallback
    if (!imageUrl || typeof imageUrl !== 'string') {
      console.error("Received empty or invalid image URL from image generation API");
      // Provide a fallback image URL
      return "https://picsum.photos/800/600?random=" + Math.floor(Math.random() * 1000);
    }

    return imageUrl;
  } catch (error) {
    console.error("Image Generation Client Error:", error);
    // Always return a fallback image URL to prevent the application from breaking
    return "https://picsum.photos/800/600?random=" + Math.floor(Math.random() * 1000);
  }
}
