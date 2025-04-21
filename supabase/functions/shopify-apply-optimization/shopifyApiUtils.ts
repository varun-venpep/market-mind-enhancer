
export async function fetchShopifyApi({
  url,
  token,
  method = 'GET',
  body,
  extraHeaders = {},
}: {
  url: string;
  token: string;
  method?: string;
  body?: any;
  extraHeaders?: Record<string, string>;
}) {
  const headers: Record<string, string> = {
    'X-Shopify-Access-Token': token,
    'Content-Type': 'application/json',
    ...extraHeaders,
  };
  const options: RequestInit = {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  };
  
  console.log(`Making Shopify API request to: ${url}`);
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Shopify API error (${response.status}): ${errorText}`);
    throw new Error(
      `Shopify API request failed: ${response.status} ${response.statusText} - ${errorText}`
    );
  }
  
  const responseData = await response.json();
  console.log(`Shopify API response successful for: ${url}`);
  return responseData;
}

export function extractIdFromUrl(url: string): string | null {
  if (!url) return null;
  const segments = url.split('/');
  return segments[segments.length - 1] || null;
}

// Helper function to validate Shopify store credentials
export function validateStoreCredentials(store: any): boolean {
  if (!store || !store.store_url || !store.access_token) {
    console.error('Invalid store credentials:', { 
      hasStore: !!store, 
      hasUrl: store ? !!store.store_url : false, 
      hasToken: store ? !!store.access_token : false 
    });
    return false;
  }
  return true;
}
