
import { supabase } from "@/integrations/supabase/client";
import type { 
  SEOAnalysisResult, 
  ShopifyProduct, 
  ShopifyStore, 
  WebsiteSEOAudit, 
  ShopifyOptimizationHistory,
  ShopifyOptimizationHistoryRecord,
  ShopifyProductsResponse
} from '@/types/shopify';
import { invokeFunction, getAuthToken } from "./supabaseUtils";

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

export interface ShopifyCredentials {
  storeUrl: string;
  accessToken: string;
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

export async function fetchShopifyProducts(storeId: string, page = 1, limit = 20): Promise<ShopifyProductsResponse> {
  try {
    const data = await invokeFunction('shopify-products', { storeId, page, limit });
    return data as ShopifyProductsResponse;
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

export async function bulkOptimizeSEO(storeId: string) {
  try {
    const data = await invokeFunction('shopify-bulk-optimize', { storeId });
    return data;
  } catch (error) {
    console.error('Error running bulk SEO optimization:', error);
    throw error;
  }
}

export async function runSiteAudit(storeId: string): Promise<WebsiteSEOAudit> {
  try {
    const data = await invokeFunction('shopify-site-audit', { storeId });
    return data as WebsiteSEOAudit;
  } catch (error) {
    console.error('Error running site audit:', error);
    throw error;
  }
}

export async function getSiteAuditHistory(storeId: string): Promise<WebsiteSEOAudit[]> {
  try {
    const { data, error } = await supabase
      .from('shopify_site_audits')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data.map(item => {
      const auditData = typeof item.audit_data === 'string' ? JSON.parse(item.audit_data) : item.audit_data;
      return {
        id: item.id,
        store_id: item.store_id,
        created_at: item.created_at,
        score: item.score,
        issues: auditData.issues || [],
        optimizations: auditData.optimizations || [],
        meta: auditData.meta || {
          pages_analyzed: 0,
          product_pages: 0,
          collection_pages: 0,
          blog_pages: 0,
          other_pages: 0
        }
      } as WebsiteSEOAudit;
    });
  } catch (error) {
    console.error('Error fetching site audit history:', error);
    throw error;
  }
}

export async function applyOptimization(storeId: string, optimization: any) {
  try {
    const data = await invokeFunction('shopify-apply-optimization', { 
      storeId, 
      optimization 
    });
    return data;
  } catch (error) {
    console.error('Error applying optimization:', error);
    throw error;
  }
}

export async function revertOptimization(optimizationId: string) {
  try {
    const updateData: Partial<ShopifyOptimizationHistoryRecord> = { 
      reverted_at: new Date().toISOString() 
    };
    const { data, error } = await supabase
      .from('shopify_optimization_history')
      .update(updateData)
      .eq('id', optimizationId)
      .select();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error reverting optimization:', error);
    throw error;
  }
}

export async function getOptimizationHistory(storeId: string): Promise<ShopifyOptimizationHistory[]> {
  try {
    const { data, error } = await supabase
      .from('shopify_optimization_history')
      .select('*')
      .eq('store_id', storeId)
      .order('applied_at', { ascending: false });
    if (error) throw error;
    return data.map((item: ShopifyOptimizationHistoryRecord) => ({
      id: item.id,
      store_id: item.store_id,
      entity_id: item.entity_id,
      entity_type: item.entity_type as "product" | "page" | "blog" | "article" | "theme" | "global",
      field: item.field,
      original_value: item.original_value || '',
      new_value: item.new_value,
      applied_at: item.applied_at,
      applied_by: 'system',
      reverted: item.reverted_at ? true : false,
      reverted_at: item.reverted_at,
      optimization_type: item.optimization_type
    }));
  } catch (error) {
    console.error('Error fetching optimization history:', error);
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
  runSiteAudit,
  getSiteAuditHistory,
  applyOptimization,
  revertOptimization,
  getOptimizationHistory
};
