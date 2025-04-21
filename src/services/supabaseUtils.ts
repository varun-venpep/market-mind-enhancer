
import { supabase } from "@/integrations/supabase/client";

export const getAuthToken = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
};

export const invokeFunction = async (functionName: string, payload: any) => {
  const token = await getAuthToken();
  
  if (!token) {
    console.error('Authentication required for invoking function:', functionName);
    throw new Error('Authentication required');
  }
  
  try {
    console.log(`Invoking function ${functionName} with payload:`, payload);
    const response = await supabase.functions.invoke(functionName, {
      body: payload,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log(`Function response:`, response);

    if (response.error) {
      console.error(`Error invoking function ${functionName}:`, response.error);
      throw new Error(`Function error: ${response.error.message || response.error}`);
    }
    
    // Handle empty responses gracefully
    if (!response.data && functionName !== 'shopify-optimize' && functionName !== 'shopify-apply-optimization') {
      console.warn(`Function ${functionName} returned no data`);
      return { success: true, message: "Operation completed successfully" };
    }
    
    return response.data || { success: true };
  } catch (error) {
    console.error(`Error invoking function ${functionName}:`, error);
    throw error;
  }
};
