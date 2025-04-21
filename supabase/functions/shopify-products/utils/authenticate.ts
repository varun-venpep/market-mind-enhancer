
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

export async function authenticate(req: Request, supabaseUrl: string, supabaseKey: string) {
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  });
  
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader) {
    console.error("Missing authorization header in request");
    return { user: null, error: "Not authenticated", supabase: null };
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  try {
    // First try with the access token directly
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      console.error("User authentication error or no user found:", userError);
      
      // Try to refresh the session
      try {
        // Create a temporary client with the token
        const tempClient = createClient(supabaseUrl, supabaseKey, {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
          },
        });
        
        // Try both as access token and refresh token
        let refreshData;
        let refreshError;
        
        try {
          // First try as a refresh token
          ({ data: refreshData, error: refreshError } = await tempClient.auth.refreshSession({
            refresh_token: token,
          }));
        } catch (e) {
          console.log("Error using token as refresh token, will try other methods:", e);
        }
        
        // If that fails, try accessing the session directly
        if (refreshError || !refreshData?.session) {
          console.log("Trying alternative authentication method");
          ({ data: refreshData, error: refreshError } = await tempClient.auth.getSession());
        }
        
        if (refreshError || !refreshData?.session) {
          console.error("Failed to refresh session:", refreshError);
          return { user: null, error: "Authentication failed: " + (refreshError?.message || "Invalid token"), supabase: null };
        }
        
        console.log("Session refreshed or retrieved successfully");
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
