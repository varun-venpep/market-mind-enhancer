
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { 
  bulkOptimizeSEO, 
  fetchShopifyProducts, 
  runSiteAudit, 
  getSiteAuditHistory, 
  getOptimizationHistory 
} from '@/services/shopify';
import { fetchSerpResults, extractSerpData } from '@/services/serpApi';
import type { 
  SEOAnalysisResult, 
  ShopifyProduct, 
  ShopifyStore, 
  SEOIssue, 
  SEOOptimization, 
  WebsiteSEOAudit, 
  ShopifyOptimizationHistory,
  ShopifyProductsResponse
} from '@/types/shopify';
import { useToast } from "@/hooks/use-toast";
import { Json } from '@/integrations/supabase/types';

interface UseShopifyStoreDataProps {
  storeId: string | undefined;
}

export const useShopifyStoreData = ({ storeId }: UseShopifyStoreDataProps) => {
  const [store, setStore] = useState<ShopifyStore | null>(null);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [analysisResults, setAnalysisResults] = useState<Record<string, SEOAnalysisResult>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [serpData, setSerpData] = useState<any>(null);
  const [serpLoading, setSerpLoading] = useState(true);
  const [siteAudit, setSiteAudit] = useState<WebsiteSEOAudit | null>(null);
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [optimizationHistory, setOptimizationHistory] = useState<ShopifyOptimizationHistory[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [blogTitle, setBlogTitle] = useState("");
  const [blogKeywords, setBlogKeywords] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [isGeneratingBlog, setIsGeneratingBlog] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  // Load all main Shopify Store data
  useEffect(() => {
    if (!storeId) return;

    const fetchStoreData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // --- fetch store
        const { data: storeData, error: storeError } = await supabase
          .from('shopify_stores')
          .select('*')
          .eq('id', storeId)
          .maybeSingle();
        if (storeError) {
          setError(storeError.message);
          throw storeError;
        }
        if (!storeData) {
          setError('Store not found');
          throw new Error('Store not found');
        }
        setStore(storeData as ShopifyStore);

        // --- fetch products
        try {
          const productsData: ShopifyProductsResponse = await fetchShopifyProducts(storeId);
          setProducts(productsData.products || []);
        } catch {
          setProducts([]);
          toast({
            title: "Warning",
            description: "Could not load products. Please check your store connection.",
            variant: "destructive"
          });
        }

        // --- fetch SEO analyses
        try {
          const { data: analyses } = await supabase
            .from('shopify_seo_analyses')
            .select('*')
            .eq('store_id', storeId);
          if (analyses && analyses.length > 0) {
            const analysisMap = analyses.reduce((acc, analysis) => {
              const typedAnalysis: SEOAnalysisResult = {
                product_id: analysis.product_id,
                title: analysis.title,
                handle: analysis.handle,
                issues: (analysis.issues as Json[]).map(issue => ({
                  type: (issue as any).type,
                  severity: (issue as any).severity,
                  message: (issue as any).message,
                  details: (issue as any).details
                })) as SEOIssue[],
                score: analysis.score,
                optimizations: (analysis.optimizations as Json[]).map(opt => ({
                  type: (opt as any).type,
                  field: (opt as any).field,
                  original: (opt as any).original,
                  suggestion: (opt as any).suggestion,
                  applied: (opt as any).applied
                })) as SEOOptimization[]
              };
              acc[analysis.product_id] = typedAnalysis;
              return acc;
            }, {} as Record<string, SEOAnalysisResult>);
            setAnalysisResults(analysisMap);
          }
        } catch {}

        // --- fetch audit
        try {
          const audits = await getSiteAuditHistory(storeId);
          if (audits && audits.length > 0) setSiteAudit(audits[0]);
        } catch {}

        // --- fetch optimization history
        try {
          const history = await getOptimizationHistory(storeId);
          setOptimizationHistory(history || []);
        } catch {}

        // --- fetch SERP data if store name
        if (storeData && storeData.store_name) {
          const keyword = `${storeData.store_name.toLowerCase()} products`;
          setSerpLoading(true);
          try {
            const serpResult = await fetchSerpResults(keyword);
            setSerpData(extractSerpData(serpResult));
          } catch {}
          setSerpLoading(false);
        }
      } catch (err: any) {
        setError(err instanceof Error ? err.message : 'Failed to load store data');
        setTimeout(() => navigate('/dashboard/shopify'), 3000);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreData();
  }, [storeId, toast, navigate]);

  // For product SEO optimize callback
  const handleAnalysisComplete = useCallback(
    (productId: string, analysis: SEOAnalysisResult) => {
      setAnalysisResults(prev => ({ ...prev, [productId]: analysis }));
    }, []);

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
        const pd: ShopifyProductsResponse = await fetchShopifyProducts(storeId);
        setProducts(pd.products || []);
        const { data: analyses } = await supabase
          .from('shopify_seo_analyses')
          .select('*')
          .eq('store_id', storeId);
        if (analyses) {
          const analysisMap = analyses.reduce((acc, analysis) => {
            const typedAnalysis: SEOAnalysisResult = {
              product_id: analysis.product_id,
              title: analysis.title,
              handle: analysis.handle,
              issues: (analysis.issues as Json[]).map(issue => ({
                type: (issue as any).type,
                severity: (issue as any).severity,
                message: (issue as any).message,
                details: (issue as any).details
              })) as SEOIssue[],
              score: analysis.score,
              optimizations: (analysis.optimizations as Json[]).map(opt => ({
                type: (opt as any).type,
                field: (opt as any).field,
                original: (opt as any).original,
                suggestion: (opt as any).suggestion,
                applied: (opt as any).applied
              })) as SEOOptimization[]
            };
            acc[analysis.product_id] = typedAnalysis;
            return acc;
          }, {} as Record<string, SEOAnalysisResult>);
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

  // Blog generate
  const handleBlogGenerate = async () => {
    if (!blogTitle) {
      toast({
        title: "Missing Title",
        description: "Please enter a blog post title",
        variant: "destructive"
      });
      return;
    }
    setIsGeneratingBlog(true);
    setBlogContent("");
    try {
      const storeContext = store?.store_name || "e-commerce store";
      const prompt = `
        Write an SEO-optimized blog post for a Shopify store called "${storeContext}" with the title: "${blogTitle}".
        ${blogKeywords ? `Focus on these keywords: ${blogKeywords}` : ''}
        The blog post should be informative, engaging, and follow best practices for SEO content.
        Include a compelling introduction, 3-5 main sections with subheadings, and a conclusion.
        Format the content using markdown with proper headings, lists, and emphasis where appropriate.
        The blog post should be around 800-1000 words.
      `;
      const { generateContent } = await import('@/services/geminiApi');
      const content = await generateContent(prompt);
      setBlogContent(content);
      toast({
        title: "Blog Post Generated",
        description: "Your SEO-optimized blog post has been created"
      });
    } catch {
      toast({
        title: "Generation Failed",
        description: "Failed to generate blog post content",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingBlog(false);
    }
  };

  // Site audit run
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
      const history = await getOptimizationHistory(storeId);
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

  return {
    store, products, analysisResults, isLoading, isOptimizing, serpData, serpLoading, siteAudit,
    isRunningAudit, optimizationHistory, error,
    blogTitle, setBlogTitle, blogKeywords, setBlogKeywords, blogContent, setBlogContent, isGeneratingBlog,
    handleAnalysisComplete, handleBulkOptimize, handleBlogGenerate, handleRunSiteAudit,
  }
}
