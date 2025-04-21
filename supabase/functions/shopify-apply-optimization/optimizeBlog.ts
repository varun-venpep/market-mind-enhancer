
import { Store, Optimization, OptimizeResult } from './types.ts';
import { fetchShopifyApi } from './shopifyApiUtils.ts';

export async function optimizeBlog(store: Store, optimization: Optimization): Promise<OptimizeResult> {
  if (optimization.field === 'articles') {
    // Get blogs to find the ID
    const { blogs } = await fetchShopifyApi({
      url: `https://${store.store_url}/admin/api/2023-07/blogs.json`,
      token: store.access_token
    });
    if (!blogs || blogs.length === 0) throw new Error('No blogs found');
    const blogId = blogs[0].id;

    // Create article
    const { article } = await fetchShopifyApi({
      url: `https://${store.store_url}/admin/api/2023-07/blogs/${blogId}/articles.json`,
      token: store.access_token,
      method: 'POST',
      body: {
        article: {
          title: "Welcome to our Store Blog",
          author: "Store Owner",
          tags: "welcome, introduction, news",
          body_html: "<p>Welcome to our store blog! Here we'll share updates, product information, and industry news.</p>",
          published: true
        }
      }
    });
    return { success: true, entityId: article.id, entityType: 'article', field: 'title' };
  }
  throw new Error(`Unsupported blog field: ${optimization.field}`);
}
