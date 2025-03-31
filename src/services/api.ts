
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
    const response = await api.get('/shopify-stores');
    return response.data;
  } catch (error) {
    console.error('Error fetching Shopify stores:', error);
    throw error;
  }
}

export async function disconnectShopifyStore(storeId: string): Promise<void> {
  try {
    await api.delete(`/shopify-stores/${storeId}`);
  } catch (error) {
    console.error('Error disconnecting Shopify store:', error);
    throw error;
  }
}

export async function fetchShopifyProducts(storeId: string, page = 1, limit = 20) {
  try {
    const response = await api.get(`/shopify-stores/${storeId}/products`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Shopify products:', error);
    throw error;
  }
}

export async function analyzeSEO(storeId: string, productId: string) {
  try {
    const response = await api.post(`/shopify-stores/${storeId}/products/${productId}/analyze-seo`);
    return response.data as SEOAnalysisResult;
  } catch (error) {
    console.error('Error analyzing SEO:', error);
    throw error;
  }
}

export async function optimizeSEO(storeId: string, productId: string, optimizations: any[]) {
  try {
    const response = await api.post(`/shopify-stores/${storeId}/products/${productId}/optimize-seo`, {
      optimizations
    });
    return response.data;
  } catch (error) {
    console.error('Error optimizing SEO:', error);
    throw error;
  }
}

export async function bulkOptimizeSEO(storeId: string) {
  try {
    const response = await api.post(`/shopify-stores/${storeId}/optimize-seo`);
    return response.data;
  } catch (error) {
    console.error('Error running bulk SEO optimization:', error);
    throw error;
  }
}

export default api;
