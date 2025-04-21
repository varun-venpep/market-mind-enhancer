import { Store, Optimization, OptimizeResult } from './types.ts';

export async function optimizeProduct(store: Store, optimization: Optimization): Promise<OptimizeResult> {
  console.log('Optimizing product with optimization:', { 
    field: optimization.field,
    affectedUrls: optimization.affected_urls 
  });
  
  // Extract product ID if it's in the form "products.123"
  let productId = optimization.entity === 'product' && optimization.affected_urls && optimization.affected_urls[0]
    ? optimization.affected_urls[0].split('/').pop()
    : null;
  
  if (!productId) {
    throw new Error('Product ID could not be determined from affected URLs');
  }
  
  console.log('Extracted product ID:', productId);
  
  try {
    // Check if productId is a number or gid://shopify/Product/ID format
    if (productId.includes('/')) {
      // Handle gid://shopify/Product/123456789 format
      productId = productId.split('/').pop();
    } else if (isNaN(Number(productId))) {
      // Handle product handles (strings)
      // Find the product by handle first
      const productsUrl = `https://${store.store_url}/admin/api/2023-07/products.json?handle=${productId}`;
      console.log('Looking up product by handle:', productsUrl);
      
      const productsResponse = await fetch(productsUrl, {
        headers: {
          'X-Shopify-Access-Token': store.access_token,
          'Content-Type': 'application/json',
        },
      });
      
      if (!productsResponse.ok) {
        const responseText = await productsResponse.text();
        console.error('Shopify API error response:', responseText);
        throw new Error(`Failed to fetch products from Shopify: ${productsResponse.statusText}`);
      }
      
      const productsData = await productsResponse.json();
      if (!productsData.products || productsData.products.length === 0) {
        throw new Error(`No product found with handle: ${productId}`);
      }
      
      // Use the numeric ID
      productId = productsData.products[0].id;
      console.log('Resolved product handle to ID:', productId);
    }
    
    // Fetch the product using numeric ID
    const getUrl = `https://${store.store_url}/admin/api/2023-07/products/${productId}.json`;
    console.log('Fetching product from Shopify:', getUrl);
    
    const productResponse = await fetch(getUrl, {
      headers: {
        'X-Shopify-Access-Token': store.access_token,
        'Content-Type': 'application/json',
      },
    });
    
    if (!productResponse.ok) {
      const responseText = await productResponse.text();
      console.error('Shopify API error response:', responseText);
      throw new Error(`Failed to fetch product from Shopify: ${productResponse.statusText} (${productResponse.status})`);
    }
    
    const productData = await productResponse.json();
    const product = productData.product;
    
    console.log('Successfully fetched product:', { id: product.id, title: product.title });
    
    // Update the product based on the field
    if (optimization.field.startsWith('metafields.')) {
      // Handle metafield updates
      const [_, namespace, key] = optimization.field.split('.');
      const metafieldUrl = `https://${store.store_url}/admin/api/2023-07/products/${productId}/metafields.json`;
      
      const metafieldResponse = await fetch(metafieldUrl, {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': store.access_token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metafield: {
            namespace,
            key,
            value: optimization.suggestion,
            value_type: 'string'
          }
        }),
      });
      
      if (!metafieldResponse.ok) {
        const responseText = await metafieldResponse.text();
        console.error('Metafield update error:', responseText);
        throw new Error(`Failed to update product metafield: ${metafieldResponse.statusText}`);
      }
      
      const metafieldData = await metafieldResponse.json();
      return {
        success: true,
        entityId: product.id,
        entityType: 'product',
        field: optimization.field,
        metafieldId: metafieldData.metafield.id
      };
    } else if (optimization.field.startsWith('images[')) {
      // Handle image updates
      const match = optimization.field.match(/images\[(\d+)\]\.(\w+)/);
      if (match) {
        const imageIndex = parseInt(match[1], 10);
        const imageProperty = match[2];
        const imageId = product.images[imageIndex]?.id;
        
        if (!imageId) {
          throw new Error(`Image not found at index ${imageIndex}`);
        }
        
        const imageUrl = `https://${store.store_url}/admin/api/2023-07/products/${productId}/images/${imageId}.json`;
        
        const imageResponse = await fetch(imageUrl, {
          method: 'PUT',
          headers: {
            'X-Shopify-Access-Token': store.access_token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: {
              id: imageId,
              [imageProperty]: optimization.suggestion
            }
          }),
        });
        
        if (!imageResponse.ok) {
          const responseText = await imageResponse.text();
          console.error('Image update error:', responseText);
          throw new Error(`Failed to update product image: ${imageResponse.statusText}`);
        }
        
        return {
          success: true,
          entityId: product.id,
          entityType: 'product',
          field: optimization.field,
          imageId
        };
      } else {
        throw new Error('Invalid image field format');
      }
    } else {
      // Handle regular product field updates
      const updateUrl = `https://${store.store_url}/admin/api/2023-07/products/${productId}.json`;
      
      const updatedProduct = { ...product };
      updatedProduct[optimization.field] = optimization.suggestion;
      
      console.log('Updating product with data:', {
        field: optimization.field,
        newValue: optimization.suggestion
      });
      
      const updateResponse = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'X-Shopify-Access-Token': store.access_token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product: updatedProduct }),
      });
      
      if (!updateResponse.ok) {
        const responseText = await updateResponse.text();
        console.error('Product update error:', responseText);
        throw new Error(`Failed to update product: ${updateResponse.statusText}`);
      }
      
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
