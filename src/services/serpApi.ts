
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

export default { searchKeywords };
