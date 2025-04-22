
import { invokeFunction } from "./supabase/functions";
import { toast } from "sonner";

export async function searchKeywords(keyword: string, options = {}) {
  try {
    console.log('Searching keywords with SERP API:', keyword);
    const result = await invokeFunction('serpapi', { 
      keyword, 
      ...options 
    });
    
    if (!result || result.error) {
      console.error("SERP API error:", result?.error || "Unknown error");
      throw new Error(result?.error || 'Failed to get SERP results');
    }
    
    console.log('SERP API result received:', result ? 'success' : 'failed');
    return result;
  } catch (error) {
    console.error('Error searching keywords:', error);
    toast.error('Error fetching search data. Using mock data as fallback.');
    
    // If the API fails, use mock data as fallback
    const mockData = getMockSerpData(keyword);
    console.warn('Using mock SERP data due to API error:', error);
    return mockData;
  }
}

export async function fetchSerpResults(keyword: string, options = {}) {
  try {
    console.log('Fetching SERP results for:', keyword);
    return await searchKeywords(keyword, options);
  } catch (error) {
    console.error('Error fetching SERP results:', error);
    throw error;
  }
}

export function extractSerpData(data: any) {
  try {
    // Parse the keywords and add required properties
    const relatedKeywords = data.related_searches?.map((item: any, index: number) => ({
      id: `kw-${index}`,
      keyword: item.query || item,
      searchVolume: Math.floor(Math.random() * 10000), // Mock data for search volume
      difficulty: Math.floor(Math.random() * 100), // Mock data for difficulty
      cpc: parseFloat((Math.random() * 5).toFixed(2)), // Mock data for CPC
      aiPotential: Math.floor(Math.random() * 25) + 75, // High potential for all keywords
    })) || [];

    return {
      organicResults: data.organic_results || [],
      relatedKeywords: relatedKeywords,
      relatedQuestions: data.related_questions?.map((q: any) => q.question) || 
                       data.people_also_ask?.map((q: any) => q.question) || [],
      peopleAlsoAsk: data.people_also_ask || [],
      searchMetadata: data.search_metadata || {},
      localPack: data.local_pack || null,
      knowledgeGraph: data.knowledge_graph || null,
    };
  } catch (error) {
    console.error('Error extracting SERP data:', error);
    return {
      organicResults: [],
      relatedKeywords: [],
      relatedQuestions: [],
      peopleAlsoAsk: [],
      searchMetadata: {},
      localPack: null,
      knowledgeGraph: null,
    };
  }
}

// Helper function to generate mock data when the API call fails
function getMockSerpData(keyword: string) {
  return {
    organic_results: Array(10).fill(0).map((_, i) => ({
      position: i + 1,
      title: `${i + 1}. Top Result for ${keyword} - Example Website ${i + 1}`,
      link: `https://example.com/result-${i + 1}`,
      snippet: `This is a sample snippet for result ${i + 1}. It includes information about ${keyword} and helps users understand what the page contains.`,
      displayed_link: `example.com/result-${i + 1}`
    })),
    related_questions: [
      { question: `What is the best ${keyword}?` },
      { question: `How to learn ${keyword} for beginners?` },
      { question: `Why is ${keyword} important?` },
      { question: `How much does ${keyword} cost?` }
    ],
    related_searches: [
      { query: `${keyword} best practices` },
      { query: `${keyword} for beginners` },
      { query: `${keyword} examples` },
      { query: `${keyword} tools` },
      { query: `how to improve ${keyword}` },
      { query: `${keyword} vs alternative` },
      { query: `${keyword} tutorial` },
      { query: `${keyword} 2025` }
    ],
    search_information: {
      total_results: 845000,
      time_taken_displayed: 0.53
    }
  };
}

export default { searchKeywords, fetchSerpResults, extractSerpData };
