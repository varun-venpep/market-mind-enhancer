
import { supabase } from "@/integrations/supabase/client";
import type { WebsiteSEOAudit, SEOAnalysisResult } from '@/types/shopify';
import { invokeFunction } from "../supabaseUtils";

export async function runSiteAudit(storeId: string): Promise<WebsiteSEOAudit> {
  const data = await invokeFunction('shopify-site-audit', { storeId });
  
  // Ensure all issues and optimizations have IDs
  if (data.issues) {
    data.issues = data.issues.map((issue: any) => ({
      ...issue,
      id: issue.id || crypto.randomUUID()
    }));
  }
  
  if (data.optimizations) {
    data.optimizations = data.optimizations.map((opt: any) => ({
      ...opt,
      id: opt.id || crypto.randomUUID()
    }));
  }
  
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
    
    // Ensure all issues have an id
    if (auditData.issues) {
      auditData.issues = auditData.issues.map((issue: any) => ({
        ...issue,
        id: issue.id || crypto.randomUUID()
      }));
    }
    
    // Ensure all optimizations have an id
    if (auditData.optimizations) {
      auditData.optimizations = auditData.optimizations.map((opt: any) => ({
        ...opt,
        id: opt.id || crypto.randomUUID()
      }));
    }
    
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
