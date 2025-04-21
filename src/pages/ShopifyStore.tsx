
import React, { useEffect, useState } from 'react';
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
import { refreshSession } from '@/services/supabaseUtils';

const ShopifyStore = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState('products');
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  
  // Check authentication first
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsRefreshing(true);
        
        // Try to refresh the session first to prevent flickering due to auth issues
        await refreshSession();
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session check error:", error);
          setAuthError("Authentication error: " + error.message);
          toast({
            title: "Authentication Error",
            description: error.message,
            variant: "destructive"
          });
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
        
        if (!data.session) {
          // One more refresh attempt before giving up
          const refreshed = await refreshSession();
          if (!refreshed) {
            setAuthError("Please sign in to access your Shopify store");
            toast({
              title: "Authentication Required",
              description: "Please sign in to access your Shopify store",
              variant: "destructive"
            });
            setTimeout(() => navigate('/login'), 2000);
            return;
          }
        }
        
        // Also validate storeId format here
        if (!storeId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(storeId)) {
          setAuthError("Invalid store ID format");
          toast({
            title: "Error",
            description: "Invalid store ID format",
            variant: "destructive"
          });
          setTimeout(() => navigate('/dashboard/shopify'), 2000);
          return;
        }
        
        localStorage.setItem('lastVisitedStoreId', storeId);
        setIsCheckingAuth(false);
      } catch (err) {
        console.error("Error checking authentication:", err);
        setAuthError("Error checking authentication");
        toast({
          title: "Authentication Error",
          description: "Failed to check authentication status",
          variant: "destructive"
        });
        setTimeout(() => navigate('/login'), 2000);
      } finally {
        setIsRefreshing(false);
      }
    };
    
    checkAuth();
    
    // Set up auth state change listeners
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_OUT') {
        // Handle sign out
        navigate('/login');
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast, storeId]);
  
  const {
    store, products, analysisResults, isLoading, isOptimizing, serpData, serpLoading, siteAudit,
    isRunningAudit, optimizationHistory, error,
    blogTitle, setBlogTitle, blogKeywords, setBlogKeywords, blogContent, setBlogContent, isGeneratingBlog,
    handleAnalysisComplete, handleBulkOptimize, handleBlogGenerate, handleRunSiteAudit,
  } = useShopifyStoreData({ storeId });

  useEffect(() => {
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

  // Add periodic session refresh to prevent auth issues
  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      await refreshSession();
    }, 60000); // Every minute
    
    return () => clearInterval(refreshInterval);
  }, []);

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
                onClick={async () => {
                  setIsRefreshing(true);
                  const success = await refreshSession();
                  setIsRefreshing(false);
                  if (success) {
                    window.location.reload();
                  }
                }} 
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
