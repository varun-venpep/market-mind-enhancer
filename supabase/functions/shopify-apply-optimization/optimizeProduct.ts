
import { Store, Optimization, OptimizeResult } from './types.ts';
import { fetchShopifyApi, extractIdFromUrl } from './shopifyApiUtils.ts';

export async function optimizeProduct(store: Store, optimization: Optimization): Promise<OptimizeResult> {
  console.log('Optimizing product with optimization:', { field: optimization.field, affectedUrls: optimization.affected_urls });

  // Use helper to extract productId
  let productId = (optimization.entity === 'product' && optimization.affected_urls && optimization.affected_urls[0])
    ? extractIdFromUrl(optimization.affected_urls[0])
    : null;

  if (!productId) throw new Error('Product ID could not be determined from affected URLs');

  console.log('Extracted product ID:', productId);

  try {
    // Handle handle lookup, human-readable strings, and gid/number
    if (typeof productId === 'string' && isNaN(Number(productId))) {
      // Product handle lookup
      const { products } = await fetchShopifyApi({
        url: `https://${store.store_url}/admin/api/2023-07/products.json?handle=${productId}`,
        token: store.access_token
      });
      if (!products || products.length === 0) throw new Error(`No product found with handle: ${productId}`);
      productId = products[0].id;
      console.log('Resolved product handle to ID:', productId);
    }

    // Fetch product object
    const { product } = await fetchShopifyApi({
      url: `https://${store.store_url}/admin/api/2023-07/products/${productId}.json`,
      token: store.access_token
    });

    console.log('Successfully fetched product:', { id: product.id, title: product.title });

    // Field decides behavior
    if (optimization.field.startsWith('metafields.')) {
      const [ , namespace, key ] = optimization.field.split('.');
      const { metafield } = await fetchShopifyApi({
        url: `https://${store.store_url}/admin/api/2023-07/products/${productId}/metafields.json`,
        token: store.access_token,
        method: 'POST',
        body: {
          metafield: {
            namespace,
            key,
            value: optimization.suggestion,
            value_type: 'string'
          }
        }
      });
      return {
        success: true,
        entityId: product.id,
        entityType: 'product',
        field: optimization.field,
        metafieldId: metafield.id
      };
    } else if (optimization.field.startsWith('images[')) {
      // image update
      const match = optimization.field.match(/images\[(\d+)\]\.(\w+)/);
      if (!match) throw new Error('Invalid image field format');
      const imageIndex = parseInt(match[1], 10);
      const imageProperty = match[2];
      const imageId = product.images[imageIndex]?.id;
      if (!imageId) throw new Error(`Image not found at index ${imageIndex}`);
      await fetchShopifyApi({
        url: `https://${store.store_url}/admin/api/2023-07/products/${productId}/images/${imageId}.json`,
        token: store.access_token,
        method: 'PUT',
        body: { image: { id: imageId, [imageProperty]: optimization.suggestion } }
      });
      return {
        success: true,
        entityId: product.id,
        entityType: 'product',
        field: optimization.field,
        imageId
      };
    } else {
      // Regular product fields
      const updatedProduct = { ...product, [optimization.field]: optimization.suggestion };
      await fetchShopifyApi({
        url: `https://${store.store_url}/admin/api/2023-07/products/${productId}.json`,
        token: store.access_token,
        method: 'PUT',
        body: { product: updatedProduct }
      });
      return {
        success: true,
        entityId: product.id,
        entityType: 'product',
        field: optimization.field
      };
    }
  } catch (error) {
    console.error('Error in optimizeProduct:', error);
    throw error;
  }
}
