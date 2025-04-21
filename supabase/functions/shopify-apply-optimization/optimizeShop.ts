import { Store, Optimization, OptimizeResult } from './types.ts';
import { fetchShopifyApi } from './shopifyApiUtils.ts';

export async function optimizeShop(store: Store, optimization: Optimization): Promise<OptimizeResult> {
  const shopUrl = `https://${store.store_url}/admin/api/2023-07/shop.json`;
  const { shop } = await fetchShopifyApi({ url: shopUrl, token: store.access_token });

  if (optimization.field === 'blogs') {
    const { blog } = await fetchShopifyApi({
      url: `https://${store.store_url}/admin/api/2023-07/blogs.json`,
      token: store.access_token,
      method: 'POST',
      body: { blog: { title: "Store Blog", commentable: "moderate" } }
    });
    return { success: true, entityId: blog.id, entityType: 'blog', field: 'title' };
  } else if (optimization.field === 'pages') {
    const suggestedPages = optimization.suggestion.replace('Create these essential pages: ', '').split(', ');
    const pageName = suggestedPages[0];
    const { page } = await fetchShopifyApi({
      url: `https://${store.store_url}/admin/api/2023-07/pages.json`,
      token: store.access_token,
      method: 'POST',
      body: {
        page: {
          title: pageName.charAt(0).toUpperCase() + pageName.slice(1),
          body_html: `<h1>${pageName.charAt(0).toUpperCase() + pageName.slice(1)}</h1><p>This is your ${pageName} page. Update this content to provide visitors with information about your store.</p>`,
          published: true
        }
      }
    });
    return { success: true, entityId: page.id, entityType: 'page', field: 'title' };
  } else {
    // Not settable API fields
    return { success: true, entityId: shop.id, entityType: 'shop', field: optimization.field, message: "Shop settings typically need to be updated in Shopify admin" };
  }
}
