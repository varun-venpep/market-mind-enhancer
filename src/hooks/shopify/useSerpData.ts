
import { useState, useEffect } from 'react';
import { fetchSerpResults, extractSerpData } from '@/services/serpApi';
import type { ShopifyStore } from '@/types/shopify';

export function useSerpData(store: ShopifyStore | null) {
  const [serpData, setSerpData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!store?.store_name) return;

    const fetchData = async () => {
      try {
        const keyword = `${store.store_name.toLowerCase()} products`;
        const serpResult = await fetchSerpResults(keyword);
        const extractedData = extractSerpData(serpResult);
        setSerpData(extractedData);
      } catch (error) {
        console.error("Error fetching SERP data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [store?.store_name]);

  return { serpData, isLoading };
}
