import { supabase } from '@/integrations/supabase/client';
import type { SEOAnalysisResult, ShopifyProduct, ShopifyStore } from '@/types/shopify';

export interface ShopifyProductsResponse {
  products: any[];
  status: string;
  message?: string;
}

export interface ShopifyCredentials {
  storeUrl: string;
  accessToken: string;
}

const getAuthToken = async () => {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token;
};

const invokeFunction = async (functionName: string, payload: any) => {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }
  
  try {
    console.log(`Invoking function ${functionName} with payload:`, payload);
    
    const response = await supabase.functions.invoke(functionName, {
      body: payload,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log(`Function response:`, response);
    
    if (response.error) {
      console.error(`Error invoking function ${functionName}:`, response.error);
      throw response.error;
    }
    
    if (!response.data) {
      console.error(`Function ${functionName} returned no data`);
      throw new Error(`${functionName} returned no data`);
    }
    
    return response.data;
  } catch (error) {
    console.error(`Error invoking function ${functionName}:`, error);
    throw error;
  }
};

export async function getConnectedShopifyStores(): Promise<ShopifyStore[]> {
  try {
    const { data, error } = await supabase
      .from('shopify_stores')
      .select('*');
    
    if (error) {
      console.error('Error fetching Shopify stores:', error);
      throw error;
    }
    
    console.log('Fetched stores:', data);
    return data as ShopifyStore[];
  } catch (error) {
    console.error('Error fetching Shopify stores:', error);
    throw error;
  }
}

export async function disconnectShopifyStore(storeId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('shopify_stores')
      .delete()
      .eq('id', storeId);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error disconnecting Shopify store:', error);
    throw error;
  }
}

export async function connectShopifyStore(credentials: ShopifyCredentials): Promise<ShopifyStore> {
  try {
    console.log('Connecting with credentials:', {
      storeUrl: credentials.storeUrl,
      accessToken: credentials.accessToken ? '***' : undefined
    });
    
    const data = await invokeFunction('shopify-connect', credentials);
    
    if (!data.store) {
      throw new Error(data.error || 'Failed to connect to Shopify store');
    }
    
    return data.store as ShopifyStore;
  } catch (error) {
    console.error('Error connecting Shopify store:', error);
    throw error;
  }
}

export const fetchShopifyProducts = async (storeId: string): Promise<ShopifyProductsResponse> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/shopify-products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ store_id: storeId })
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    throw error;
  }
}

export async function analyzeSEO(storeId: string, productId: string): Promise<SEOAnalysisResult> {
  try {
    const data = await invokeFunction('shopify-seo', { storeId, productId });
    return data as SEOAnalysisResult;
  } catch (error) {
    console.error('Error analyzing SEO:', error);
    throw error;
  }
}

export async function optimizeSEO(storeId: string, productId: string, optimizations: any[]) {
  try {
    const data = await invokeFunction('shopify-optimize', { storeId, productId, optimizations });
    return data;
  } catch (error) {
    console.error('Error optimizing SEO:', error);
    throw error;
  }
}

export const bulkOptimizeSEO = async (storeId: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/shopify-bulk-optimize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ store_id: storeId })
    });
    
    if (!response.ok) {
      throw new Error('Failed to start bulk optimization');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error in bulk optimizing SEO:', error);
    throw error;
  }
};

export async function performSiteAudit(storeId: string) {
  try {
    const data = await invokeFunction('shopify-site-audit', { storeId });
    return data;
  } catch (error) {
    console.error('Error performing site audit:', error);
    throw error;
  }
}

export async function applyOptimization(storeId: string, optimization: any, auditId?: string) {
  try {
    const data = await invokeFunction('shopify-apply-optimization', { storeId, optimization, auditId });
    return data;
  } catch (error) {
    console.error('Error applying optimization:', error);
    throw error;
  }
}

export async function searchKeywords(keyword: string, options = {}) {
  try {
    const token = await getAuthToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const { data, error } = await supabase.functions.invoke('serpapi', {
      body: { keyword, ...options },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error searching keywords:', error);
    throw error;
  }
}

export default {
  getConnectedShopifyStores,
  disconnectShopifyStore,
  connectShopifyStore,
  fetchShopifyProducts,
  analyzeSEO,
  optimizeSEO,
  bulkOptimizeSEO,
  searchKeywords,
  performSiteAudit,
  applyOptimization
};
