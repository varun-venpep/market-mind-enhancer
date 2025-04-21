
import { useEffect, useState } from "react";
import { supabase } from '@/integrations/supabase/client';
import { fetchShopifyProducts } from '@/services/shopify';
import type { ShopifyStore, ShopifyProduct, ShopifyProductsResponse } from '@/types/shopify';
import { useToast } from "@/hooks/use-toast";

export function useShopifyStoreMeta(storeId: string | undefined) {
  const [store, setStore] = useState<ShopifyStore | null>(null);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (!storeId) return;

    const fetchMeta = async () => {
      setIsLoading(true);
      setError(null);

      // fetch store
      const { data: storeData, error: storeError } = await supabase
        .from('shopify_stores')
        .select('*')
        .eq('id', storeId)
        .maybeSingle();

      if (storeError) {
        setError(storeError.message);
        setIsLoading(false);
        return;
      }

      if (!storeData) {
        setError('Store not found');
        setIsLoading(false);
        return;
      }

      setStore(storeData as ShopifyStore);

      // fetch products
      try {
        const productsData: ShopifyProductsResponse = await fetchShopifyProducts(storeId);
        setProducts(productsData.products || []);
      } catch {
        setProducts([]);
        toast({
          title: "Warning",
          description: "Could not load products. Please check your store connection.",
          variant: "destructive"
        });
      }
      setIsLoading(false);
    };

    fetchMeta();
  }, [storeId, toast]);

  return { store, products, isLoading, error, setProducts };
}
