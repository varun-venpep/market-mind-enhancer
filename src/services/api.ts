
import axios from 'axios';
import { supabase } from '@/integrations/supabase/client';
import type { SEOAnalysisResult, ShopifyStore } from '@/types/shopify';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

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

export async function fetchShopifyProducts(storeId: string, page = 1, limit = 20) {
  try {
    // This is a placeholder for backend API - in a real app, you would call your backend here
    // For now, let's return mock data with a delay to simulate an API call
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          products: [
            {
              id: 1,
              title: "Sample Product 1",
              handle: "sample-product-1",
              body_html: "<p>This is a sample product description.</p>",
              vendor: "Sample Vendor",
              product_type: "Sample Type",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              published_at: new Date().toISOString(),
              tags: "sample, product, test",
              variants: [],
              images: [
                {
                  id: 101,
                  product_id: 1,
                  position: 1,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  alt: null,
                  width: 800,
                  height: 600,
                  src: "https://placehold.co/800x600?text=Sample+Product+1",
                  variant_ids: []
                }
              ],
              options: [],
              metafields: []
            },
            {
              id: 2,
              title: "Sample Product 2",
              handle: "sample-product-2",
              body_html: "<p>Another sample product with more details.</p>",
              vendor: "Sample Vendor",
              product_type: "Premium Type",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              published_at: new Date().toISOString(),
              tags: "premium, sample, product",
              variants: [],
              images: [
                {
                  id: 201,
                  product_id: 2,
                  position: 1,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                  alt: "Sample Product 2 - Main Image",
                  width: 800,
                  height: 600,
                  src: "https://placehold.co/800x600?text=Sample+Product+2",
                  variant_ids: []
                }
              ],
              options: [],
              metafields: []
            }
          ],
          page,
          limit,
          total: 2
        });
      }, 500);
    });
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    throw error;
  }
}

export async function analyzeSEO(storeId: string, productId: string) {
  try {
    // Call our Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('shopify-seo', {
      body: { storeId, productId }
    });
    
    if (error) throw error;
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
    return data;
  } catch (error) {
    console.error('Error optimizing SEO:', error);
    throw error;
  }
}

export async function bulkOptimizeSEO(storeId: string) {
  try {
    // This would typically be a backend job
    // For now, we'll simulate success
    return { success: true, message: "Bulk optimization started" };
  } catch (error) {
    console.error('Error running bulk SEO optimization:', error);
    throw error;
  }
}

export default api;
