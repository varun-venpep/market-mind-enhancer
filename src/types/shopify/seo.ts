
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
