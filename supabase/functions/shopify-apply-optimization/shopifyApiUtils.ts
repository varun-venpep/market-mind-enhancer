
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
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Shopify API request failed: ${response.status} ${response.statusText} - ${errorText}`
    );
  }
  return response.json();
}

export function extractIdFromUrl(url: string): string | null {
  if (!url) return null;
  const segments = url.split('/');
  return segments[segments.length - 1] || null;
}
