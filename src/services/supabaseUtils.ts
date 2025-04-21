
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function getAuthToken(): Promise<string | null> {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting auth session:', error);
      return null;
    }
    
    if (!data.session) {
      console.warn('No active session found');
      return null;
    }
    
    return data.session.access_token || null;
  } catch (error) {
    console.error('Exception in getAuthToken:', error);
    return null;
  }
}

export async function invokeFunction(functionName: string, payload: any): Promise<any> {
  try {
    const token = await getAuthToken();
    if (!token) {
      toast.error('Authentication required. Please sign in.');
      throw new Error('Authentication required');
    }

    console.log(`Invoking function ${functionName} with token: ${token.substring(0, 10)}...`);
    console.log(`Function payload:`, payload);

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

export function handleApiError(error: any, defaultMessage: string = 'An error occurred'): string {
  console.error('API Error:', error);
  
  if (error.message) {
    // If it's a standard Error object
    return error.message;
  } else if (error.error) {
    // If it's a Supabase error
    return error.error.message || error.error;
  } else if (typeof error === 'string') {
    // If it's a string
    return error;
  }
  
  // Default fallback
  return defaultMessage;
}

export async function refreshSession(): Promise<boolean> {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('Failed to refresh session:', error);
      return false;
    }
    console.log('Session refreshed successfully');
    return true;
  } catch (error) {
    console.error('Exception in refreshSession:', error);
    return false;
  }
}
