
export async function fetchShopifyProductsFromShopify(store: any, page: number, limit: number) {
  // Fetch from Shopify API directly
  const apiUrl = `https://${store.store_url}/admin/api/2023-07/products.json`;
  const productsResponse = await fetch(apiUrl, {
    headers: {
      'X-Shopify-Access-Token': store.access_token,
      'Content-Type': 'application/json',
    },
  });

  let status = productsResponse.status;
  let statusText = productsResponse.statusText;
  let responseText: string;
  try {
    responseText = await productsResponse.text();
  } catch {
    responseText = "";
  }

  if (!productsResponse.ok) {
    return {
      error: `Failed to fetch products from Shopify (Status: ${status})`,
      details: responseText,
      products: [],
      page,
      limit,
      total: 0
    };
  }

  if (!responseText || responseText.trim() === '') {
    return {
      error: 'Empty response from Shopify API',
      products: [],
      page,
      limit,
      total: 0
    };
  }

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

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const allProducts = productsData.products || [];
  const paginatedProducts = allProducts.slice(startIndex, endIndex);

  return {
    products: paginatedProducts,
    page,
    limit,
    total: allProducts.length,
  };
}
