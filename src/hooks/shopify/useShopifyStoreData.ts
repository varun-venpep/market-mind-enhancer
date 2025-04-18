
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { ShopifyStore } from '@/types/shopify';

export function useShopifyStoreData(storeId: string | undefined) {
  const [store, setStore] = useState<ShopifyStore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!storeId) return;

    const fetchStoreData = async () => {
      try {
        const { data: storeData, error: storeError } = await supabase
          .from('shopify_stores')
          .select('*')
          .eq('id', storeId)
          .single();
          
        if (storeError) throw storeError;
        
        setStore(storeData as ShopifyStore);
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

  return { store, isLoading };
}
