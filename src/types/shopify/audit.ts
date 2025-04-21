
export interface WebsiteSEOAudit {
  id: string;
  store_id: string;
  created_at: string;
  score: number;
  issues: WebsiteSEOIssue[];
  optimizations: WebsiteSEOOptimization[];
  meta: {
    pages_analyzed: number;
    product_pages: number;
    collection_pages: number;
    blog_pages: number;
    other_pages: number;
  };
}

export interface WebsiteSEOIssue {
  id: string;
  type: 'meta' | 'structure' | 'content' | 'performance' | 'mobile' | 'security';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  details: string;
  affected_urls?: string[];
  impact_score: number;
}

export interface WebsiteSEOOptimization {
  id: string;
  type: 'meta' | 'structure' | 'content' | 'performance' | 'mobile' | 'security';
  entity: string;
  field: string;
  original: string;
  suggestion: string;
  applied: boolean;
  impact_score: number;
  affected_urls?: string[];
}

export interface ShopifyOptimizationHistoryRecord {
  id: string;
  store_id: string;
  entity_id: string;
  entity_type: string;
  field: string;
  original_value: string | null;
  new_value: string;
  applied_at: string;
  optimization_type: string;
  reverted_at?: string | null;
}

export interface ShopifyOptimizationHistory {
  id: string;
  store_id: string;
  entity_id: string;
  entity_type: 'product' | 'page' | 'blog' | 'article' | 'theme' | 'global';
  field: string;
  original_value: string;
  new_value: string;
  applied_at: string;
  applied_by: string;
  reverted: boolean;
  reverted_at?: string | null;
  optimization_type: string;
}
