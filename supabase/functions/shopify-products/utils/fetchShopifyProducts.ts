
export async function fetchShopifyProductsFromShopify(store: any, page: number, limit: number) {
  try {
    // Fetch from Shopify API directly
    const apiUrl = `https://${store.store_url}/admin/api/2023-07/products.json`;
    const productsResponse = await fetch(apiUrl, {
      headers: {
        'X-Shopify-Access-Token': store.access_token,
        'Content-Type': 'application/json',
      },
    });

    // Check if response is ok
    if (!productsResponse.ok) {
      const status = productsResponse.status;
      const statusText = productsResponse.statusText;
      let responseText = "";
      
      try {
        responseText = await productsResponse.text();
      } catch (e) {
        // Ignore error in getting response text
      }
      
      return {
        error: `Failed to fetch products from Shopify (Status: ${status} ${statusText})`,
        details: responseText,
        products: [],
        page,
        limit,
        total: 0
      };
    }

    // Try to get response as text first
    const responseText = await productsResponse.text();
    
    if (!responseText || responseText.trim() === '') {
      return {
        error: 'Empty response from Shopify API',
        products: [],
        page,
        limit,
        total: 0
      };
    }

    // Parse JSON
    let productsData;
    try {
      productsData = JSON.parse(responseText);
    } catch (parseError: any) {
      return {
        error: 'Failed to parse Shopify API response',
        details: parseError?.message,
        products: [],
        page,
        limit,
        total: 0
      };
    }

    if (!productsData || !productsData.products) {
      return {
        error: 'Unexpected response format from Shopify API',
        products: [],
        page,
        limit,
        total: 0
      };
    }

    // Handle pagination
    const allProducts = productsData.products || [];
    const paginatedProducts = allProducts.slice((page - 1) * limit, page * limit);

    return {
      products: paginatedProducts,
      page,
      limit,
      total: allProducts.length,
    };
  } catch (error: any) {
    console.error("Exception in fetchShopifyProductsFromShopify:", error);
    return {
      error: error.message || 'An unknown error occurred fetching products',
      products: [],
      page,
      limit,
      total: 0
    };
  }
}
