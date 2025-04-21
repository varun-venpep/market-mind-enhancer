
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

export async function authenticate(req: Request, supabaseUrl: string, supabaseKey: string) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return { user: null, error: "Not authenticated" };
  }
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: userError } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return { user: null, error: "Failed to authenticate user" };
  }
  return { user, error: null, supabase };
}
