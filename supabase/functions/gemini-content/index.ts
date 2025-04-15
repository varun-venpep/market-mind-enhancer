
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
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { prompt, temperature = 0.7, maxOutputTokens = 1024 } = requestBody;
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ success: false, error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating content with prompt of length: ${prompt.length} characters`);

    // In a real implementation, we would call the Gemini API here
    // For now, we'll generate some placeholder content based on the prompt
    const generatePlaceholderContent = (prompt: string) => {
      try {
        const maxWords = 500;
        const topics = prompt.split(' ').filter(word => word.length > 5);
        
        const intro = `# Introduction to ${topics[0] || 'the Topic'}\n\nWelcome to this comprehensive guide about ${topics[0] || 'this topic'}. In this article, we'll explore various aspects and provide valuable insights.\n\n`;
        
        const sections = topics.slice(0, 3).map((topic, index) => 
          `## Section ${index + 1}: Understanding ${topic}\n\nThis section covers important details about ${topic}. It's essential to understand these concepts before moving forward.\n\n* Key point 1 about ${topic}\n* Key point 2 about ${topic}\n* Key point 3 about ${topic}\n\n`
        ).join('');
        
        const tips = `## Tips and Best Practices\n\n1. First tip related to ${topics[0] || 'the topic'}\n2. Second tip for better results\n3. Third important consideration\n\n`;
        
        const conclusion = `## Conclusion\n\nIn this article, we've covered ${topics[0] || 'the main topic'} in detail. Remember the key points discussed and apply them to achieve better results.`;
        
        return intro + sections + tips + conclusion;
      } catch (error) {
        console.error('Error generating placeholder content:', error);
        return `# Generated Content\n\nThis is placeholder content for "${prompt.substring(0, 50)}..."`;
      }
    };

    const content = generatePlaceholderContent(prompt);
    console.log(`Generated content of length: ${content.length} characters`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        content 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'An unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
