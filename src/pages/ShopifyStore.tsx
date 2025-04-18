
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { ShopifyProtected } from "@/components/ShopifyProtected";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag, FileText, Globe, Loader2, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState } from '@/components/Shopify/LoadingState';
import { StoreHeader } from '@/components/Shopify/StoreHeader';
import { ProductList } from '@/components/Shopify/ProductList';
import { SiteAuditReport } from '@/components/Shopify/SiteAuditReport';
import { MarketInsights } from '@/components/Shopify/MarketInsights';
import { BlogGenerator } from '@/components/Shopify/BlogGenerator';
import { useShopifyStore, ShopifyProductsResponse } from '@/hooks/useShopifyStore';
import { useShopifySiteAudit } from '@/hooks/useShopifySiteAudit';
import { useToast } from "@/components/ui/use-toast";
import { bulkOptimizeSEO, fetchShopifyProducts } from '@/services/api';
import { supabase } from '@/integrations/supabase/client';
import type { SEOAnalysisResult, SEOIssue, SEOOptimization } from '@/types/shopify';

const ShopifyStore = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState("products");
  const [isOptimizing, setIsOptimizing] = React.useState(false);
  const { toast } = useToast();
  
  const {
    store,
    products,
    analysisResults,
    setAnalysisResults,
    isLoading,
    serpData,
    serpLoading,
    setProducts
  } = useShopifyStore(storeId);
  
  const {
    currentAudit,
    optimizationHistory,
    isAuditLoading,
    handleRunAudit,
    handleApplyOptimization
  } = useShopifySiteAudit(storeId || '');

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
          <Button onClick={() => navigate('/dashboard/shopify')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Stores
          </Button>
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
          <div className="flex items-center gap-2 mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard/shopify')} 
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Stores
            </Button>
          </div>
          
          <StoreHeader 
            store={store} 
            onBulkOptimize={handleBulkOptimize} 
            isOptimizing={isOptimizing} 
          />
          
          <MarketInsights 
            averageScore={averageScore}
            productCount={allScores.length}
            serpLoading={serpLoading}
            serpData={serpData}
          />
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="mb-6">
              <TabsTrigger value="products" className="flex items-center gap-1">
                <ShoppingBag className="h-4 w-4" />
                <span>Products</span>
              </TabsTrigger>
              <TabsTrigger value="blog" className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Blog Content</span>
              </TabsTrigger>
              <TabsTrigger value="site-audit" className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                <span>Site Audit</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="products">
              <ProductList 
                products={products}
                storeId={storeId}
                analysisResults={analysisResults}
                onAnalysisComplete={handleAnalysisComplete}
              />
            </TabsContent>
            
            <TabsContent value="blog">
              <BlogGenerator storeName={store.store_name} />
            </TabsContent>
            
            <TabsContent value="site-audit">
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle>Full Site SEO Audit</CardTitle>
                      <CardDescription>
                        Comprehensive SEO audit for your entire Shopify store
                      </CardDescription>
                    </div>
                    <Button 
                      onClick={handleRunAudit} 
                      disabled={isAuditLoading}
                    >
                      {isAuditLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          Running Audit...
                        </>
                      ) : (
                        <>
                          Run New Audit
                        </>
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {isAuditLoading ? (
                      <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                        <h3 className="text-lg font-medium mb-2">Analyzing Your Store</h3>
                        <p className="text-center text-muted-foreground max-w-md">
                          We're performing a comprehensive SEO audit of your entire Shopify store.
                          This may take a few moments.
                        </p>
                      </div>
                    ) : currentAudit ? (
                      <SiteAuditReport 
                        audit={currentAudit.audit_data} 
                        onApplyOptimization={handleApplyOptimization}
                        optimizationHistory={optimizationHistory}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12">
                        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                        <h3 className="text-lg font-medium mb-2">No Audit Data Available</h3>
                        <p className="text-center text-muted-foreground max-w-md">
                          Run your first comprehensive site audit to identify SEO issues 
                          and get recommendations for improvement.
                        </p>
                        <Button 
                          className="mt-6"
                          onClick={handleRunAudit} 
                          disabled={isAuditLoading}
                        >
                          Start Site Audit
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ShopifyProtected>
    </DashboardLayout>
  );
};

export default ShopifyStore;
