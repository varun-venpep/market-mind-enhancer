
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { SEOAnalysisResult, SEOIssue, SEOOptimization } from '@/types/shopify';

export function useSEOAnalysis(storeId: string | undefined) {
  const [analysisResults, setAnalysisResults] = useState<Record<string, SEOAnalysisResult>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!storeId) return;

    const fetchAnalyses = async () => {
      try {
        const { data: analyses, error: analysesError } = await supabase
          .from('shopify_seo_analyses')
          .select('*')
          .eq('store_id', storeId);
          
        if (!analysesError && analyses) {
          const analysisMap = analyses.reduce((acc, analysis) => {
            const typedAnalysis: SEOAnalysisResult = {
              product_id: analysis.product_id,
              title: analysis.title,
              handle: analysis.handle,
              issues: analysis.issues as unknown as SEOIssue[],
              score: analysis.score,
              optimizations: analysis.optimizations as unknown as SEOOptimization[]
            };
            
            acc[analysis.product_id] = typedAnalysis;
            return acc;
          }, {} as Record<string, SEOAnalysisResult>);
          
          setAnalysisResults(analysisMap);
        }
      } catch (error) {
        console.error('Error fetching SEO analyses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyses();
  }, [storeId]);

  return { analysisResults, setAnalysisResults, isLoading };
}
