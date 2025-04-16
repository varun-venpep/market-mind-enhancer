
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

    // Return the API key
    return TINY_API_KEY;
  } catch (error) {
    console.error('Error fetching TinyMCE API key:', error);
    return TINY_API_KEY;
  }
}
