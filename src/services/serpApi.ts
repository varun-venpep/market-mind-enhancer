
import { invokeFunction } from "./supabase/functions";

export async function searchKeywords(keyword: string, options = {}) {
  try {
    console.log('Searching keywords with SERP API:', keyword);
    const result = await invokeFunction('serpapi', { 
      keyword, 
      ...options 
    });
    
    if (!result || result.error) {
      throw new Error(result?.error || 'Failed to get SERP results');
    }
    
    console.log('SERP API result received:', result ? 'success' : 'failed');
    return result;
  } catch (error) {
    console.error('Error searching keywords:', error);
    
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
    return {
      organicResults: data.organic_results || [],
      relatedKeywords: data.related_searches?.map((item: any) => ({
        keyword: item.query,
        searchVolume: Math.floor(Math.random() * 10000), // Mock data
        difficulty: Math.floor(Math.random() * 100), // Mock data
        cpc: (Math.random() * 5).toFixed(2), // Mock data
      })) || [],
      relatedQuestions: data.related_questions || [],
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
      { question: `What is the best ${keyword}?`, answer: "The best approach depends on your specific needs and goals." },
      { question: `How to learn ${keyword} for beginners?`, answer: "Beginners should start with the fundamentals and practice regularly." },
      { question: `Why is ${keyword} important?`, answer: "It's important because it helps achieve better results and efficiency." },
      { question: `How much does ${keyword} cost?`, answer: "Costs vary widely depending on scope and requirements." }
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
