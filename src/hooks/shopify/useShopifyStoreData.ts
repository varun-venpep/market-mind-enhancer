
import React from "react";
import { useShopifyStoreMeta } from "./useShopifyStoreMeta";
import { useShopifySEOAnalysis } from "./useShopifySEOAnalysis";
import { useShopifyAuditHistory } from "./useShopifyAuditHistory";
import { useShopifyBlogGenerator } from "./useShopifyBlogGenerator";
import { useShopifyActions } from "./useShopifyActions";
import type { ShopifyProductsResponse } from '@/types/shopify';

interface UseShopifyStoreDataProps {
  storeId: string | undefined;
}

export const useShopifyStoreData = ({ storeId }: UseShopifyStoreDataProps) => {
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

  // Additional UI and action state + handlers
  const {
    isOptimizing,
    serpData,
    serpLoading,
    isRunningAudit,
    handleBulkOptimize,
    handleRunSiteAudit,
  } = useShopifyActions(
    storeId,
    store?.store_name,
    setProducts,
    setAnalysisResults,
    setSiteAudit,
    setOptimizationHistory
  );

  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => window.location.assign('/dashboard/shopify'), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return {
    store,
    products,
    analysisResults,
    isLoading,
    isOptimizing,
    serpData,
    serpLoading,
    siteAudit,
    isRunningAudit,
    optimizationHistory,
    error,
    blogTitle,
    setBlogTitle,
    blogKeywords,
    setBlogKeywords,
    blogContent,
    setBlogContent,
    isGeneratingBlog,
    handleAnalysisComplete,
    handleBulkOptimize,
    handleBlogGenerate,
    handleRunSiteAudit,
  };
};
