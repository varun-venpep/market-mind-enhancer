
import { supabase } from "@/integrations/supabase/client";

// Fallback TinyMCE API key
const FALLBACK_TINY_API_KEY = "sjsagtygodshm478878dcwpawc0wf0cairx5rqlj3kgobssk";

export async function getTinyMceApiKey(): Promise<string> {
  try {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.log('No active session, using fallback TinyMCE API key');
      return FALLBACK_TINY_API_KEY;
    }

    // Use the Supabase URL from environment or hardcoded value
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://zcftdyamlgcvnduafxzj.supabase.co";
    
    // Call the edge function with the access token
    const response = await fetch(`${supabaseUrl}/functions/v1/tiny-key`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.warn('Failed to fetch TinyMCE API key from edge function, using fallback:', errorData.error);
      return FALLBACK_TINY_API_KEY;
    }

    const data = await response.json();
    console.log('TinyMCE API Key fetched successfully');
    return data.data.key;
  } catch (error) {
    console.error('Error fetching TinyMCE API key:', error);
    console.log('Using fallback TinyMCE API key due to error');
    return FALLBACK_TINY_API_KEY;
  }
}
