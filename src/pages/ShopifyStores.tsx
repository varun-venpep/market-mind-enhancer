
import React, { useEffect, useState, useCallback } from 'react';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { ShopifyProtected } from "@/components/ShopifyProtected";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, ArrowLeft, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import ShopifyConnect from '@/components/ShopifyConnect';
import { getConnectedShopifyStores, disconnectShopifyStore } from '@/services/shopify';
import { fetchSerpResults, extractSerpData } from '@/services/serpApi';
import type { ShopifyStore } from '@/types/shopify';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// Refactored components:
import ShopifySerpStatsCards from '@/components/Shopify/ShopifySerpStatsCards';
import ShopifyStoreList from '@/components/Shopify/ShopifyStoreList';
import ShopifyNoStores from '@/components/Shopify/ShopifyNoStores';
import { supabase } from '@/integrations/supabase/client';
import { refreshSession } from '@/services/supabaseUtils';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ShopifyStores() {
  const [stores, setStores] = useState<ShopifyStore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [serpStats, setSerpStats] = useState({
    topKeywords: [] as string[],
    avgDifficulty: 0,
    totalOrganicResults: 0
  });
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { user, session, refreshSession: authRefresh } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // First check if we need to refresh the session
  useEffect(() => {
    const checkAuth = async () => {
      setIsRefreshing(true);
      setAuthError(null);
      console.log("Checking authentication status...");
      
      try {
        if (!user || !session) {
          console.log("No active session found, attempting refresh");
          // Try to refresh with the auth context's refresh method first
          const authRefreshed = await authRefresh();
          
          if (!authRefreshed) {
            console.log("Auth context refresh failed, trying utility function");
            // Then try with the utility function as backup
            const utilRefreshed = await refreshSession();
            
            if (!utilRefreshed) {
              console.error("All session refresh attempts failed");
              setAuthError("Authentication required. Please sign in to continue.");
              toast({
                title: "Authentication required",
                description: "Please sign in to access this feature",
                variant: "destructive"
              });
              
              // Redirect to login after a short delay
              setTimeout(() => navigate('/login'), 2000);
              return;
            }
          }
        }
        
        console.log("Authentication check complete, session is valid");
        setAuthChecked(true);
      } catch (error) {
        console.error("Error during auth check:", error);
        setAuthError("Authentication check failed. Please try again.");
      } finally {
        setIsRefreshing(false);
      }
    };
    
    checkAuth();
  }, [user, session, navigate, toast, authRefresh]);
  
  const fetchStores = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      
      // Ensure fresh session first
      console.log("Refreshing session before fetching stores");
      const refreshed = await refreshSession();
      
      if (!refreshed) {
        console.error("Session refresh failed before fetch");
        setLoadError("Could not refresh authentication. Please sign in again.");
        setIsLoading(false);
        return;
      }
      
      console.log("Fetching connected Shopify stores");
      const data = await getConnectedShopifyStores();
      console.log(`Fetched ${data?.length || 0} stores`);
      setStores(data || []);
    } catch (error) {
      console.error("Error fetching stores:", error);
      setLoadError("Failed to load connected Shopify stores. Please try again.");
      toast({
        title: "Error",
        description: "Failed to load connected Shopify stores",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    if (authChecked && user && session) {
      console.log("Auth checked and session valid, fetching data");
      
      // Set a timeout to ensure loading state doesn't hang forever
      const loadingTimeout = setTimeout(() => {
        setIsLoading(false);
        setLoadError("Loading timeout. Please refresh the page.");
      }, 15000);
      
      // Continue with data loading
      fetchStores();
      fetchSerpData();
      
      return () => {
        clearTimeout(loadingTimeout);
      };
    }
  }, [user, fetchStores, authChecked, session]);
  
  // Add periodic session refresh to prevent auth issues
  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      console.log("Periodic session refresh");
      await refreshSession();
    }, 3 * 60 * 1000); // Every 3 minutes
    
    return () => clearInterval(refreshInterval);
  }, []);
  
  useEffect(() => {
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
  }, [navigate]);
  
  const fetchSerpData = async () => {
    try {
      const mockData = {
        topKeywords: ["e-commerce seo", "product description", "shopify optimization", "conversion rate", "product meta tags"],
        avgDifficulty: 65,
        totalOrganicResults: 10
      };

      try {
        console.log("Fetching SERP results");
        const result = await fetchSerpResults("e-commerce seo best practices");
        const data = extractSerpData(result);
        
        const topKeywords = (data.relatedKeywords || [])
          .sort((a, b) => b.searchVolume - a.searchVolume)
          .slice(0, 5)
          .map(k => k.keyword);
          
        const avgDifficulty = Math.round(
          (data.relatedKeywords || []).reduce((sum, k) => sum + k.difficulty, 0) / 
          (data.relatedKeywords?.length || 1)
        );
        
        setSerpStats({
          topKeywords,
          avgDifficulty,
          totalOrganicResults: data.organicResults?.length || 0
        });
      } catch (error) {
        console.warn("Using mock SERP data due to API error:", error);
        setSerpStats(mockData);
      }
    } catch (error) {
      console.error("Error in SERP data handling:", error);
    }
  };
  
  const handleDisconnect = async (storeId: string) => {
    if (confirm("Are you sure you want to disconnect this store? This will remove all data associated with it.")) {
      try {
        await disconnectShopifyStore(storeId);
        setStores(stores.filter(store => store.id !== storeId));
        toast({
          title: "Store Disconnected",
          description: "Your Shopify store has been disconnected successfully"
        });
      } catch (error) {
        console.error("Error disconnecting store:", error);
        toast({
          title: "Error",
          description: "Failed to disconnect store",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleStoreConnected = () => {
    // Close the dialog
    setIsDialogOpen(false);
    // Refetch the stores list
    fetchStores();
  };
  
  const handleViewStore = (storeId: string) => {
    navigate(`/dashboard/shopify/${storeId}`);
  };
  
  const handleRefreshSession = async () => {
    setIsRefreshing(true);
    setAuthError(null);
    try {
      // Try both refresh methods for maximum reliability
      const authSuccess = await authRefresh();
      const utilSuccess = await refreshSession();
      
      const success = authSuccess || utilSuccess;
      
      if (success) {
        toast({
          title: "Session Refreshed",
          description: "Authentication session has been refreshed",
          variant: "default"
        });
        await fetchStores();
      } else {
        setAuthError("Session refresh failed. Please sign in again.");
        toast({
          title: "Session Refresh Failed",
          description: "Please try signing in again",
          variant: "destructive"
        });
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (error) {
      console.error("Error refreshing session:", error);
      setAuthError("Session refresh error. Please sign in again.");
      toast({
        title: "Session Refresh Error",
        description: "An error occurred refreshing your session",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Show a loading indicator until auth is checked
  if (!authChecked || isRefreshing) {
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

  // Show auth error if any
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
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <ShopifyProtected>
        <div className="container mx-auto py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/dashboard/integrations')} 
                  className="mb-2"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Integrations
                </Button>
              </div>
              <h1 className="text-3xl font-bold gradient-text">Shopify SEO Automation</h1>
              <p className="text-muted-foreground mt-1">
                Connect and manage your Shopify stores for automated SEO optimization
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleRefreshSession} 
                className="gap-2" 
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Session'}
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 shadow-sm hover:shadow-md transition-all">
                    <Plus className="h-4 w-4" />
                    Connect New Store
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Connect Shopify Store</DialogTitle>
                    <DialogDescription>
                      Enter your Shopify store credentials to connect it to the SEO platform
                    </DialogDescription>
                  </DialogHeader>
                  <ShopifyConnect onStoreConnected={handleStoreConnected} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {loadError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Data</AlertTitle>
              <AlertDescription>{loadError}</AlertDescription>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={fetchStores}
                  disabled={isLoading}
                  className="gap-2"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRefreshSession}
                  disabled={isRefreshing}
                  className="gap-2"
                >
                  {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Refresh Session
                </Button>
              </div>
            </Alert>
          )}
          
          <ShopifySerpStatsCards isLoading={isLoading} serpStats={serpStats} />
          
          {isLoading ? (
            <ShopifyStoreList
              stores={[]} 
              isLoading={true}
              onDisconnect={() => {}}
              onView={() => {}}
            />
          ) : stores.length > 0 ? (
            <ShopifyStoreList
              stores={stores}
              isLoading={false}
              onDisconnect={handleDisconnect}
              onView={handleViewStore}
            />
          ) : (
            <ShopifyNoStores />
          )}
        </div>
      </ShopifyProtected>
    </DashboardLayout>
  );
}
