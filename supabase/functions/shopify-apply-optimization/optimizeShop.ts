import { Store, Optimization, OptimizeResult } from './types.ts';

export async function optimizeShop(store: Store, optimization: Optimization): Promise<OptimizeResult> {
  const shopUrl = `https://${store.store_url}/admin/api/2023-07/shop.json`;
  
  // First get current shop data
  const shopResponse = await fetch(shopUrl, {
    headers: {
      'X-Shopify-Access-Token': store.access_token,
      'Content-Type': 'application/json',
    },
  });
  
  if (!shopResponse.ok) {
    throw new Error(`Failed to fetch shop data: ${shopResponse.statusText}`);
  }
  
  const shopData = await shopResponse.json();
  
  if (optimization.field === 'blogs') {
    // Special case - creating a blog
    const createBlogUrl = `https://${store.store_url}/admin/api/2023-07/blogs.json`;
    
    const blogResponse = await fetch(createBlogUrl, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': store.access_token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        blog: {
          title: "Store Blog",
          commentable: "moderate"
        }
      }),
    });
    
    if (!blogResponse.ok) {
      throw new Error(`Failed to create blog: ${blogResponse.statusText}`);
    }
    
    const blogData = await blogResponse.json();
    
    return {
      success: true,
      entityId: blogData.blog.id,
      entityType: 'blog',
      field: 'title'
    };
  } else if (optimization.field === 'pages') {
    // Creating essential pages
    const createPageUrl = `https://${store.store_url}/admin/api/2023-07/pages.json`;
    const suggestedPages = optimization.suggestion.replace('Create these essential pages: ', '').split(', ');
    
    // Create just the first missing page in this optimization
    const pageName = suggestedPages[0];
    
    const pageResponse = await fetch(createPageUrl, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': store.access_token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page: {
          title: pageName.charAt(0).toUpperCase() + pageName.slice(1),
          body_html: `<h1>${pageName.charAt(0).toUpperCase() + pageName.slice(1)}</h1><p>This is your ${pageName} page. Update this content to provide visitors with information about your store.</p>`,
          published: true
        }
      }),
    });
    
    if (!pageResponse.ok) {
      throw new Error(`Failed to create page: ${pageResponse.statusText}`);
    }
    
    const pageData = await pageResponse.json();
    
    return {
      success: true,
      entityId: pageData.page.id,
      entityType: 'page',
      field: 'title'
    };
  } else {
    // Update shop settings
    // Note: Most shop properties are not updatable via the API
    // This would typically require redirecting the user to the Shopify admin
    return {
      success: true,
      entityId: shopData.shop.id,
      entityType: 'shop',
      field: optimization.field,
      message: "Shop settings typically need to be updated in Shopify admin"
    };
  }
}
