import { Store, Optimization, OptimizeResult } from './types.ts';

export async function optimizePage(store: Store, optimization: Optimization): Promise<OptimizeResult> {
  // Extract page ID from URL if applicable
  let pageId = optimization.affected_urls && optimization.affected_urls[0]
    ? optimization.affected_urls[0].split('/').pop()
    : null;
  
  if (!pageId) {
    throw new Error('Page ID could not be determined');
  }
  
  // Fetch the page first
  const getUrl = `https://${store.store_url}/admin/api/2023-07/pages/${pageId}.json`;
  const pageResponse = await fetch(getUrl, {
    headers: {
      'X-Shopify-Access-Token': store.access_token,
      'Content-Type': 'application/json',
    },
  });
  
  if (!pageResponse.ok) {
    throw new Error(`Failed to fetch page from Shopify: ${pageResponse.statusText}`);
  }
  
  const pageData = await pageResponse.json();
  const page = pageData.page;
  
  // Update the page
  const updateUrl = `https://${store.store_url}/admin/api/2023-07/pages/${pageId}.json`;
  
  const updatedPage = { ...page };
  updatedPage[optimization.field] = optimization.suggestion;
  
  const updateResponse = await fetch(updateUrl, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': store.access_token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ page: updatedPage }),
  });
  
  if (!updateResponse.ok) {
    throw new Error(`Failed to update page: ${updateResponse.statusText}`);
  }
  
  return {
    success: true,
    entityId: page.id,
    entityType: 'page',
    field: optimization.field
  };
}
