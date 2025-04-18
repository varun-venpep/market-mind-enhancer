
import { useState, useEffect } from 'react';
import { fetchShopifyProducts } from '@/services/api';
import type { ShopifyProduct } from '@/types/shopify';

export interface ShopifyProductsResponse {
  products: ShopifyProduct[];
  status: string;
  message?: string;
}

export function useShopifyProducts(storeId: string | undefined) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!storeId) return;

    const fetchProducts = async () => {
      try {
        const productsData: ShopifyProductsResponse = await fetchShopifyProducts(storeId);
        setProducts(productsData.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [storeId]);

  return { products, setProducts, isLoading };
}
