
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getAuthToken, refreshSession } from "./auth";

export async function invokeFunction(functionName: string, payload: any): Promise<any> {
  try {
    let token = await getAuthToken();
    if (!token) {
      console.error('Authentication required. Please sign in.');
      toast.error('Authentication required. Please sign in.');
      
      // Attempt to refresh the session one more time
      if (await refreshSession()) {
        token = await getAuthToken();
        if (!token) {
          throw new Error('Authentication required');
        }
      } else {
        throw new Error('Authentication required');
      }
    }

    console.log(`Invoking function ${functionName}`);
    
    // Add a retry mechanism for token refresh issues
    let retries = 0;
    const maxRetries = 3;
    
    while (retries <= maxRetries) {
      try {
        const currentToken = await getAuthToken();
        if (!currentToken) {
          if (retries < maxRetries) {
            console.log(`No token available, refreshing session and trying again (${retries + 1}/${maxRetries})`);
            await refreshSession();
            retries++;
            continue;
          } else {
            throw new Error('Authentication required after multiple refresh attempts');
          }
        }
        
        const { data, error } = await supabase.functions.invoke(functionName, {
          headers: {
            Authorization: `Bearer ${currentToken}`
          },
          body: payload
        });

        if (error) {
          // Check if it's an auth error
          if (isAuthError(error)) {
            if (retries < maxRetries) {
              console.log(`Auth issue detected, refreshing session and trying again (${retries + 1}/${maxRetries})`);
              await refreshSession();
              retries++;
              continue;
            }
          }
          
          console.error(`Error invoking function ${functionName}:`, error);
          throw error;
        }

        return data;
      } catch (invokeError) {
        if (isAuthError(invokeError) && retries < maxRetries) {
          console.log(`Auth issue detected in catch block, refreshing session and trying again (${retries + 1}/${maxRetries})`);
          await refreshSession();
          retries++;
          continue;
        }
        throw invokeError;
      }
    }
    
    throw new Error(`Failed to invoke function ${functionName} after ${maxRetries} attempts`);
  } catch (error) {
    console.error(`Exception in invokeFunction ${functionName}:`, error);
    throw error;
  }
}

function isAuthError(error: any): boolean {
  return error.message && (
    error.message.includes('401') || 
    error.message.includes('auth') || 
    error.message.includes('Missing authorization')
  );
}
