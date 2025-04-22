
import React, { useEffect, useState, useCallback } from 'react';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { ShopifyProtected } from "@/components/ShopifyProtected";
import { useParams, useNavigate } from 'react-router-dom';
import { StoreHeader } from '@/components/Shopify/StoreHeader';
import SERPInsights from '@/components/Shopify/SERPInsights';
import StoreTabs from '@/components/Shopify/StoreTabs';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';

import { useShopifyStoreData } from "@/hooks/shopify/useShopifyStoreData";
import ShopifyStoreLoading from '@/components/Shopify/ShopifyStoreLoading';
import ShopifyStoreError from '@/components/Shopify/ShopifyStoreError';
import { supabase } from '@/integrations/supabase/client';
import { refreshSession } from '@/services/supabase';
import { useAuth } from '@/contexts/AuthContext';

const ShopifyStore = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState('products');
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const { session, user, refreshSession: authRefresh } = useAuth();
  const [dataReady, setDataReady] = useState(false);
  
  // Check authentication once and avoid multiple checks that could cause flickering
  const checkAuth = useCallback(async () => {
    if (!isCheckingAuth) return;
    
    try {
      setIsRefreshing(true);
      console.log("Checking authentication status...");
      
      // First check if we already have a valid session in auth context
      if (session && user) {
        console.log("Valid session found in auth context");
        setIsCheckingAuth(false);
        return true;
      }
      
      // Try to refresh the session
      const refreshed = await refreshSession();
      
      if (refreshed) {
        console.log("Session refreshed successfully");
        setIsCheckingAuth(false);
        return true;
      }
      
      console.log("No valid session found after refresh");
      setAuthError("Please sign in to access your Shopify store");
      setTimeout(() => navigate('/login', { replace: true }), 2000);
      return false;
    } catch (err) {
      console.error("Error checking authentication:", err);
      setAuthError("Error checking authentication");
      return false;
    } finally {
      setIsRefreshing(false);
      setIsCheckingAuth(false);
    }
  }, [isCheckingAuth, navigate, session, user]);
  
  // Validate store ID format only once on initial load
  useEffect(() => {
    // Validate storeId format
    if (storeId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(storeId)) {
      setAuthError("Invalid store ID format");
      toast({
        title: "Error",
        description: "Invalid store ID format",
        variant: "destructive"
      });
      setTimeout(() => navigate('/dashboard/shopify', { replace: true }), 2000);
    }
    
    // Save last visited store ID
    if (storeId) {
      localStorage.setItem('lastVisitedStoreId', storeId);
    }
  }, [storeId, navigate, toast]);
  
  // Initial auth check
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  // Set up auth state change listener only once
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed in ShopifyStore:", event);
      
      if (event === 'SIGNED_OUT') {
        navigate('/login', { replace: true });
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
  
  // Set up periodic session refresh without causing re-renders
  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      console.log("Periodic silent session refresh");
      try {
        await refreshSession();
      } catch (error) {
        console.error("Error in periodic refresh:", error);
      }
    }, 5 * 60 * 1000); // Every 5 minutes
    
    return () => clearInterval(refreshInterval);
  }, []);
  
  const {
    store, products, analysisResults, isLoading, isOptimizing, serpData, serpLoading, siteAudit,
    isRunningAudit, optimizationHistory, error,
    blogTitle, setBlogTitle, blogKeywords, setBlogKeywords, blogContent, setBlogContent, isGeneratingBlog,
    handleAnalysisComplete, handleBulkOptimize, handleBlogGenerate, handleRunSiteAudit,
  } = useShopifyStoreData({ storeId });

  // Manage data loading state with debounce to prevent flickering
  useEffect(() => {
    if (!isLoading && !isCheckingAuth && !error) {
      // Use a timeout to ensure the UI doesn't flicker with rapid state changes
      const timer = setTimeout(() => {
        setDataReady(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isCheckingAuth, error]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading store",
        description: error,
        variant: "destructive"
      });
      const timer = setTimeout(() => navigate('/dashboard/shopify', { replace: true }), 3000);
      return () => clearTimeout(timer);
    }
  }, [error, navigate, toast]);

  const handleRefreshSession = async () => {
    setIsRefreshing(true);
    try {
      // Try both refresh methods
      const authSuccess = await authRefresh();
      const utilSuccess = await refreshSession();
      
      if (authSuccess || utilSuccess) {
        toast({
          title: "Session Refreshed",
          description: "Authentication session has been refreshed",
        });
        setAuthError(null);
        window.location.reload(); // Clean reload after successful refresh
      } else {
        toast({
          title: "Session Refresh Failed",
          description: "Please try signing in again",
          variant: "destructive"
        });
        setTimeout(() => navigate('/login', { replace: true }), 2000);
      }
    } catch (error) {
      console.error("Error refreshing session:", error);
      toast({
        title: "Error",
        description: "Failed to refresh session",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isCheckingAuth || isRefreshing) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8 flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
          <h2 className="text-2xl font-semibold mb-2">
            {isRefreshing ? "Refreshing Session..." : "Checking Authentication..."}
          </h2>
          <p className="text-muted-foreground">Please wait while we verify your credentials</p>
        </div>
      </DashboardLayout>
    );
  }
  
  if (authError) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <div className="text-center py-12 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Authentication Error</h1>
            <p className="text-muted-foreground mb-6">{authError}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/login')} className="gap-2">
                Go to Login
              </Button>
              <Button 
                onClick={handleRefreshSession} 
                variant="outline" 
                className="gap-2"
                disabled={isRefreshing}
              >
                {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Refresh Session
              </Button>
              <Button onClick={() => navigate('/dashboard/shopify')} variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Stores
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (isLoading || !dataReady) {
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
