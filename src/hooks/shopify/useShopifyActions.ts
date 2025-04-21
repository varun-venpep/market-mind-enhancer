
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { bulkOptimizeSEO, runSiteAudit } from '@/services/shopify';
import { fetchSerpResults, extractSerpData } from '@/services/serpApi';
import { fetchShopifyProducts } from '@/services/shopify';
import { parseSEOAnalysis } from './useShopifySEOAnalysis';
import { supabase } from '@/integrations/supabase/client';

export function useShopifyActions(
  storeId: string | undefined, 
  storeName?: string | null, 
  setProducts?: React.Dispatch<React.SetStateAction<any[]>>, 
  setAnalysisResults?: React.Dispatch<React.SetStateAction<Record<string, any>>>, 
  setSiteAudit?: React.Dispatch<React.SetStateAction<any | null>>, 
  setOptimizationHistory?: React.Dispatch<React.SetStateAction<any[]>>
) {
  const { toast } = useToast();

  const [isOptimizing, setIsOptimizing] = React.useState(false);
  const [serpData, setSerpData] = React.useState<any>(null);
  const [serpLoading, setSerpLoading] = React.useState(true);
  const [isRunningAudit, setIsRunningAudit] = React.useState(false);

  React.useEffect(() => {
    if (storeName) {
      const keyword = `${storeName.toLowerCase()} products`;
      setSerpLoading(true);
      fetchSerpResults(keyword)
        .then(result => setSerpData(extractSerpData(result)))
        .catch(error => {
          console.error('Error fetching SERP results:', error);
          setSerpData(null);
        })
        .finally(() => setSerpLoading(false));
    }
  }, [storeName]);

  const handleBulkOptimize = async () => {
    if (!storeId) {
      toast({
        title: "Error",
        description: "No store ID provided",
        variant: "destructive"
      });
      return;
    }

    setIsOptimizing(true);
    try {
      const result = await bulkOptimizeSEO(storeId);
      toast({
        title: "Bulk Optimization Started",
        description: `SEO optimization for ${result?.total || 'all'} products has been initiated`
      });

      // Wait a moment for optimizations to complete
      setTimeout(async () => {
        if (!setProducts || !setAnalysisResults) {
          setIsOptimizing(false);
          return;
        }

        try {
          // refetch products
          const pd = await fetchShopifyProducts(storeId);
          setProducts(pd.products || []);

          // refetch analyses
          const { data: analyses, error } = await supabase
            .from('shopify_seo_analyses')
            .select('*')
            .eq('store_id', storeId);

          if (error) {
            console.error('Error fetching SEO analyses:', error);
            throw error;
          }
          
          if (analyses) {
            const analysisMap = analyses.reduce((acc: Record<string, any>, analysis: any) => {
              acc[analysis.product_id] = parseSEOAnalysis(analysis);
              return acc;
            }, {});
            setAnalysisResults(analysisMap);
          }
        } catch (error) {
          console.error('Error refreshing data after bulk optimize:', error);
          toast({
            title: "Error Refreshing Data",
            description: "Failed to refresh data after optimization",
            variant: "destructive"
          });
        } finally {
          setIsOptimizing(false);
        }
      }, 3000);
    } catch (error) {
      console.error('Error during bulk optimization:', error);
      toast({
        title: "Bulk Optimization Failed",
        description: "Failed to start bulk SEO optimization",
        variant: "destructive"
      });
      setIsOptimizing(false);
    }
  };

  const handleRunSiteAudit = async () => {
    if (!storeId) {
      toast({
        title: "Error",
        description: "No store ID provided",
        variant: "destructive"
      });
      return;
    }
    
    setIsRunningAudit(true);
    try {
      toast({
        title: "Site Audit Started",
        description: "Running a comprehensive SEO audit of your entire store..."
      });
      
      const auditResult = await runSiteAudit(storeId);
      if (setSiteAudit) setSiteAudit(auditResult);

      // refresh optimization history
      if (setOptimizationHistory) {
        try {
          const { data: history, error } = await supabase
            .from('shopify_optimization_history')
            .select('*')
            .eq('store_id', storeId)
            .order('applied_at', { ascending: false });
            
          if (error) throw error;
          setOptimizationHistory(history || []);
        } catch (error) {
          console.error('Error fetching optimization history:', error);
        }
      }
      
      toast({
        title: "Site Audit Complete",
        description: `Your store scored ${auditResult.score}/100. We found ${auditResult.issues.length} issues to fix.`
      });
    } catch (error) {
      console.error('Error running site audit:', error);
      toast({
        title: "Audit Failed",
        description: "Failed to complete the site audit. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsRunningAudit(false);
    }
  };

  return {
    isOptimizing,
    serpData,
    serpLoading,
    isRunningAudit,
    handleBulkOptimize,
    handleRunSiteAudit,
  };
}
