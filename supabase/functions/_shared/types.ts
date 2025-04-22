
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
  impact_score: number;
  affected_urls?: string[];
}

export interface WebsiteSEOOptimization {
  id: string;
  type: 'meta' | 'structure' | 'content' | 'performance' | 'mobile' | 'security';
  entity: string;
  field: string;
  original: string;
  suggestion: string;
  impact_score: number;
  applied: boolean;
  affected_urls?: string[];
}
