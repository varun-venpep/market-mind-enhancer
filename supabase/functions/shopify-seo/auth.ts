
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

export async function authenticateUser(authHeader: string, supabaseUrl: string, supabaseKey: string) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data: { user }, error } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', '')
  );
  if (error || !user) {
    throw new Error('Failed to authenticate user');
  }
  return user;
}
