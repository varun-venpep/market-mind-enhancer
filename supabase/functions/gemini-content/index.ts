
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
        JSON.stringify({ success: false, error: 'Authorization header is required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (error) {
      console.error("Error parsing request body:", error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Failed to parse request. Please try again." 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const { prompt, temperature = 0.7, maxOutputTokens = 4096 } = requestBody;
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "No prompt was provided. Please specify what content you'd like to generate." 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Generating content with prompt of length: ${prompt.length} characters`);

    // Get the API key from environment variables
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      console.error("GEMINI_API_KEY is not set in environment variables");
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "API configuration error. Please contact the administrator.",
          fallbackContent: `# Generated Content\n\nWe're experiencing some technical difficulties with our AI service.\n\nThis is placeholder content related to: "${prompt.substring(0, 50)}..."`
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Enhanced system prompt for SEO-optimized content generation
    const enhancedPrompt = {
      contents: [
        {
          parts: [
            {
              text: `You are an expert SEO content creator and copywriter. Create content that is:
              
1. Highly optimized for search engines
2. Engaging and readable
3. Well-structured with proper headers (H2, H3)
4. Includes strategic keyword placement
5. Has meta descriptions and title tags
6. Contains both short and long paragraphs for better readability
7. Includes bullet points and numbered lists where appropriate
8. Contains clear calls to action (CTAs)

The content should follow SEO best practices including:
- Proper keyword density (2-3% without keyword stuffing)
- Optimized meta title and description
- Including the target keyword in the first 100 words
- Using relevant LSI keywords and long-tail variations
- Having a readable Flesch-Kincaid score (aim for 60-70)
- Maintain proper header hierarchy (H1 followed by H2s, then H3s)
- Using short paragraphs and sentences
- Including internal and external linking opportunities

Now, produce high-quality SEO content based on the following brief:

${prompt}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: temperature,
        maxOutputTokens: maxOutputTokens,
        topP: 0.9,
        topK: 40
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    // Call the Gemini API
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`;
      
      console.log("Calling Gemini API with enhanced SEO prompt");
      const apiResponse = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enhancedPrompt)
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        console.error("Gemini API Error:", errorData);
        throw new Error(`Gemini API returned status ${apiResponse.status}: ${JSON.stringify(errorData)}`);
      }

      const data = await apiResponse.json();
      console.log("Received response from Gemini API");

      // Extract the content from the response
      if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
        const content = data.candidates[0].content.parts.map(part => part.text).join('');
        console.log(`Generated ${content.length} characters of content`);
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            content 
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        throw new Error("Unexpected response structure from Gemini API");
      }
    } catch (apiError) {
      console.error("Error calling Gemini API:", apiError);
      
      // Generate fallback content in case of API failure
      const fallbackContent = `# ${prompt.substring(0, 50)}...\n\nWe apologize, but we couldn't generate the content you requested due to a technical issue. Please try again later.`;
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: apiError.message || "Failed to generate content with Gemini API",
          fallbackContent 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
  } catch (error) {
    console.error('Unhandled error in content generation:', error.message);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Error generating content: ${error.message || 'Unknown error'}`,
        fallbackContent: `# Error Occurred\n\nWe encountered an issue while generating your content. Here's some placeholder text instead.\n\nError details: ${error.message || 'Unknown error'}` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
