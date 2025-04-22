
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
    throw error;
  }
}

export async function fetchSerpResults(keyword: string, options = {}) {
  try {
    console.log('Fetching SERP results for:', keyword);
    return await searchKeywords(keyword, options);
  } catch (error) {
    console.error('Error fetching SERP results:', error);
    toast.error(`Error fetching search data: ${error.message || 'Unknown error'}`);
    throw error;
  }
}

export function extractSerpData(data: any) {
  try {
    if (!data) {
      throw new Error('No SERP data received');
    }
    
    // Parse the keywords and add required properties
    const relatedKeywords = data.related_searches?.map((item: any, index: number) => {
      const query = typeof item === 'string' ? item : (item.query || '');
      // Generate random but consistent data for search metrics
      const seed = query.length + index;
      const volume = Math.floor((seed * 100) % 10000 + 500);
      const difficulty = Math.floor((seed * 7) % 100);
      const cpc = Number(((seed * 0.05) % 5).toFixed(2));
      
      return {
        id: `kw-${index}`,
        keyword: query,
        searchVolume: volume,
        difficulty: difficulty,
        cpc: cpc,
        aiPotential: Math.floor((seed * 3) % 25) + 75,
      };
    }) || [];

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
    throw error;
  }
}

export default { searchKeywords, fetchSerpResults, extractSerpData };
