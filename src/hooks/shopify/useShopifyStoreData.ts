
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { bulkOptimizeSEO, fetchShopifyProducts, runSiteAudit } from '@/services/shopify';
import { fetchSerpResults, extractSerpData } from '@/services/serpApi';
import { useShopifyStoreMeta } from "./useShopifyStoreMeta";
import { useShopifySEOAnalysis, parseSEOAnalysis } from "./useShopifySEOAnalysis";
import { useShopifyAuditHistory } from "./useShopifyAuditHistory";
import { useShopifyBlogGenerator } from "./useShopifyBlogGenerator";
import type { ShopifyProductsResponse, SEOAnalysisResult } from '@/types/shopify';

interface UseShopifyStoreDataProps {
  storeId: string | undefined;
}

export const useShopifyStoreData = ({ storeId }: UseShopifyStoreDataProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Store meta and product info
  const { store, products, isLoading, error, setProducts } = useShopifyStoreMeta(storeId);

  // SEO analysis results
  const { analysisResults, setAnalysisResults, handleAnalysisComplete } = useShopifySEOAnalysis(storeId);

  // Audit/optimization history
  const { siteAudit, setSiteAudit, optimizationHistory, setOptimizationHistory } = useShopifyAuditHistory(storeId);

  // Blog generation
  const {
    blogTitle, setBlogTitle, blogKeywords, setBlogKeywords,
    blogContent, setBlogContent, isGeneratingBlog, handleBlogGenerate
  } = useShopifyBlogGenerator(store);

  // UI state
  const [isOptimizing, setIsOptimizing] = React.useState(false);
  const [serpData, setSerpData] = React.useState<any>(null);
  const [serpLoading, setSerpLoading] = React.useState(true);
  const [isRunningAudit, setIsRunningAudit] = React.useState(false);

  // Fetch main SERP data if needed, tied to store meta (store?.store_name)
  React.useEffect(() => {
    if (store && store.store_name) {
      const keyword = `${store.store_name.toLowerCase()} products`;
      setSerpLoading(true);
      fetchSerpResults(keyword)
        .then(result => setSerpData(extractSerpData(result)))
        .catch(() => setSerpData(null))
        .finally(() => setSerpLoading(false));
    }
  }, [store]);

  // Bulk optimize
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
        // refetch products and analyses
        const pd: ShopifyProductsResponse = await fetchShopifyProducts(storeId);
        setProducts(pd.products || []);
        // refetch analyses
        const { data: analyses } = await import('@/integrations/supabase/client').then(({ supabase }) =>
          supabase.from('shopify_seo_analyses').select('*').eq('store_id', storeId)
        );
        if (analyses) {
          const analysisMap = analyses.reduce((acc: any, analysis: any) => {
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

  // Site audit
  const handleRunSiteAudit = async () => {
    if (!storeId) return;
    setIsRunningAudit(true);
    try {
      toast({
        title: "Site Audit Started",
        description: "Running a comprehensive SEO audit of your entire store..."
      });
      const auditResult = await runSiteAudit(storeId);
      setSiteAudit(auditResult);
      // refresh optimization history
      const history = await import('@/services/shopify').then(mod => mod.getOptimizationHistory(storeId));
      setOptimizationHistory(history || []);
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

  // If unrecoverable error, redirect to store list after delay
  React.useEffect(() => {
    if (error) {
      setTimeout(() => navigate('/dashboard/shopify'), 3000);
    }
  }, [error, navigate]);

  return {
    store, products, analysisResults, isLoading, isOptimizing, serpData, serpLoading, siteAudit,
    isRunningAudit, optimizationHistory, error,
    blogTitle, setBlogTitle, blogKeywords, setBlogKeywords, blogContent, setBlogContent, isGeneratingBlog,
    handleAnalysisComplete, handleBulkOptimize, handleBlogGenerate, handleRunSiteAudit,
  };
}
