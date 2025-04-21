
// supabase/functions/serpapi/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const SERP_API_KEY = Deno.env.get("SERP_API_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    console.log("SERP API function received request");

    // For testing/development - use mock data if no SERP API key
    let mockMode = false;
    if (!SERP_API_KEY) {
      console.log("SERP API key is not configured, using mock data");
      mockMode = true;
    }

    let requestData;
    try {
      requestData = await req.json();
    } catch (e) {
      console.error("Failed to parse request body:", e.message);
      return new Response(
        JSON.stringify({ success: false, error: "Invalid request body. Expected JSON." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    const { keyword, location = "us", engine = "google", type = "search" } = requestData;

    if (!keyword) {
      console.error("Missing required parameter: keyword");
      return new Response(
        JSON.stringify({ success: false, error: "Missing required parameter: keyword" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log(`SERP API request: keyword=${keyword}, location=${location}, engine=${engine}, type=${type}`);

    if (mockMode) {
      // Return mock data for testing
      const mockData = getMockSerpData(keyword, type);
      return new Response(
        JSON.stringify(mockData),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    let apiUrl;
    switch (type) {
      case "autocomplete":
        apiUrl = `https://serpapi.com/search?engine=google_autocomplete&q=${encodeURIComponent(keyword)}&gl=${location}&api_key=${SERP_API_KEY}`;
        break;
      case "related":
        apiUrl = `https://serpapi.com/search?engine=${engine}&q=${encodeURIComponent(keyword)}&gl=${location}&api_key=${SERP_API_KEY}&num=0`;
        break;
      default: // "search" or "organic"
        apiUrl = `https://serpapi.com/search?engine=${engine}&q=${encodeURIComponent(keyword)}&gl=${location}&api_key=${SERP_API_KEY}&num=20`;
    }

    console.log(`Sending request to SERP API: ${apiUrl.replace(SERP_API_KEY, "API_KEY_HIDDEN")}`);

    const response = await fetch(apiUrl);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`SERP API error: ${response.status} ${response.statusText}`, errorText);
      
      let errorMessage = "Error connecting to SERP API";
      try {
        // Try to parse error as JSON
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // If not JSON, use as is
        errorMessage = errorText.slice(0, 200) || errorMessage;
      }
      
      return new Response(
        JSON.stringify({
          error: errorMessage,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: response.status === 400 ? 400 : 500 }
      );
    }

    const data = await response.json();
    console.log("SERP API response received successfully");
    
    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error in SERP API edge function:", error.message);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

function getMockSerpData(keyword: string, type: string) {
  const getMockOrganic = () => {
    return Array(10).fill(0).map((_, i) => ({
      position: i + 1,
      title: `${i + 1}. Top Result for ${keyword} - Example Website ${i + 1}`,
      link: `https://example.com/result-${i + 1}`,
      snippet: `This is a sample snippet for result ${i + 1}. It includes information about ${keyword} and helps users understand what the page contains. The content is optimized for search engines and provides valuable insights.`,
      displayed_link: `example.com/result-${i + 1}`
    }));
  };
  
  const getMockRelatedQuestions = () => {
    return [
      { question: `What is the best ${keyword}?`, answer: "The best approach depends on your specific needs and goals." },
      { question: `How to learn ${keyword} for beginners?`, answer: "Beginners should start with the fundamentals and practice regularly." },
      { question: `Why is ${keyword} important?`, answer: "It's important because it helps achieve better results and efficiency." },
      { question: `How much does ${keyword} cost?`, answer: "Costs vary widely depending on scope and requirements." }
    ];
  };
  
  const getMockRelatedSearches = () => {
    return [
      { query: `${keyword} best practices` },
      { query: `${keyword} for beginners` },
      { query: `${keyword} examples` },
      { query: `${keyword} tools` },
      { query: `how to improve ${keyword}` },
      { query: `${keyword} vs alternative` },
      { query: `${keyword} tutorial` },
      { query: `${keyword} 2025` }
    ];
  };
  
  const getMockAutocomplete = () => {
    return [
      { value: `${keyword} best practices` },
      { value: `${keyword} for beginners` },
      { value: `${keyword} tools` },
      { value: `${keyword} examples` },
      { value: `${keyword} guide` }
    ];
  };
  
  const mockData = {
    organic_results: getMockOrganic(),
    related_questions: getMockRelatedQuestions(),
    related_searches: getMockRelatedSearches(),
    search_information: {
      total_results: 845000,
      time_taken_displayed: 0.53
    }
  };
  
  if (type === "autocomplete") {
    mockData.autocomplete = getMockAutocomplete();
  }
  
  return mockData;
}
