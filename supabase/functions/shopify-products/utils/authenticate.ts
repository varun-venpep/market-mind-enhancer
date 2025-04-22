
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

export async function authenticate(req: Request, supabaseUrl: string, supabaseKey: string) {
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      storage: globalThis.localStorage || null,
    },
  });
  
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader) {
    console.error("Missing authorization header in request");
    return { user: null, error: "Not authenticated", supabase: null };
  }
  
  const token = authHeader.replace('Bearer ', '');
  console.log("Attempting to authenticate with token:", token.substring(0, 10) + "...");
  
  try {
    // First try with the access token directly
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      console.error("User authentication error or no user found:", userError?.message);
      
      // Try to refresh the session
      try {
        console.log("Attempting session refresh...");
        
        // Try as an access token
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !sessionData?.session) {
          console.log("Failed to get session, trying as refresh token...");
          
          // Try as a refresh token
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
            refresh_token: token,
          });
          
          if (refreshError || !refreshData?.session) {
            console.error("Failed to refresh session:", refreshError?.message);
            return { 
              user: null, 
              error: "Authentication failed: " + (refreshError?.message || "Invalid token"), 
              supabase: null 
            };
          }
          
          console.log("Successfully refreshed session using refresh token");
          return { 
            user: refreshData.session.user, 
            error: null, 
            supabase 
          };
        }
        
        console.log("Successfully retrieved session");
        return { 
          user: sessionData.session.user, 
          error: null, 
          supabase 
        };
      } catch (refreshException: any) {
        console.error("Exception during session refresh:", refreshException?.message);
        return { 
          user: null, 
          error: "Authentication error during refresh: " + (refreshException.message || "Unknown error"), 
          supabase: null 
        };
      }
    }
    
    console.log("User authenticated successfully:", user.id);
    return { user, error: null, supabase };
  } catch (error: any) {
    console.error("Exception in authenticate function:", error?.message);
    return { 
      user: null, 
      error: "Authentication error: " + (error.message || "Unknown error"), 
      supabase: null 
    };
  }
}
