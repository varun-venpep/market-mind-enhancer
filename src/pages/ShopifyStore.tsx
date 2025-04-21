import React, { useEffect, useState } from 'react';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { ShopifyProtected } from "@/components/ShopifyProtected";
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
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
import { supabase } from '@/integrations/supabase/client';
import { LoadingState } from '@/components/Shopify/LoadingState';
import { StoreHeader } from '@/components/Shopify/StoreHeader';
import SERPInsights from '@/components/Shopify/SERPInsights';
import StoreTabs from '@/components/Shopify/StoreTabs';

const ShopifyStore = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const [store, setStore] = useState<ShopifyStore | null>(null);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [analysisResults, setAnalysisResults] = useState<Record<string, SEOAnalysisResult>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [serpData, setSerpData] = useState<any>(null);
  const [serpLoading, setSerpLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("products");
  const [blogTitle, setBlogTitle] = useState("");
  const [blogKeywords, setBlogKeywords] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [isGeneratingBlog, setIsGeneratingBlog] = useState(false);
  const [siteAudit, setSiteAudit] = useState<WebsiteSEOAudit | null>(null);
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [optimizationHistory, setOptimizationHistory] = useState<ShopifyOptimizationHistory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!storeId) return;
    
    const fetchStoreData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch store details
        const { data: storeData, error: storeError } = await supabase
          .from('shopify_stores')
          .select('*')
          .eq('id', storeId)
          .single();
          
        if (storeError) {
          console.error('Error fetching store data:', storeError);
          throw storeError;
        }
        
        if (!storeData) {
          console.error('No store found with ID:', storeId);
          throw new Error('Store not found');
        }
        
        console.log('Fetched store data:', storeData);
        setStore(storeData as ShopifyStore);
        
        // Fetch products
        try {
          console.log('Fetching products for store:', storeId);
          const productsData: ShopifyProductsResponse = await fetchShopifyProducts(storeId);
          console.log('Fetched products:', productsData);
          
          if (productsData && productsData.products) {
            setProducts(productsData.products);
          } else {
            console.warn('No products returned for store:', storeId);
            setProducts([]);
          }
        } catch (productsError) {
          console.error('Error fetching products:', productsError);
          toast({
            title: "Warning",
            description: "Could not load products. Please check your store connection.",
            variant: "destructive"
          });
          setProducts([]);
        }
        
        // Fetch SEO analyses
        try {
          const { data: analyses, error: analysesError } = await supabase
            .from('shopify_seo_analyses')
            .select('*')
            .eq('store_id', storeId);
            
          if (analysesError) {
            console.error('Error fetching SEO analyses:', analysesError);
          } else if (analyses && analyses.length > 0) {
            console.log('Fetched SEO analyses:', analyses);
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
        } catch (analysesError) {
          console.error('Error processing SEO analyses:', analysesError);
        }
        
        // Fetch site audit
        try {
          const audits = await getSiteAuditHistory(storeId);
          if (audits && audits.length > 0) {
            console.log('Fetched site audit:', audits[0]);
            setSiteAudit(audits[0]);
          }
        } catch (auditError) {
          console.error("Error fetching site audit:", auditError);
        }
        
        // Fetch optimization history
        try {
          const history = await getOptimizationHistory(storeId);
          console.log('Fetched optimization history:', history);
          setOptimizationHistory(history || []);
        } catch (historyError) {
          console.error("Error fetching optimization history:", historyError);
        }
        
        // Fetch SERP data if store name is available
        if (storeData && storeData.store_name) {
          const keyword = `${storeData.store_name.toLowerCase()} products`;
          setSerpLoading(true);
          try {
            const serpResult = await fetchSerpResults(keyword);
            const extractedData = extractSerpData(serpResult);
            setSerpData(extractedData);
          } catch (serpError) {
            console.error("Error fetching SERP data:", serpError);
          } finally {
            setSerpLoading(false);
          }
        }
      } catch (error) {
        console.error('Error in fetchStoreData:', error);
        setError(error instanceof Error ? error.message : 'Failed to load store data');
        toast({
          title: "Error",
          description: "Failed to load store data. Please try again later.",
          variant: "destructive"
        });
        setTimeout(() => navigate('/dashboard/shopify'), 3000);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStoreData();
  }, [storeId, toast, navigate]);

  const handleAnalysisComplete = (productId: string, analysis: SEOAnalysisResult) => {
    setAnalysisResults(prev => ({
      ...prev,
      [productId]: analysis
    }));
  };
  
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
        const productsData: ShopifyProductsResponse = await fetchShopifyProducts(storeId);
        setProducts(productsData.products);
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
              issues: analysis.issues as unknown as SEOIssue[],
              score: analysis.score,
              optimizations: analysis.optimizations as unknown as SEOOptimization[]
            };
            acc[analysis.product_id] = typedAnalysis;
            return acc;
          }, {} as Record<string, SEOAnalysisResult>);
          setAnalysisResults(analysisMap);
        }
        setIsOptimizing(false);
      }, 3000);
    } catch (error) {
      toast({
        title: "Bulk Optimization Failed",
        description: "Failed to start bulk SEO optimization",
        variant: "destructive"
      });
      setIsOptimizing(false);
    }
  };

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
    } catch (error) {
      console.error("Error generating blog post:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate blog post content",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingBlog(false);
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
      setSiteAudit(auditResult);
      const history = await getOptimizationHistory(storeId);
      setOptimizationHistory(history || []);
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

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState />
      </DashboardLayout>
    );
  }
  
  if (error) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <div className="rounded-lg bg-red-50 p-6 shadow-sm border border-red-200 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold text-red-700 mb-4">Error Loading Store</h1>
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={() => navigate('/dashboard/shopify')} className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              Back to Stores
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!store) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-8">Store not found</h1>
          <button onClick={() => navigate('/dashboard/shopify')} className="gap-2 btn btn-primary">
            Back to Stores
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const allScores = Object.values(analysisResults).map(result => result.score);
  const averageScore = allScores.length > 0 
    ? Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length) 
    : 0;

  return (
    <DashboardLayout>
      <ShopifyProtected>
        <div className="container mx-auto py-8">
          <StoreHeader 
            store={store} 
            onBulkOptimize={handleBulkOptimize} 
            isOptimizing={isOptimizing} 
          />
          <SERPInsights
            siteAudit={siteAudit}
            averageScore={averageScore}
            serpLoading={serpLoading}
            serpData={serpData}
            allScores={allScores}
          />
          <StoreTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isRunningAudit={isRunningAudit}
            siteAudit={siteAudit}
            handleRunSiteAudit={handleRunSiteAudit}
            storeId={storeId || ""}
            products={products}
            analysisResults={analysisResults}
            onAnalysisComplete={handleAnalysisComplete}
            optimizationHistory={optimizationHistory}
            isLoading={isLoading}
            blogTitle={blogTitle}
            setBlogTitle={setBlogTitle}
            blogKeywords={blogKeywords}
            setBlogKeywords={setBlogKeywords}
            blogContent={blogContent}
            setBlogContent={setBlogContent}
            isGeneratingBlog={isGeneratingBlog}
            handleBlogGenerate={handleBlogGenerate}
            toast={toast}
          />
        </div>
      </ShopifyProtected>
    </DashboardLayout>
  );
};

export default ShopifyStore;
