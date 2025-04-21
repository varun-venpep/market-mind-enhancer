
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

export async function authenticate(req: Request, supabaseUrl: string, supabaseKey: string) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const authHeader = req.headers.get('Authorization');
  
  if (!authHeader) {
    console.error("Missing authorization header in request");
    return { user: null, error: "Not authenticated", supabase: null };
  }
  
  const token = authHeader.replace('Bearer ', '');
  console.log("Authenticating with token:", token.substring(0, 10) + "...");
  
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError) {
      console.error("User authentication error:", userError);
      return { user: null, error: "Failed to authenticate user: " + userError.message, supabase: null };
    }

    if (!user) {
      console.error("No user found for the provided token");
      return { user: null, error: "No user found for the provided token", supabase: null };
    }
    
    console.log("User authenticated successfully:", user.id);
    return { user, error: null, supabase };
  } catch (error) {
    console.error("Exception in authenticate function:", error);
    return { user: null, error: "Authentication error: " + (error.message || "Unknown error"), supabase: null };
  }
}
