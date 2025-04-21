
import { supabase } from "@/integrations/supabase/client";

export async function getAuthToken(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

export async function invokeFunction(functionName: string, payload: any): Promise<any> {
  try {
    const token = await getAuthToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const { data, error } = await supabase.functions.invoke(functionName, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: payload
    });

    if (error) {
      console.error(`Error invoking function ${functionName}:`, error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Exception in invokeFunction ${functionName}:`, error);
    throw error;
  }
}
