
import { Store, Optimization, OptimizeResult } from './types.ts';
import { fetchShopifyApi, extractIdFromUrl } from './shopifyApiUtils.ts';

export async function optimizePage(store: Store, optimization: Optimization): Promise<OptimizeResult> {
  let pageId = (optimization.affected_urls && optimization.affected_urls[0])
    ? extractIdFromUrl(optimization.affected_urls[0])
    : null;
  if (!pageId) throw new Error('Page ID could not be determined');
  // Fetch the page
  const { page } = await fetchShopifyApi({
    url: `https://${store.store_url}/admin/api/2023-07/pages/${pageId}.json`,
    token: store.access_token
  });
  // Update
  const updatedPage = { ...page, [optimization.field]: optimization.suggestion };
  await fetchShopifyApi({
    url: `https://${store.store_url}/admin/api/2023-07/pages/${pageId}.json`,
    token: store.access_token,
    method: 'PUT',
    body: { page: updatedPage }
  });
  return { success: true, entityId: page.id, entityType: 'page', field: optimization.field };
}
