
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    const { storeId, optimization } = await req.json();
    
    if (!storeId || !optimization) {
      return new Response(JSON.stringify({ 
        error: 'Store ID and optimization details are required' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    console.log('Processing optimization request:', { 
      storeId, 
      optimizationType: optimization.type,
      entity: optimization.entity,
      field: optimization.field
    });

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get the user ID from the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }
    
    // Get the user ID from the token
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );
    
    if (userError || !user) {
      return new Response(JSON.stringify({ 
        error: 'Failed to authenticate user' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }
    
    // Get the store details
    const { data: store, error: storeError } = await supabase
      .from('shopify_stores')
      .select('*')
      .eq('id', storeId)
      .single();
    
    if (storeError) {
      return new Response(JSON.stringify({ 
        error: 'Store not found' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }
    
    // Validate store credentials
    if (!store.store_url || !store.access_token) {
      return new Response(JSON.stringify({ 
        error: 'Store missing required credentials' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    
    console.log('Found store:', { url: store.store_url });
    
    // Apply the optimization based on the entity type
    let result;
    
    try {
      switch (optimization.entity) {
        case 'product':
          result = await optimizeProduct(store, optimization);
          break;
        case 'shop':
          result = await optimizeShop(store, optimization);
          break;
        case 'blog':
          result = await optimizeBlog(store, optimization);
          break;
        case 'page':
          result = await optimizePage(store, optimization);
          break;
        case 'theme':
          result = await optimizeTheme(store, optimization);
          break;
        default:
          throw new Error(`Unsupported entity type: ${optimization.entity}`);
      }
    } catch (error) {
      console.error('Error in optimization process:', error);
      return new Response(JSON.stringify({ 
        error: error.message || 'Failed to apply optimization'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }
    
    if (!result.success) {
      return new Response(JSON.stringify({
        error: result.error || 'Failed to apply optimization'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }
    
    // Record the optimization in the history
    let optimizationHistoryId;
    try {
      optimizationHistoryId = await recordOptimizationHistory(
        supabase,
        storeId,
        result.entityId,
        result.entityType,
        optimization.field,
        optimization.original,
        optimization.suggestion,
        user.id
      );
    } catch (error) {
      console.error('Error recording optimization history:', error);
      // Continue even if history recording fails
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: "Optimization successfully applied",
      optimizationHistoryId,
      ...result
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error applying optimization:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to apply optimization' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

// Function to optimize a product
async function optimizeProduct(store, optimization) {
  console.log('Optimizing product with optimization:', { 
    field: optimization.field,
    affectedUrls: optimization.affected_urls 
  });
  
  // Extract product ID if it's in the form "products.123"
  let productId = optimization.entity === 'product' && optimization.affected_urls && optimization.affected_urls[0]
    ? optimization.affected_urls[0].split('/').pop()
    : null;
  
  if (!productId) {
    throw new Error('Product ID could not be determined from affected URLs');
  }
  
  console.log('Extracted product ID:', productId);
  
  try {
    // Check if productId is a number or gid://shopify/Product/ID format
    if (productId.includes('/')) {
      // Handle gid://shopify/Product/123456789 format
      productId = productId.split('/').pop();
    } else if (isNaN(Number(productId))) {
      // Handle product handles (strings)
      // Find the product by handle first
      const productsUrl = `https://${store.store_url}/admin/api/2023-07/products.json?handle=${productId}`;
      console.log('Looking up product by handle:', productsUrl);
      
      const productsResponse = await fetch(productsUrl, {
        headers: {
          'X-Shopify-Access-Token': store.access_token,
          'Content-Type': 'application/json',
        },
      });
      
      if (!productsResponse.ok) {
        const responseText = await productsResponse.text();
        console.error('Shopify API error response:', responseText);
        throw new Error(`Failed to fetch products from Shopify: ${productsResponse.statusText}`);
      }
      
      const productsData = await productsResponse.json();
      if (!productsData.products || productsData.products.length === 0) {
        throw new Error(`No product found with handle: ${productId}`);
      }
      
      // Use the numeric ID
      productId = productsData.products[0].id;
      console.log('Resolved product handle to ID:', productId);
    }
    
    // Fetch the product using numeric ID
    const getUrl = `https://${store.store_url}/admin/api/2023-07/products/${productId}.json`;
    console.log('Fetching product from Shopify:', getUrl);
    
    const productResponse = await fetch(getUrl, {
      headers: {
        'X-Shopify-Access-Token': store.access_token,
        'Content-Type': 'application/json',
      },
    });
    
    if (!productResponse.ok) {
      const responseText = await productResponse.text();
      console.error('Shopify API error response:', responseText);
      throw new Error(`Failed to fetch product from Shopify: ${productResponse.statusText} (${productResponse.status})`);
    }
    
    const productData = await productResponse.json();
    const product = productData.product;
    
    console.log('Successfully fetched product:', { id: product.id, title: product.title });
    
    // Update the product based on the field
    if (optimization.field.startsWith('metafields.')) {
      // Handle metafield updates
      const [_, namespace, key] = optimization.field.split('.');
      const metafieldUrl = `https://${store.store_url}/admin/api/2023-07/products/${productId}/metafields.json`;
      
      const metafieldResponse = await fetch(metafieldUrl, {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': store.access_token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metafield: {
            namespace,
            key,
            value: optimization.suggestion,
            value_type: 'string'
          }
        }),
      });
      
      if (!metafieldResponse.ok) {
        const responseText = await metafieldResponse.text();
        console.error('Metafield update error:', responseText);
        throw new Error(`Failed to update product metafield: ${metafieldResponse.statusText}`);
      }
      
      const metafieldData = await metafieldResponse.json();
      return {
        success: true,
        entityId: product.id,
        entityType: 'product',
        field: optimization.field,
        metafieldId: metafieldData.metafield.id
      };
    } else if (optimization.field.startsWith('images[')) {
      // Handle image updates
      const match = optimization.field.match(/images\[(\d+)\]\.(\w+)/);
      if (match) {
        const imageIndex = parseInt(match[1], 10);
        const imageProperty = match[2];
        const imageId = product.images[imageIndex]?.id;
        
        if (!imageId) {
          throw new Error(`Image not found at index ${imageIndex}`);
        }
        
        const imageUrl = `https://${store.store_url}/admin/api/2023-07/products/${productId}/images/${imageId}.json`;
        
        const imageResponse = await fetch(imageUrl, {
          method: 'PUT',
          headers: {
            'X-Shopify-Access-Token': store.access_token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            image: {
              id: imageId,
              [imageProperty]: optimization.suggestion
            }
          }),
        });
        
        if (!imageResponse.ok) {
          const responseText = await imageResponse.text();
          console.error('Image update error:', responseText);
          throw new Error(`Failed to update product image: ${imageResponse.statusText}`);
        }
        
        return {
          success: true,
          entityId: product.id,
          entityType: 'product',
          field: optimization.field,
          imageId
        };
      } else {
        throw new Error('Invalid image field format');
      }
    } else {
      // Handle regular product field updates
      const updateUrl = `https://${store.store_url}/admin/api/2023-07/products/${productId}.json`;
      
      const updatedProduct = { ...product };
      updatedProduct[optimization.field] = optimization.suggestion;
      
      console.log('Updating product with data:', {
        field: optimization.field,
        newValue: optimization.suggestion
      });
      
      const updateResponse = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'X-Shopify-Access-Token': store.access_token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product: updatedProduct }),
      });
      
      if (!updateResponse.ok) {
        const responseText = await updateResponse.text();
        console.error('Product update error:', responseText);
        throw new Error(`Failed to update product: ${updateResponse.statusText}`);
      }
      
      return {
        success: true,
        entityId: product.id,
        entityType: 'product',
        field: optimization.field
      };
    }
  } catch (error) {
    console.error('Error in optimizeProduct:', error);
    throw error;
  }
}

// Function to optimize shop settings
async function optimizeShop(store, optimization) {
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

// Function to optimize a blog
async function optimizeBlog(store, optimization) {
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

// Function to optimize a page
async function optimizePage(store, optimization) {
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

// Function to optimize theme settings
async function optimizeTheme(store, optimization) {
  // For theme optimizations, we would typically need to modify theme assets
  // This is more complex and may involve redirecting the user to Shopify admin
  return {
    success: true,
    entityId: 'theme',
    entityType: 'theme',
    field: optimization.field,
    message: "Theme optimizations typically need to be done in Shopify admin"
  };
}

// Record the optimization in history
async function recordOptimizationHistory(
  supabase,
  storeId,
  entityId,
  entityType,
  field,
  originalValue,
  newValue,
  userId
) {
  try {
    const { data, error } = await supabase
      .from('shopify_optimization_history')
      .insert({
        store_id: storeId,
        entity_id: entityId.toString(),
        entity_type: entityType,
        field: field,
        original_value: originalValue,
        new_value: newValue,
        applied_at: new Date().toISOString(),
        applied_by: userId,
        optimization_type: field.includes('meta') ? 'metadata' : 'content'
      })
      .select('id')
      .single();
      
    if (error) {
      console.error('Error recording optimization history:', error);
      throw error;
    }
    
    return data.id;
  } catch (error) {
    console.error('Error recording optimization history:', error);
    throw error;
  }
}
