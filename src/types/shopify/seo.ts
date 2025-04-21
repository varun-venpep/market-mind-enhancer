
export interface SEOAnalysisResult {
  product_id: string | number;
  title: string;
  handle: string;
  issues: SEOIssue[];
  score: number;
  optimizations: SEOOptimization[];
}

export interface SEOIssue {
  type: 'title' | 'description' | 'image' | 'content' | 'url';
  severity: 'high' | 'medium' | 'low';
  message: string;
  details?: string;
}

export interface SEOOptimization {
  type: 'title' | 'description' | 'image' | 'content' | 'url';
  field: string;
  original: string;
  suggestion: string;
  applied: boolean;
}

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
  type: string;
  severity: 'high' | 'medium' | 'low';
  message: string;
  details?: string;
  affected_urls?: string[];
}

export interface WebsiteSEOOptimization {
  type: string;
  entity: string;
  field: string;
  original: string;
  suggestion: string;
  affected_urls?: string[];
  applied?: boolean;
}

// Additional interface for SEO API responses
export interface SEOApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  appliedChanges?: Array<{
    field: string;
    from: string;
    to: string;
  }>;
}
