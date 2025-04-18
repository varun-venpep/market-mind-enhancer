
import { useShopifyStoreData } from './shopify/useShopifyStoreData';
import { useShopifyProducts } from './shopify/useShopifyProducts';
import { useSEOAnalysis } from './shopify/useSEOAnalysis';
import { useSerpData } from './shopify/useSerpData';

export function useShopifyStore(storeId: string | undefined) {
  const { store, isLoading: storeLoading } = useShopifyStoreData(storeId);
  const { products, setProducts, isLoading: productsLoading } = useShopifyProducts(storeId);
  const { analysisResults, setAnalysisResults, isLoading: analysisLoading } = useSEOAnalysis(storeId);
  const { serpData, isLoading: serpLoading } = useSerpData(store);

  return {
    store,
    products,
    analysisResults,
    setAnalysisResults,
    isLoading: storeLoading || productsLoading || analysisLoading,
    serpData,
    serpLoading,
    setProducts
  };
}

export type { ShopifyProductsResponse } from './shopify/useShopifyProducts';
