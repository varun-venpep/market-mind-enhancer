
import { supabase } from "@/integrations/supabase/client";

// TinyMCE API key
const TINY_API_KEY = "sjsagtygodshm478878dcwpawc0wf0cairx5rqlj3kgobssk";

export async function getTinyMceApiKey(): Promise<string> {
  try {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log('No active session, using default TinyMCE API key');
      return TINY_API_KEY;
    }

    // Try to fetch from edge function if it exists
    try {
      const { data: functionData, error } = await supabase.functions.invoke("tiny-key", {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      
      if (error) throw error;
      if (functionData?.data?.key) {
        console.log("Retrieved TinyMCE API key from edge function");
        return functionData.data.key;
      }
    } catch (functionError) {
      console.log("Edge function not available or errored, using default key", functionError);
    }

    // Return the API key
    return TINY_API_KEY;
  } catch (error) {
    console.error('Error fetching TinyMCE API key:', error);
    return TINY_API_KEY;
  }
}
