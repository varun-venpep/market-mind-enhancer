
import { Store, Optimization, OptimizeResult } from './types.ts';
import { fetchShopifyApi, extractIdFromUrl, validateStoreCredentials } from './shopifyApiUtils.ts';

export async function optimizePage(store: Store, optimization: Optimization): Promise<OptimizeResult> {
  console.log('Starting page optimization for:', optimization);
  
  if (!validateStoreCredentials(store)) {
    return {
      success: false,
      error: 'Invalid store credentials',
      entityType: 'page'
    };
  }
  
  try {
    let pageId = (optimization.affected_urls && optimization.affected_urls[0])
      ? extractIdFromUrl(optimization.affected_urls[0])
      : null;
      
    if (!pageId) {
      console.error('Page ID could not be determined from:', optimization.affected_urls);
      throw new Error('Page ID could not be determined');
    }
    
    console.log(`Fetching page with ID ${pageId} from Shopify`);
    // Fetch the page
    const pageData = await fetchShopifyApi({
      url: `https://${store.store_url}/admin/api/2023-07/pages/${pageId}.json`,
      token: store.access_token
    });
    
    if (!pageData || !pageData.page) {
      throw new Error(`Failed to retrieve page data for ID: ${pageId}`);
    }
    
    const page = pageData.page;
    console.log(`Successfully retrieved page: ${page.title}`);
    
    // Update
    const updatedPage = { ...page, [optimization.field]: optimization.suggestion };
    console.log(`Updating page ${pageId} with new ${optimization.field}`);
    
    await fetchShopifyApi({
      url: `https://${store.store_url}/admin/api/2023-07/pages/${pageId}.json`,
      token: store.access_token,
      method: 'PUT',
      body: { page: updatedPage }
    });
    
    console.log(`Page optimization complete for ${pageId}`);
    return { 
      success: true, 
      entityId: page.id, 
      entityType: 'page', 
      field: optimization.field 
    };
  } catch (error) {
    console.error('Error optimizing page:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error during page optimization',
      entityType: 'page',
      field: optimization.field
    };
  }
}
