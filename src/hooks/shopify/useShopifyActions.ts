
import React from 'react';
import { useToast } from "@/hooks/use-toast";
import { bulkOptimizeSEO, runSiteAudit } from '@/services/shopify';
import { fetchSerpResults, extractSerpData } from '@/services/serpApi';
import { fetchShopifyProducts } from '@/services/shopify';
import { parseSEOAnalysis } from './useShopifySEOAnalysis';

export function useShopifyActions(storeId: string | undefined, storeName?: string | null, setProducts?: React.Dispatch<React.SetStateAction<any[]>>, setAnalysisResults?: React.Dispatch<React.SetStateAction<Record<string, any>>>, setSiteAudit?: React.Dispatch<React.SetStateAction<any | null>>, setOptimizationHistory?: React.Dispatch<React.SetStateAction<any[]>>) {
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
        .catch(() => setSerpData(null))
        .finally(() => setSerpLoading(false));
    }
  }, [storeName]);

  const handleBulkOptimize = async () => {
    if (!storeId) return;
    setIsOptimizing(true);
    try {
      const result = await bulkOptimizeSEO(storeId);
      toast({
        title: "Bulk Optimization Started",
        description: `SEO optimization for ${result.total} products has been initiated`
      });
      setTimeout(async () => {
        if (!setProducts || !setAnalysisResults) {
          setIsOptimizing(false);
          return;
        }
        // refetch products
        const pd = await fetchShopifyProducts(storeId);
        setProducts(pd.products || []);

        // refetch analyses
        const { data: analyses } = await import('@/integrations/supabase/client').then(({ supabase }) =>
          supabase.from('shopify_seo_analyses').select('*').eq('store_id', storeId)
        );
        if (analyses) {
          const analysisMap = analyses.reduce((acc: Record<string, any>, analysis: any) => {
            acc[analysis.product_id] = parseSEOAnalysis(analysis);
            return acc;
          }, {});
          setAnalysisResults(analysisMap);
        }
        setIsOptimizing(false);
      }, 3000);
    } catch {
      toast({
        title: "Bulk Optimization Failed",
        description: "Failed to start bulk SEO optimization",
        variant: "destructive"
      });
      setIsOptimizing(false);
    }
  };

  const handleRunSiteAudit = async () => {
    if (!storeId) return;
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
        const history = await import('@/services/shopify').then(mod => mod.getOptimizationHistory(storeId));
        setOptimizationHistory(history || []);
      }
      toast({
        title: "Site Audit Complete",
        description: `Your store scored ${auditResult.score}/100. We found ${auditResult.issues.length} issues to fix.`
      });
    } catch {
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
