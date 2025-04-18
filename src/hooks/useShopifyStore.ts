import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { fetchShopifyProducts } from '@/services/api';
import { fetchSerpResults, extractSerpData } from '@/services/serpApi';
import type { ShopifyStore, ShopifyProduct, SEOAnalysisResult, SEOIssue, SEOOptimization } from '@/types/shopify';
import type { ShopifyProductsResponse } from '@/services/api';

export function useShopifyStore(storeId: string | undefined) {
  const [store, setStore] = useState<ShopifyStore | null>(null);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [analysisResults, setAnalysisResults] = useState<Record<string, SEOAnalysisResult>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [serpData, setSerpData] = useState<any>(null);
  const [serpLoading, setSerpLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!storeId) return;
    
    const fetchStoreData = async () => {
      try {
        setIsLoading(true);
        
        const { data: storeData, error: storeError } = await supabase
          .from('shopify_stores')
          .select('*')
          .eq('id', storeId)
          .single();
          
        if (storeError) throw storeError;
        
        setStore(storeData as ShopifyStore);
        
        const productsData: ShopifyProductsResponse = await fetchShopifyProducts(storeId);
        setProducts(productsData.products);
        
        const { data: analyses, error: analysesError } = await supabase
          .from('shopify_seo_analyses')
          .select('*')
          .eq('store_id', storeId);
          
        if (!analysesError && analyses) {
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
        
        if (storeData && storeData.store_name) {
          const keyword = `${storeData.store_name.toLowerCase()} products`;
          setSerpLoading(true);
          
          try {
            const serpResult = await fetchSerpResults(keyword);
            const extractedData = extractSerpData(serpResult);
            setSerpData(extractedData);
          } catch (error) {
            console.error("Error fetching SERP data:", error);
          } finally {
            setSerpLoading(false);
          }
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

  return {
    store,
    products,
    analysisResults,
    setAnalysisResults,
    isLoading,
    serpData,
    serpLoading,
    setProducts
  };
}
