
import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';
import type { SEOAnalysisResult, ShopifyProduct, ShopifyStore } from '@/types/shopify';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

// Define the interface for the response from fetchShopifyProducts
export interface ShopifyProductsResponse {
  products: ShopifyProduct[];
  page: number;
  limit: number;
  total: number;
}

export interface ShopifyCredentials {
  apiKey: string;
  apiSecretKey: string;
  storeUrl: string;
}

const api = axios.create({
  baseURL: BACKEND_URL,
});

// Add auth token to all requests
api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const session = data.session;
  
  if (session) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  
  return config;
});

export async function getConnectedShopifyStores(): Promise<ShopifyStore[]> {
  try {
    const { data, error } = await supabase
      .from('shopify_stores')
      .select('*');
    
    if (error) throw error;
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
    // Call the Supabase Edge Function to connect to Shopify
    const { data, error } = await supabase.functions.invoke('shopify-connect', {
      body: credentials
    });
    
    if (error) throw error;
    
    // Store the connection in the database
    const { data: storeData, error: storeError } = await supabase
      .from('shopify_stores')
      .insert({
        store_url: credentials.storeUrl,
        store_name: data.shop.name,
        store_owner: data.shop.shop_owner,
        email: data.shop.email,
        access_token: data.access_token,
        user_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();
      
    if (storeError) throw storeError;
    
    return storeData as ShopifyStore;
  } catch (error) {
    console.error('Error connecting Shopify store:', error);
    throw error;
  }
}

export async function fetchShopifyProducts(storeId: string, page = 1, limit = 20): Promise<ShopifyProductsResponse> {
  try {
    // Call the Supabase Edge Function to fetch products
    const { data, error } = await supabase.functions.invoke('shopify-products', {
      body: { storeId, page, limit }
    });
    
    if (error) throw error;
    return data as ShopifyProductsResponse;
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    throw error;
  }
}

export async function analyzeSEO(storeId: string, productId: string): Promise<SEOAnalysisResult> {
  try {
    // Call our Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('shopify-seo', {
      body: { storeId, productId }
    });
    
    if (error) throw error;
    
    // Store the analysis in the database
    await supabase.from('shopify_seo_analyses').upsert({
      store_id: storeId,
      product_id: productId,
      title: data.title,
      handle: data.handle,
      issues: data.issues,
      score: data.score,
      optimizations: data.optimizations,
      updated_at: new Date().toISOString()
    });
    
    return data as SEOAnalysisResult;
  } catch (error) {
    console.error('Error analyzing SEO:', error);
    throw error;
  }
}

export async function optimizeSEO(storeId: string, productId: string, optimizations: any[]) {
  try {
    // Call our Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('shopify-optimize', {
      body: { storeId, productId, optimizations }
    });
    
    if (error) throw error;
    
    // Update the analysis in the database
    await supabase.from('shopify_seo_analyses')
      .update({
        optimizations: optimizations.map(opt => ({ ...opt, applied: true })),
        updated_at: new Date().toISOString()
      })
      .eq('store_id', storeId)
      .eq('product_id', productId);
    
    return data;
  } catch (error) {
    console.error('Error optimizing SEO:', error);
    throw error;
  }
}

export async function bulkOptimizeSEO(storeId: string) {
  try {
    // Call our Supabase Edge Function for bulk optimization
    const { data, error } = await supabase.functions.invoke('shopify-bulk-optimize', {
      body: { storeId }
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error running bulk SEO optimization:', error);
    throw error;
  }
}

export default api;
