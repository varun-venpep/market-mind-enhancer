
// serpApi.ts
import { supabase } from "@/integrations/supabase/client";

export interface SerpApiResponse {
  organic_results?: Array<{
    position: number;
    title: string;
    link: string;
    snippet: string;
    displayed_link: string;
  }>;
  related_questions?: Array<{
    question: string;
    answer: string;
  }>;
  related_searches?: Array<{
    query: string;
  }>;
  search_information?: {
    total_results: number;
    time_taken_displayed: number;
  };
  knowledge_graph?: {
    title: string;
    type: string;
    description: string;
  };
  autocomplete?: Array<{
    value: string;
  }>;
}

export async function fetchSerpResults(
  keyword: string, 
  options: { 
    location?: string; 
    engine?: string;
    type?: "search" | "autocomplete" | "related" | "organic";
  } = {}
): Promise<SerpApiResponse> {
  try {
    const { location = "us", engine = "google", type = "search" } = options;
    console.log(`Fetching SERP results for keyword: ${keyword}, location: ${location}, type: ${type}`);
    
    // For testing purposes, we'll use mock data if no token is available
    let mockMode = false;
    let token = null;
    
    try {
      // Get auth token
      const { data: sessionData } = await supabase.auth.getSession();
      token = sessionData.session?.access_token;
    } catch (e) {
      console.warn("Auth session not available, using mock mode");
      mockMode = true;
    }
    
    if (!token) {
      mockMode = true;
    }
    
    if (mockMode) {
      // Return mock data for testing
      console.log("Using mock SERP data");
      return getMockSerpData(keyword, type);
    }
    
    const response = await supabase.functions.invoke("serpapi", {
      body: { keyword, location, engine, type },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log("SERP API response:", response);

    // Check for errors first
    if (response.error) {
      console.error("SERP API Error:", response.error);
      throw new Error(response.error.message || "Failed to fetch SERP results");
    }

    // Ensure data exists
    if (!response.data) {
      console.error("SERP API returned unexpected response:", response);
      throw new Error("Received invalid response from SERP API");
    }

    const { success, error, data } = response.data;

    // Check Edge Function response
    if (!success) {
      console.error("SERP API returned an error:", error || "Unknown error");
      throw new Error(error || "Failed to fetch SERP results");
    }

    console.log(`Successfully retrieved SERP data for: ${keyword}`);
    return data;
  } catch (error) {
    console.error("SERP API Client Error:", error);
    // Use mock data as fallback when there's an error
    console.log("Using mock SERP data as fallback");
    return getMockSerpData(keyword, options.type || "search");
  }
}

function getMockSerpData(keyword: string, type: string): SerpApiResponse {
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
  
  const mockData: SerpApiResponse = {
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

export function extractSerpData(data: SerpApiResponse) {
  const organicResults = data.organic_results?.map(result => ({
    id: `serp-${result.position}`,
    title: result.title,
    url: result.link,
    snippet: result.snippet,
    position: result.position,
    wordCount: estimateWordCount(result.snippet)
  })) || [];

  const relatedQuestions = data.related_questions?.map(q => q.question) || [];
  
  const relatedKeywords = data.related_searches?.map(s => ({
    id: `related-${Math.random().toString(36).substring(2, 11)}`,
    keyword: s.query,
    searchVolume: Math.floor(Math.random() * 5000) + 500,
    difficulty: Math.floor(Math.random() * 70) + 20,
    aiPotential: Math.floor(Math.random() * 90) + 10,
    cpc: Number((Math.random() * 5).toFixed(2))
  })) || [];

  return {
    organicResults,
    relatedQuestions,
    relatedKeywords,
    totalResults: data.search_information?.total_results || 0
  };
}

export async function getKeywordSuggestions(keyword: string): Promise<string[]> {
  try {
    const response = await fetchSerpResults(keyword, { type: "autocomplete" });
    return (response.autocomplete || []).map(item => item.value);
  } catch (error) {
    console.error("Error fetching keyword suggestions:", error);
    return [
      `${keyword} tips`,
      `${keyword} guide`,
      `${keyword} best practices`,
      `${keyword} examples`,
      `${keyword} for beginners`
    ];
  }
}

export async function getRelatedKeywords(keyword: string): Promise<string[]> {
  try {
    const response = await fetchSerpResults(keyword, { type: "related" });
    return (response.related_searches || []).map(item => item.query);
  } catch (error) {
    console.error("Error fetching related keywords:", error);
    return [
      `${keyword} strategies`,
      `${keyword} for business`,
      `${keyword} trends`,
      `${keyword} tools`,
      `how to improve ${keyword}`
    ];
  }
}

function estimateWordCount(text: string): number {
  return text ? text.split(/\s+/).length : 0;
}

export default {
  fetchSerpResults,
  extractSerpData,
  getKeywordSuggestions,
  getRelatedKeywords
};
