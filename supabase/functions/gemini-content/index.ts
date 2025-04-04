
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
    console.log("Gemini content generation function received request");
    
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
    const { prompt, temperature = 0.7, maxOutputTokens = 2048 } = body;
    
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
    
    console.log(`Generating content with prompt: ${prompt.substring(0, 50)}...`);
    
    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature,
          maxOutputTokens,
          topP: 0.95,
          topK: 40,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Gemini API error: ${response.status} ${response.statusText}`, errorData);
      return new Response(
        JSON.stringify({
          success: false,
          error: `Failed to generate content: ${response.statusText}`,
          details: errorData
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: response.status,
        }
      );
    }
    
    const data = await response.json();
    
    // Extract the generated text from the response
    let content = "";
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
      content = data.candidates[0].content.parts
        .map((part: { text?: string }) => part.text || "")
        .join("");
    } else {
      console.error("Unexpected API response structure:", data);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Received invalid response format from Gemini API",
          details: JSON.stringify(data)
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }
    
    console.log("Successfully generated content");
    
    return new Response(
      JSON.stringify({
        success: true,
        content,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in Gemini content function:", error);
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
