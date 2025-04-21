
export async function fetchProduct(store, productId) {
  const apiUrl = `https://${store.store_url}/admin/api/2023-07/products/${productId}.json`;
  const productResponse = await fetch(apiUrl, {
    headers: {
      'X-Shopify-Access-Token': store.access_token,
      'Content-Type': 'application/json',
    },
  });

  if (!productResponse.ok) {
    throw new Error(`Failed to fetch product from Shopify: ${productResponse.statusText}`);
  }

  const productData = await productResponse.json();
  return productData.product;
}
