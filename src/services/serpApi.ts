
import { supabase } from "@/integrations/supabase/client";
import { getAuthToken } from "./supabaseUtils";

export async function searchKeywords(keyword: string, options = {}) {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }
    const { data, error } = await supabase.functions.invoke('serpapi', {
      body: { keyword, ...options },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error searching keywords:', error);
    throw error;
  }
}

export async function fetchSerpResults(keyword: string, options = {}) {
  try {
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

export default { searchKeywords, fetchSerpResults, extractSerpData };
