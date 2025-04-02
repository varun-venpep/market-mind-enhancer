
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
    
    // Get auth token
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    
    if (!token) {
      throw new Error('Authentication required to use SERP API');
    }
    
    const { data, error } = await supabase.functions.invoke("serpapi", {
      body: { keyword, location, engine, type },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (error) {
      console.error("SERP API Error:", error);
      throw new Error(error.message || "Failed to fetch SERP results");
    }

    if (!data || !data.data) {
      console.error("SERP API returned unexpected data structure:", data);
      throw new Error("Received invalid data format from SERP API");
    }

    console.log(`Successfully retrieved SERP data for: ${keyword}`);
    return data.data;
  } catch (error) {
    console.error("SERP API Client Error:", error);
    throw error;
  }
}

export function extractSerpData(data: SerpApiResponse) {
  // Extract SERP results in a format suitable for our application
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
    searchVolume: Math.floor(Math.random() * 5000) + 500, // Placeholder
    difficulty: Math.floor(Math.random() * 70) + 20, // Placeholder
    aiPotential: Math.floor(Math.random() * 90) + 10, // Placeholder
    cpc: Number((Math.random() * 5).toFixed(2)) // Placeholder
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
    return [];
  }
}

export async function getRelatedKeywords(keyword: string): Promise<string[]> {
  try {
    const response = await fetchSerpResults(keyword, { type: "related" });
    return (response.related_searches || []).map(item => item.query);
  } catch (error) {
    console.error("Error fetching related keywords:", error);
    return [];
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
