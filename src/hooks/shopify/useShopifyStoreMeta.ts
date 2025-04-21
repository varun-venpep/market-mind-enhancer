
import { useEffect, useState } from "react";
import { supabase } from '@/integrations/supabase/client';
import { fetchShopifyProducts } from '@/services/shopify';
import type { ShopifyStore, ShopifyProduct, ShopifyProductsResponse } from '@/types/shopify';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

export function useShopifyStoreMeta(storeId: string | undefined) {
  const [store, setStore] = useState<ShopifyStore | null>(null);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { toast } = useToast();

  useEffect(() => {
    if (!storeId) return;

    const fetchMeta = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Check if user is authenticated
        const { data: session } = await supabase.auth.getSession();
        if (!session.session) {
          setError('Authentication required');
          setIsLoading(false);
          toast({
            title: "Authentication Required",
            description: "Please sign in to access your Shopify store",
            variant: "destructive"
          });
          navigate('/login');
          return;
        }

        // fetch store
        const { data: storeData, error: storeError } = await supabase
          .from('shopify_stores')
          .select('*')
          .eq('id', storeId)
          .maybeSingle();

        if (storeError) {
          setError(storeError.message);
          setIsLoading(false);
          toast({
            title: "Error",
            description: `Failed to load store: ${storeError.message}`,
            variant: "destructive"
          });
          return;
        }

        if (!storeData) {
          setError('Store not found');
          setIsLoading(false);
          toast({
            title: "Error",
            description: "Store not found",
            variant: "destructive"
          });
          return;
        }

        setStore(storeData as ShopifyStore);

        // fetch products
        try {
          const productsData: ShopifyProductsResponse = await fetchShopifyProducts(storeId);
          setProducts(productsData.products || []);
        } catch (error) {
          console.error("Error fetching products:", error);
          setProducts([]);
          toast({
            title: "Warning",
            description: "Could not load products. Please check your store connection.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error in fetchMeta:", error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : 'Failed to load store data',
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeta();
  }, [storeId, toast, navigate]);

  return { store, products, isLoading, error, setProducts };
}
