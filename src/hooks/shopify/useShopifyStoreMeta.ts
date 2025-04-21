
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check authentication first, before doing anything else
    const checkAuth = async () => {
      try {
        const { data, error: authError } = await supabase.auth.getSession();
        
        if (authError) {
          console.error("Authentication error:", authError);
          setIsAuthenticated(false);
          setError(`Authentication error: ${authError.message}`);
          return false;
        }
        
        if (!data.session) {
          console.log("No active session");
          setIsAuthenticated(false);
          setError("Authentication required. Please sign in.");
          return false;
        }
        
        setIsAuthenticated(true);
        return true;
      } catch (err) {
        console.error("Error checking authentication:", err);
        setIsAuthenticated(false);
        setError("Error checking authentication");
        return false;
      }
    };

    const fetchMeta = async () => {
      if (!storeId) {
        setIsLoading(false);
        setError("No store ID provided");
        return;
      }

      setIsLoading(true);
      setError(null);

      // First check authentication
      const isAuthed = await checkAuth();
      if (!isAuthed) {
        setIsLoading(false);
        toast({
          title: "Authentication Required",
          description: "Please sign in to access your Shopify store",
          variant: "destructive"
        });
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      try {
        // Fetch store data
        const { data: storeData, error: storeError } = await supabase
          .from('shopify_stores')
          .select('*')
          .eq('id', storeId)
          .maybeSingle();

        if (storeError) {
          setError(`Failed to load store: ${storeError.message}`);
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

        console.log("Store data loaded successfully:", storeData.store_name);
        setStore(storeData as ShopifyStore);

        // Fetch products with better error handling
        try {
          console.log("Fetching products for store:", storeId);
          const productsData: ShopifyProductsResponse = await fetchShopifyProducts(storeId);
          
          if (productsData.error) {
            console.warn("Products API returned an error:", productsData.error);
            toast({
              title: "Warning",
              description: `Could not load products: ${productsData.error}`,
              variant: "destructive"
            });
            setProducts([]);
          } else if (!productsData.products || productsData.products.length === 0) {
            console.log("No products found for store");
            setProducts([]);
            toast({
              title: "Information",
              description: "No products found for this store",
              variant: "default"
            });
          } else {
            console.log(`Loaded ${productsData.products.length} products`);
            setProducts(productsData.products);
          }
        } catch (productError) {
          console.error("Error fetching products:", productError);
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

  return { 
    store, 
    products, 
    isLoading, 
    error, 
    isAuthenticated,
    setProducts 
  };
}
