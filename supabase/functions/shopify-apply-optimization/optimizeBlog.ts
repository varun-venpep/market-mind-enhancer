import { Store, Optimization, OptimizeResult } from './types.ts';

export async function optimizeBlog(store: Store, optimization: Optimization): Promise<OptimizeResult> {
  if (optimization.field === 'articles') {
    // Special case - creating a blog article
    // First, get blogs to find the ID
    const getBlogsUrl = `https://${store.store_url}/admin/api/2023-07/blogs.json`;
    
    const blogsResponse = await fetch(getBlogsUrl, {
      headers: {
        'X-Shopify-Access-Token': store.access_token,
        'Content-Type': 'application/json',
      },
    });
    
    if (!blogsResponse.ok) {
      throw new Error(`Failed to fetch blogs: ${blogsResponse.statusText}`);
    }
    
    const blogsData = await blogsResponse.json();
    
    if (!blogsData.blogs || blogsData.blogs.length === 0) {
      throw new Error('No blogs found');
    }
    
    // Use the first blog
    const blogId = blogsData.blogs[0].id;
    
    // Create a sample article
    const createArticleUrl = `https://${store.store_url}/admin/api/2023-07/blogs/${blogId}/articles.json`;
    
    const articleResponse = await fetch(createArticleUrl, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': store.access_token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        article: {
          title: "Welcome to our Store Blog",
          author: "Store Owner",
          tags: "welcome, introduction, news",
          body_html: "<p>Welcome to our store blog! Here we'll share updates, product information, and industry news.</p>",
          published: true
        }
      }),
    });
    
    if (!articleResponse.ok) {
      throw new Error(`Failed to create article: ${articleResponse.statusText}`);
    }
    
    const articleData = await articleResponse.json();
    
    return {
      success: true,
      entityId: articleData.article.id,
      entityType: 'article',
      field: 'title'
    };
  } else {
    // Regular blog field updates would go here
    throw new Error(`Unsupported blog field: ${optimization.field}`);
  }
}
