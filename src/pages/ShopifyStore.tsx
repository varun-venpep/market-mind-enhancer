
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Search, Settings, ShoppingBag, Store, Zap } from "lucide-react";
import { analyzeSEO, bulkOptimizeSEO, fetchShopifyProducts, optimizeSEO } from '@/services/api';
import type { SEOAnalysisResult, ShopifyProduct, ShopifyStore } from '@/types/shopify';
import { supabase } from '@/integrations/supabase/client';

export default function ShopifyStore() {
  const { storeId } = useParams<{ storeId: string }>();
  const [store, setStore] = useState<ShopifyStore | null>(null);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [analysisResults, setAnalysisResults] = useState<Record<string, SEOAnalysisResult>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState<Record<string, boolean>>({});
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!storeId) return;
    
    const fetchStoreData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch store details from the new shopify_stores table
        const { data: storeData, error: storeError } = await supabase
          .from('shopify_stores')
          .select('*')
          .eq('id', storeId)
          .single();
          
        if (storeError) throw storeError;
        
        // Type assertion to match ShopifyStore interface
        setStore(storeData as ShopifyStore);
        
        // Fetch products
        const productsData = await fetchShopifyProducts(storeId);
        setProducts(productsData.products);
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
  
  const handleAnalyzeSEO = async (productId: string) => {
    if (!storeId) return;
    
    setIsAnalyzing(prev => ({ ...prev, [productId]: true }));
    
    try {
      const result = await analyzeSEO(storeId, productId);
      setAnalysisResults(prev => ({ ...prev, [productId]: result }));
      toast({
        title: "Analysis Complete",
        description: "SEO analysis has been completed for this product"
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze product SEO",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(prev => ({ ...prev, [productId]: false }));
    }
  };
  
  const handleOptimizeSEO = async (productId: string) => {
    if (!storeId) return;
    
    const analysisResult = analysisResults[productId];
    if (!analysisResult) return;
    
    try {
      setIsAnalyzing(prev => ({ ...prev, [productId]: true }));
      await optimizeSEO(storeId, productId, analysisResult.optimizations);
      
      toast({
        title: "Optimization Complete",
        description: "SEO optimizations have been applied to this product"
      });
      
      // Refresh analysis
      await handleAnalyzeSEO(productId);
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: "Failed to apply SEO optimizations",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(prev => ({ ...prev, [productId]: false }));
    }
  };
  
  const handleBulkOptimize = async () => {
    if (!storeId) return;
    
    setIsOptimizing(true);
    
    try {
      await bulkOptimizeSEO(storeId);
      toast({
        title: "Bulk Optimization Started",
        description: "SEO optimization for all products has been initiated"
      });
    } catch (error) {
      toast({
        title: "Bulk Optimization Failed",
        description: "Failed to start bulk SEO optimization",
        variant: "destructive"
      });
    } finally {
      setIsOptimizing(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => navigate('/dashboard/shopify')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-8 bg-muted/40 rounded w-48 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="bg-muted/20 h-24"></CardHeader>
              <CardContent className="pt-6">
                <div className="h-4 bg-muted/40 rounded mb-4"></div>
                <div className="h-4 bg-muted/40 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (!store) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Store not found</h1>
        <Button onClick={() => navigate('/dashboard/shopify')}>
          Back to Stores
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center space-x-4 mb-8">
        <Button variant="outline" size="icon" onClick={() => navigate('/dashboard/shopify')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Store className="h-6 w-6 text-primary" />
            {store.store_name || store.store_url}
          </h1>
          <p className="text-muted-foreground">{store.store_url}</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Products</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/dashboard/shopify/${storeId}/settings`)}>
            <Settings className="h-4 w-4 mr-2" />
            Store Settings
          </Button>
          <Button onClick={handleBulkOptimize} disabled={isOptimizing}>
            <Zap className="h-4 w-4 mr-2" />
            {isOptimizing ? 'Optimizing...' : 'Optimize All Products'}
          </Button>
        </div>
      </div>
      
      {products.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Products Found</CardTitle>
            <CardDescription>
              This store doesn't have any products yet. Add products to your Shopify store to start optimizing their SEO.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {products.map(product => {
            const productId = String(product.id);
            const analysis = analysisResults[productId];
            const analyzing = isAnalyzing[productId] || false;
            
            return (
              <Card key={product.id} className="overflow-hidden">
                <CardHeader className="bg-muted/10">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                        {product.title}
                      </CardTitle>
                      <CardDescription>
                        Product ID: {product.id}
                      </CardDescription>
                    </div>
                    {analysis ? (
                      <div className="flex items-center gap-2">
                        <div 
                          className={`px-3 py-1 rounded-full text-sm ${
                            analysis.score >= 80 ? 'bg-green-100 text-green-800' :
                            analysis.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          SEO Score: {analysis.score}%
                        </div>
                      </div>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    {product.images && product.images.length > 0 && (
                      <div className="w-full md:w-32 h-32 bg-muted/20 rounded overflow-hidden flex-shrink-0">
                        <img 
                          src={product.images[0].src} 
                          alt={product.images[0].alt || product.title} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}
                    <div className="flex-grow">
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Type:</span> {product.product_type || 'N/A'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Vendor:</span> {product.vendor || 'N/A'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Tags:</span> {product.tags || 'N/A'}
                        </p>
                      </div>
                      
                      {analysis ? (
                        <div className="mt-4">
                          <h3 className="font-medium mb-2">SEO Issues:</h3>
                          <ul className="space-y-2">
                            {analysis.issues.map((issue, index) => (
                              <li key={index} className="text-sm flex items-start gap-2">
                                <span 
                                  className={`w-2 h-2 rounded-full mt-1.5 ${
                                    issue.severity === 'high' ? 'bg-red-500' :
                                    issue.severity === 'medium' ? 'bg-yellow-500' :
                                    'bg-blue-500'
                                  }`}
                                ></span>
                                {issue.message}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 bg-muted/5 border-t">
                  {!analysis ? (
                    <Button 
                      onClick={() => handleAnalyzeSEO(productId)} 
                      disabled={analyzing}
                      variant="outline"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      {analyzing ? 'Analyzing...' : 'Analyze SEO'}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleOptimizeSEO(productId)}
                      disabled={analyzing || analysis.optimizations.length === 0}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      {analyzing ? 'Optimizing...' : 'Apply Optimizations'}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
