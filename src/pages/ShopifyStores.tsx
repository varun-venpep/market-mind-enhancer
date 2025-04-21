
import React, { useEffect, useState, useCallback } from 'react';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { ShopifyProtected } from "@/components/ShopifyProtected";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, ArrowLeft } from "lucide-react";
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

export default function ShopifyStores() {
  const [stores, setStores] = useState<ShopifyStore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [serpStats, setSerpStats] = useState({
    topKeywords: [] as string[],
    avgDifficulty: 0,
    totalOrganicResults: 0
  });
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const fetchStores = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getConnectedShopifyStores();
      setStores(data || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching stores:", error);
      toast({
        title: "Error",
        description: "Failed to load connected Shopify stores",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    
    const fetchSerpData = async () => {
      try {
        const mockData = {
          topKeywords: ["e-commerce seo", "product description", "shopify optimization", "conversion rate", "product meta tags"],
          avgDifficulty: 65,
          totalOrganicResults: 10
        };

        try {
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
    
    if (user) {
      fetchStores();
      fetchSerpData();
    } else {
      setIsLoading(false);
    }
    
    return () => {
      clearTimeout(loadingTimeout);
    };
  }, [user, fetchStores]);
  
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
