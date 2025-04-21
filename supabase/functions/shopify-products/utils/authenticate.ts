
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

export async function authenticate(req: Request, supabaseUrl: string, supabaseKey: string) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader) {
    console.error("Missing authorization header in request");
    return { user: null, error: "Not authenticated", supabase: null };
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  try {
    // First try with the token directly
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      console.error("User authentication error or no user found:", userError);
      
      // If direct token fails, try refreshing the session
      try {
        // Create a temporary client with the session
        const tempClient = createClient(supabaseUrl, supabaseKey, {
          auth: {
            autoRefreshToken: true,
            persistSession: false,
          },
        });
        
        // Try to refresh the session
        const { data: refreshData, error: refreshError } = await tempClient.auth.refreshSession({
          refresh_token: token,
        });
        
        if (refreshError || !refreshData.session) {
          console.error("Failed to refresh session:", refreshError);
          return { user: null, error: "Authentication failed: " + (refreshError?.message || "Invalid token"), supabase: null };
        }
        
        console.log("Session refreshed successfully");
        return { 
          user: refreshData.session.user, 
          error: null, 
          supabase: tempClient 
        };
      } catch (refreshException) {
        console.error("Exception during session refresh:", refreshException);
        return { user: null, error: "Authentication error during refresh: " + (refreshException.message || "Unknown error"), supabase: null };
      }
    }
    
    console.log("User authenticated successfully:", user.id);
    return { user, error: null, supabase };
  } catch (error) {
    console.error("Exception in authenticate function:", error);
    return { user: null, error: "Authentication error: " + (error.message || "Unknown error"), supabase: null };
  }
}
