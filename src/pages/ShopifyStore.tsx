
import React from 'react';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { ShopifyProtected } from "@/components/ShopifyProtected";
import { useParams } from 'react-router-dom';
import { StoreHeader } from '@/components/Shopify/StoreHeader';
import SERPInsights from '@/components/Shopify/SERPInsights';
import StoreTabs from '@/components/Shopify/StoreTabs';

import { useShopifyStoreData } from "@/hooks/shopify/useShopifyStoreData";
import ShopifyStoreLoading from '@/components/Shopify/ShopifyStoreLoading';
import ShopifyStoreError from '@/components/Shopify/ShopifyStoreError';

const ShopifyStore = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const {
    store, products, analysisResults, isLoading, isOptimizing, serpData, serpLoading, siteAudit,
    isRunningAudit, optimizationHistory, error,
    blogTitle, setBlogTitle, blogKeywords, setBlogKeywords, blogContent, setBlogContent, isGeneratingBlog,
    handleAnalysisComplete, handleBulkOptimize, handleBlogGenerate, handleRunSiteAudit,
  } = useShopifyStoreData({ storeId });

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
          <h1 className="text-3xl font-bold mb-8">Store not found</h1>
          <button onClick={() => window.location.assign('/dashboard/shopify')} className="gap-2 btn btn-primary">
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
            activeTab="products"
            setActiveTab={() => {}}
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
            toast={() => {}}
          />
        </div>
      </ShopifyProtected>
    </DashboardLayout>
  );
};

export default ShopifyStore;
