
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
} from '@/services/api';
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
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!storeId) return;
    
    const fetchStoreData = async () => {
      try {
        setIsLoading(true);
        const { data: storeData, error: storeError } = await supabase
          .from('shopify_stores')
          .select('*')
          .eq('id', storeId)
          .single();
        if (storeError) throw storeError;
        setStore(storeData as ShopifyStore);
        const productsData: ShopifyProductsResponse = await fetchShopifyProducts(storeId);
        setProducts(productsData.products);
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
        try {
          const audits = await getSiteAuditHistory(storeId);
          if (audits && audits.length > 0) {
            setSiteAudit(audits[0]);
          }
        } catch (error) {
          console.error("Error fetching site audit:", error);
        }
        try {
          const history = await getOptimizationHistory(storeId);
          setOptimizationHistory(history || []);
        } catch (error) {
          console.error("Error fetching optimization history:", error);
        }
        if (storeData && storeData.store_name) {
          const keyword = `${storeData.store_name.toLowerCase()} products`;
          setSerpLoading(true);
          try {
            const serpResult = await fetchSerpResults(keyword);
            const extractedData = extractSerpData(serpResult);
            setSerpData(extractedData);
          } catch (error) {
            console.error("Error fetching SERP data:", error);
          } finally {
            setSerpLoading(false);
          }
        }
      } catch (error) {
        console.error('Error fetching store data:', error);
        toast({
          title: "Error",
          description: "Failed to load store data",
          variant: "destructive"
        });
        navigate('/dashboard/shopify');
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

  // Calculate overall SEO score
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
