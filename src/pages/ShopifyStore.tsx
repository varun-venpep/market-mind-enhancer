
import React, { useEffect } from 'react';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { ShopifyProtected } from "@/components/ShopifyProtected";
import { useParams, useNavigate } from 'react-router-dom';
import { StoreHeader } from '@/components/Shopify/StoreHeader';
import SERPInsights from '@/components/Shopify/SERPInsights';
import StoreTabs from '@/components/Shopify/StoreTabs';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';

import { useShopifyStoreData } from "@/hooks/shopify/useShopifyStoreData";
import ShopifyStoreLoading from '@/components/Shopify/ShopifyStoreLoading';
import ShopifyStoreError from '@/components/Shopify/ShopifyStoreError';
import { supabase } from '@/integrations/supabase/client';

const ShopifyStore = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState('products');
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);
  
  // Check authentication first
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to access your Shopify store",
          variant: "destructive"
        });
        navigate('/login');
      }
      setIsCheckingAuth(false);
    };
    
    checkAuth();
  }, [navigate, toast]);
  
  const {
    store, products, analysisResults, isLoading, isOptimizing, serpData, serpLoading, siteAudit,
    isRunningAudit, optimizationHistory, error,
    blogTitle, setBlogTitle, blogKeywords, setBlogKeywords, blogContent, setBlogContent, isGeneratingBlog,
    handleAnalysisComplete, handleBulkOptimize, handleBlogGenerate, handleRunSiteAudit,
  } = useShopifyStoreData({ storeId });

  useEffect(() => {
    // Check if we have a valid storeId
    if (!storeId) {
      toast({
        title: "Invalid store",
        description: "No store ID provided",
        variant: "destructive"
      });
      navigate('/dashboard/shopify');
      return;
    }

    // Handle error by redirecting after a delay
    if (error) {
      toast({
        title: "Error loading store",
        description: error,
        variant: "destructive"
      });
      const timer = setTimeout(() => navigate('/dashboard/shopify'), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, navigate, toast, storeId]);

  if (isCheckingAuth) {
    return (
      <DashboardLayout>
        <ShopifyStoreLoading />
      </DashboardLayout>
    );
  }
  
  if (isLoading) {
    return (
      <DashboardLayout>
        <ShopifyStoreLoading />
      </DashboardLayout>
    );
  }
  
  if (error) {
    return (
      <DashboardLayout>
        <ShopifyStoreError error={error} />
      </DashboardLayout>
    );
  }
  
  if (!store) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <div className="text-center py-12 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Store not found</h1>
            <p className="text-muted-foreground mb-6">
              This store may have been deleted or you may not have access to it.
            </p>
            <Button onClick={() => navigate('/dashboard/shopify')} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Stores
            </Button>
          </div>
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
