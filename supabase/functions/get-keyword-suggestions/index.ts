
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, language = 'en' } = await req.json();
    const serpApiKey = Deno.env.get('SERP_API_KEY');

    if (!serpApiKey) {
      throw new Error('SERP API key not configured');
    }

    const searchUrl = `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${serpApiKey}&engine=google&gl=${language}`;
    const response = await fetch(searchUrl);
    const data = await response.json();

    // Extract related searches and popular keywords
    const relatedSearches = data.related_searches?.map((item: any) => item.query) || [];
    const peopleAlsoAsk = data.people_also_ask?.map((item: any) => item.question) || [];
    
    // Combine and deduplicate keywords
    const allKeywords = [...new Set([...relatedSearches, ...peopleAlsoAsk])].slice(0, 10);

    return new Response(
      JSON.stringify({ keywords: allKeywords }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
