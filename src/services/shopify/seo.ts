
import { supabase } from "@/integrations/supabase/client";
import type { WebsiteSEOAudit, SEOAnalysisResult } from '@/types/shopify';
import { invokeFunction } from "../supabaseUtils";

export async function runSiteAudit(storeId: string): Promise<WebsiteSEOAudit> {
  const data = await invokeFunction('shopify-site-audit', { storeId });
  return data as WebsiteSEOAudit;
}

export async function getSiteAuditHistory(storeId: string): Promise<WebsiteSEOAudit[]> {
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
}
