
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const getAuthToken = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error || !data.session) {
    console.error('Authentication error:', error);
    return null;
  }
  
  return data.session?.access_token;
};

export const invokeFunction = async (functionName: string, payload: any) => {
  const token = await getAuthToken();
  
  if (!token) {
    console.error('Authentication required for invoking function:', functionName);
    toast.error('Authentication required. Please sign in.');
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
    
    if (response.error) {
      console.error(`Error invoking function ${functionName}:`, response.error);
      toast.error(`Error: ${response.error.message || 'Failed to process request'}`);
      throw new Error(`Function error: ${response.error.message || response.error}`);
    }
    
    // Handle empty responses gracefully
    if (!response.data && functionName !== 'shopify-optimize' && functionName !== 'shopify-apply-optimization') {
      console.warn(`Function ${functionName} returned no data`);
      return { success: true, message: "Operation completed successfully" };
    }
    
    console.log(`Function response:`, response);
    return response.data || { success: true };
  } catch (error) {
    console.error(`Error invoking function ${functionName}:`, error);
    toast.error(`Error: ${error instanceof Error ? error.message : 'Failed to process request'}`);
    throw error;
  }
};
