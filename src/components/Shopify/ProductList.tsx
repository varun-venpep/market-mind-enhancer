import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SEOAnalysisResult, ShopifyProduct } from '@/types/shopify';
import { ProductCard } from './ProductCard';
import EmptyProductState from './EmptyProductState';
import { useEffect, useState } from 'react';
import { fetchShopifyProducts } from '@/services/shopify/products';
import { toast } from 'sonner';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { refreshSession } from '@/services/supabase';

interface ProductListProps {
  products: ShopifyProduct[];
  storeId: string;
  analysisResults: Record<string, SEOAnalysisResult>;
  onAnalysisComplete: (productId: string, analysis: SEOAnalysisResult) => void;
}

export function ProductList({ products: initialProducts, storeId, analysisResults, onAnalysisComplete }: ProductListProps) {
  const [products, setProducts] = useState<ShopifyProduct[]>(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const refreshProducts = async () => {
    if (!storeId) return;
    
    setIsLoading(true);
    setIsRefreshing(true);
    setError(null);
    
    try {
      await refreshSession();
      
      const response = await fetchShopifyProducts(storeId);
      
      if (response.error) {
        setError(response.error);
        toast.error(`Failed to refresh products: ${response.error}`);
      } else {
        setProducts(response.products || []);
        toast.success(`Successfully refreshed ${response.products?.length || 0} products`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setError(errorMessage);
      toast.error(`Failed to refresh products: ${errorMessage}`);
      
      if (errorMessage.includes('401') || 
          errorMessage.includes('auth') || 
          errorMessage.includes('authorization')) {
        try {
          const refreshed = await refreshSession();
          if (refreshed) {
            toast.info("Session refreshed, trying again...");
            try {
              const retryResponse = await fetchShopifyProducts(storeId);
              if (!retryResponse.error && retryResponse.products) {
                setProducts(retryResponse.products);
                setError(null);
                toast.success(`Successfully refreshed ${retryResponse.products.length || 0} products after session refresh`);
              }
            } catch (retryError) {
              console.error("Retry error after session refresh:", retryError);
            }
          }
        } catch (refreshError) {
          console.error("Error refreshing session:", refreshError);
        }
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);
  
  useEffect(() => {
    if (storeId && products.length === 0 && !isLoading && !error) {
      refreshProducts();
    }
  }, [storeId, products.length]);
  
  if (isLoading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <h3 className="text-lg font-medium mb-2">Loading Products</h3>
        <p className="text-center text-muted-foreground">
          Please wait while we fetch your Shopify products...
        </p>
      </div>
    );
  }
  
  if (error && products.length === 0) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4 mr-2" />
        <AlertTitle>Error Loading Products</AlertTitle>
        <AlertDescription className="mt-2">{error}</AlertDescription>
        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={refreshProducts}
            disabled={isLoading}
          >
            {isLoading ? 'Trying Again...' : 'Try Again'}
          </Button>
          <Button 
            variant="outline" 
            onClick={async () => {
              const refreshed = await refreshSession();
              if (refreshed) {
                toast.success("Session refreshed successfully");
                refreshProducts();
              } else {
                toast.error("Failed to refresh session");
              }
            }}
            disabled={isLoading}
          >
            Refresh Session
          </Button>
        </div>
      </Alert>
    );
  }
  
  if (products.length === 0) {
    return (
      <EmptyProductState onRefresh={refreshProducts} isLoading={isLoading} />
    );
  }
  
  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="default" className="mb-6"> 
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-end mb-4">
        <Button 
          onClick={refreshProducts} 
          variant="outline" 
          size="sm"
          className="gap-2"
          disabled={isLoading || isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Products'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {products.map(product => {
          const productId = String(product.id);
          const analysis = analysisResults[productId] || null;
          
          return (
            <ProductCard
              key={product.id}
              product={product}
              storeId={storeId}
              initialAnalysis={analysis}
              onAnalysisComplete={onAnalysisComplete}
            />
          );
        })}
      </div>
    </div>
  );
}
