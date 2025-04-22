
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
  
  try {
    console.log("Attempting to authenticate user with token");
    // First try with the access token directly
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      console.error("User authentication error or no user found:", userError?.message);
      
      // Try to refresh the session
      try {
        // Create a temporary client with the token
        const tempClient = createClient(supabaseUrl, supabaseKey, {
          auth: {
            autoRefreshToken: true,
            persistSession: true,
            storage: globalThis.localStorage || null,
          },
        });
        
        // Try both as access token and refresh token
        let refreshData;
        let refreshError;
        
        try {
          console.log("Trying token as refresh token");
          // First try as a refresh token
          ({ data: refreshData, error: refreshError } = await tempClient.auth.refreshSession({
            refresh_token: token,
          }));
          
          if (refreshData?.session) {
            console.log("Successfully refreshed session using refresh token");
          }
        } catch (e) {
          console.log("Error using token as refresh token:", e?.message);
        }
        
        // If that fails, try accessing the session directly
        if (refreshError || !refreshData?.session) {
          console.log("Trying alternative authentication method");
          ({ data: refreshData, error: refreshError } = await tempClient.auth.getSession());
          
          if (refreshData?.session) {
            console.log("Successfully got session using getSession");
          }
        }
        
        if (refreshError || !refreshData?.session) {
          console.error("Failed to refresh or retrieve session:", refreshError?.message);
          return { 
            user: null, 
            error: "Authentication failed: " + (refreshError?.message || "Invalid token"), 
            supabase: null 
          };
        }
        
        console.log("Session refreshed or retrieved successfully");
        return { 
          user: refreshData.session.user, 
          error: null, 
          supabase: tempClient 
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
