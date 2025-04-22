import { supabase } from "@/integrations/supabase/client";
import type { WebsiteSEOAudit, SEOAnalysisResult } from '@/types/shopify';
import { invokeFunction } from "../supabase";

export async function runSiteAudit(storeId: string): Promise<WebsiteSEOAudit> {
  try {
    console.log(`Running site audit for store ID: ${storeId}`);
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
    
    console.log(`Site audit completed successfully for store ID: ${storeId}`);
    return data as WebsiteSEOAudit;
  } catch (error) {
    console.error(`Error running site audit for store ID: ${storeId}:`, error);
    throw error;
  }
}

export async function getSiteAuditHistory(storeId: string): Promise<WebsiteSEOAudit[]> {
  try {
    console.log(`Fetching site audit history for store ID: ${storeId}`);
    const { data, error } = await supabase
      .from('shopify_site_audits')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching site audit history: ${error.message}`);
      throw error;
    }
    
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
  } catch (error) {
    console.error(`Error in getSiteAuditHistory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    return [];
  }
}
