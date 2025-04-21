
import { useEffect, useState, useCallback } from "react";
import { supabase } from '@/integrations/supabase/client';
import type { SEOAnalysisResult, SEOIssue, SEOOptimization } from '@/types/shopify';
import { Json } from '@/integrations/supabase/types';

function parseSEOAnalysis(analysis: any): SEOAnalysisResult {
  return {
    product_id: analysis.product_id,
    title: analysis.title,
    handle: analysis.handle,
    issues: Array.isArray(analysis.issues)
      ? (analysis.issues as Json[]).map(issue => ({
          type: (issue as any).type,
          severity: (issue as any).severity,
          message: (issue as any).message,
          details: (issue as any).details,
        })) as SEOIssue[]
      : [],
    score: analysis.score,
    optimizations: Array.isArray(analysis.optimizations)
      ? (analysis.optimizations as Json[]).map(opt => ({
          type: (opt as any).type,
          field: (opt as any).field,
          original: (opt as any).original,
          suggestion: (opt as any).suggestion,
          applied: (opt as any).applied,
        })) as SEOOptimization[]
      : [],
  };
}

export function useShopifySEOAnalysis(storeId: string | undefined) {
  const [analysisResults, setAnalysisResults] = useState<Record<string, SEOAnalysisResult>>({});

  useEffect(() => {
    if (!storeId) return;
    const fetch = async () => {
      const { data: analyses } = await supabase
        .from('shopify_seo_analyses')
        .select('*')
        .eq('store_id', storeId);

      if (analyses && analyses.length > 0) {
        const analysisMap = analyses.reduce((acc, analysis) => {
          acc[analysis.product_id] = parseSEOAnalysis(analysis);
          return acc;
        }, {} as Record<string, SEOAnalysisResult>);
        setAnalysisResults(analysisMap);
      }
    };
    fetch();
  }, [storeId]);

  const handleAnalysisComplete = useCallback((productId: string, analysis: SEOAnalysisResult) => {
    setAnalysisResults(prev => ({ ...prev, [productId]: analysis }));
  }, []);

  return { analysisResults, setAnalysisResults, handleAnalysisComplete };
}

export { parseSEOAnalysis };
