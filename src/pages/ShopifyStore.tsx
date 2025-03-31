import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { bulkOptimizeSEO, fetchShopifyProducts, ShopifyProductsResponse } from '@/services/api';
import type { SEOAnalysisResult, ShopifyProduct, ShopifyStore } from '@/types/shopify';
import { supabase } from '@/integrations/supabase/client';
import { LoadingState } from '@/components/Shopify/LoadingState';
import { StoreHeader } from '@/components/Shopify/StoreHeader';
import { ProductList } from '@/components/Shopify/ProductList';
import { ArrowLeft } from 'lucide-react';

export default function ShopifyStore() {
  const { storeId } = useParams<{ storeId: string }>();
  const [store, setStore] = useState<ShopifyStore | null>(null);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [analysisResults, setAnalysisResults] = useState<Record<string, SEOAnalysisResult>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!storeId) return;
    
    const fetchStoreData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch store details from the shopify_stores table
        const { data: storeData, error: storeError } = await supabase
          .from('shopify_stores')
          .select('*')
          .eq('id', storeId)
          .single();
          
        if (storeError) throw storeError;
        
        setStore(storeData as ShopifyStore);
        
        // Fetch products with proper typing
        const productsData: ShopifyProductsResponse = await fetchShopifyProducts(storeId);
        setProducts(productsData.products);
        
        // Fetch existing analyses
        const { data: analyses, error: analysesError } = await supabase
          .from('shopify_seo_analyses')
          .select('*')
          .eq('store_id', storeId);
          
        if (!analysesError && analyses) {
          // Create a lookup table by product ID
          const analysisMap = analyses.reduce((acc, analysis) => {
            // Ensure analysis conforms to SEOAnalysisResult type
            const typedAnalysis: SEOAnalysisResult = {
              product_id: analysis.product_id, // This will be a string
              title: analysis.title,
              handle: analysis.handle,
              issues: analysis.issues,
              score: analysis.score,
              optimizations: analysis.optimizations
            };
            
            acc[analysis.product_id] = typedAnalysis;
            return acc;
          }, {} as Record<string, SEOAnalysisResult>);
          
          setAnalysisResults(analysisMap);
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
      
      // Refresh the data after a delay to allow for processing
      setTimeout(async () => {
        const productsData: ShopifyProductsResponse = await fetchShopifyProducts(storeId);
        setProducts(productsData.products);
        
        // Refresh analyses
        const { data: analyses } = await supabase
          .from('shopify_seo_analyses')
          .select('*')
          .eq('store_id', storeId);
          
        if (analyses) {
          const analysisMap = analyses.reduce((acc, analysis) => {
            // Ensure analysis conforms to SEOAnalysisResult type
            const typedAnalysis: SEOAnalysisResult = {
              product_id: analysis.product_id, // This will be a string
              title: analysis.title,
              handle: analysis.handle,
              issues: analysis.issues,
              score: analysis.score,
              optimizations: analysis.optimizations
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
    return <LoadingState />;
  }
  
  if (!store) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Store not found</h1>
        <Button onClick={() => navigate('/dashboard/shopify')} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Stores
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <StoreHeader 
        store={store} 
        onBulkOptimize={handleBulkOptimize} 
        isOptimizing={isOptimizing} 
      />
      
      <ProductList 
        products={products}
        storeId={storeId}
        analysisResults={analysisResults}
        onAnalysisComplete={handleAnalysisComplete}
      />
    </div>
  );
}
