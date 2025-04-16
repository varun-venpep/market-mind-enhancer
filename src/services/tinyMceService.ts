
import { supabase } from "@/integrations/supabase/client";

export async function getTinyMceApiKey(): Promise<string> {
  try {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('No active session');
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
      throw new Error(errorData.error || 'Failed to fetch TinyMCE API key');
    }

    const data = await response.json();
    return data.data.key;
  } catch (error) {
    console.error('Error fetching TinyMCE API key:', error);
    throw error;
  }
}
