
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
    const { storeId } = await req.json();
    
    if (!storeId) {
      return new Response(JSON.stringify({ 
        error: 'Store ID is required' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

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

    // Fetch all essential data from the shop
    const shopData = await fetchShopData(store);
    
    // Analyze the collected data
    const auditResults = analyzeShop(shopData, store);
    
    // Store the audit results in the database
    await storeAuditResults(supabase, storeId, auditResults);
    
    return new Response(JSON.stringify(auditResults), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error performing site audit:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to perform site audit' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

// Fetches all essential data from the Shopify store
async function fetchShopData(store) {
  const shopData = {
    themes: [],
    products: [],
    pages: [],
    blogs: [],
    articles: [],
    shop: {}
  };
  
  // Fetch shop details
  const shopResponse = await fetch(`https://${store.store_url}/admin/api/2023-07/shop.json`, {
    headers: {
      'X-Shopify-Access-Token': store.access_token,
      'Content-Type': 'application/json',
    }
  });
  
  if (shopResponse.ok) {
    const shopDetails = await shopResponse.json();
    shopData.shop = shopDetails.shop;
  }
  
  // Fetch themes
  const themesResponse = await fetch(`https://${store.store_url}/admin/api/2023-07/themes.json`, {
    headers: {
      'X-Shopify-Access-Token': store.access_token,
      'Content-Type': 'application/json',
    }
  });
  
  if (themesResponse.ok) {
    const themesData = await themesResponse.json();
    shopData.themes = themesData.themes || [];
  }
  
  // Fetch products (first 50)
  const productsResponse = await fetch(`https://${store.store_url}/admin/api/2023-07/products.json?limit=50`, {
    headers: {
      'X-Shopify-Access-Token': store.access_token,
      'Content-Type': 'application/json',
    }
  });
  
  if (productsResponse.ok) {
    const productsData = await productsResponse.json();
    shopData.products = productsData.products || [];
  }
  
  // Fetch pages
  const pagesResponse = await fetch(`https://${store.store_url}/admin/api/2023-07/pages.json`, {
    headers: {
      'X-Shopify-Access-Token': store.access_token,
      'Content-Type': 'application/json',
    }
  });
  
  if (pagesResponse.ok) {
    const pagesData = await pagesResponse.json();
    shopData.pages = pagesData.pages || [];
  }
  
  // Fetch blogs
  const blogsResponse = await fetch(`https://${store.store_url}/admin/api/2023-07/blogs.json`, {
    headers: {
      'X-Shopify-Access-Token': store.access_token,
      'Content-Type': 'application/json',
    }
  });
  
  if (blogsResponse.ok) {
    const blogsData = await blogsResponse.json();
    shopData.blogs = blogsData.blogs || [];
    
    // Fetch articles for each blog
    if (shopData.blogs.length > 0) {
      for (const blog of shopData.blogs) {
        const articlesResponse = await fetch(`https://${store.store_url}/admin/api/2023-07/blogs/${blog.id}/articles.json?limit=50`, {
          headers: {
            'X-Shopify-Access-Token': store.access_token,
            'Content-Type': 'application/json',
          }
        });
        
        if (articlesResponse.ok) {
          const articlesData = await articlesResponse.json();
          shopData.articles = [...shopData.articles, ...(articlesData.articles || [])];
        }
      }
    }
  }
  
  return shopData;
}

// Analyzes the shop data and generates an audit report
function analyzeShop(shopData, store) {
  const issues = [];
  const optimizations = [];
  let score = 100;
  
  // Generate a unique ID for the audit
  const auditId = crypto.randomUUID();
  
  // Analyze shop settings
  if (!shopData.shop.domain || !shopData.shop.domain.includes(store.store_url)) {
    issues.push({
      id: crypto.randomUUID(),
      type: 'meta',
      severity: 'high',
      message: 'Store domain mismatch',
      details: 'The store domain does not match the registered URL. This may affect SEO indexing.',
      impact_score: 15
    });
    score -= 15;
  }
  
  // Meta title analysis for shop
  if (!shopData.shop.name || shopData.shop.name.length < 5) {
    issues.push({
      id: crypto.randomUUID(),
      type: 'meta',
      severity: 'high',
      message: 'Shop name is too short',
      details: 'Your store name is too short for proper SEO optimization.',
      impact_score: 10
    });
    score -= 10;
    
    optimizations.push({
      id: crypto.randomUUID(),
      type: 'meta',
      entity: 'shop',
      field: 'name',
      original: shopData.shop.name || '',
      suggestion: `${shopData.shop.name || 'Store'} - Premium Online Shop`,
      applied: false,
      impact_score: 10
    });
  }
  
  // Product analysis
  if (shopData.products.length > 0) {
    // Check for duplicate titles
    const productTitles = {};
    shopData.products.forEach(product => {
      if (productTitles[product.title]) {
        productTitles[product.title].count++;
        productTitles[product.title].ids.push(product.id);
      } else {
        productTitles[product.title] = { count: 1, ids: [product.id] };
      }
    });
    
    const duplicateTitles = Object.entries(productTitles)
      .filter(([_, value]) => value.count > 1)
      .map(([title, value]) => ({ title, ids: value.ids }));
    
    if (duplicateTitles.length > 0) {
      issues.push({
        id: crypto.randomUUID(),
        type: 'content',
        severity: 'medium',
        message: `${duplicateTitles.length} products have duplicate titles`,
        details: 'Products with duplicate titles compete against each other in search results.',
        affected_urls: duplicateTitles.map(dt => `${shopData.shop.domain}/products/${shopData.products.find(p => p.id === dt.ids[0])?.handle}`).filter(Boolean),
        impact_score: 8
      });
      score -= duplicateTitles.length * 2;
      
      // Generate optimization suggestions for duplicate titles
      duplicateTitles.forEach(dt => {
        dt.ids.forEach((id, index) => {
          if (index > 0) { // Skip the first one, suggest changes for duplicates
            const product = shopData.products.find(p => p.id === id);
            if (product) {
              optimizations.push({
                id: crypto.randomUUID(),
                type: 'content',
                entity: 'product',
                field: 'title',
                original: product.title,
                suggestion: `${product.title} - ${product.vendor || 'Premium'} ${product.product_type || 'Item'}`,
                applied: false,
                impact_score: 8,
                affected_urls: [`${shopData.shop.domain}/products/${product.handle}`]
              });
            }
          }
        });
      });
    }
    
    // Check for missing meta descriptions through metafields
    const productsWithoutMetaDesc = shopData.products.filter(product => {
      return !product.metafields || !product.metafields.some(meta => 
        meta.namespace === 'global' && meta.key === 'description_tag'
      );
    });
    
    if (productsWithoutMetaDesc.length > 0) {
      issues.push({
        id: crypto.randomUUID(),
        type: 'meta',
        severity: 'high',
        message: `${productsWithoutMetaDesc.length} products missing meta descriptions`,
        details: 'Meta descriptions are crucial for SEO as they appear in search results.',
        affected_urls: productsWithoutMetaDesc.map(p => `${shopData.shop.domain}/products/${p.handle}`),
        impact_score: 12
      });
      score -= Math.min(20, productsWithoutMetaDesc.length * 1.5);
      
      // Generate optimization suggestions
      productsWithoutMetaDesc.forEach(product => {
        optimizations.push({
          id: crypto.randomUUID(),
          type: 'meta',
          entity: 'product',
          field: 'metafields.global.description_tag',
          original: '',
          suggestion: `Shop ${product.title} - ${product.product_type || 'Premium product'} by ${product.vendor || store.store_name || 'us'}. ${product.body_html ? (product.body_html.replace(/<[^>]*>/g, '').substring(0, 100) + '...') : 'High quality product with exclusive features.'}`,
          applied: false,
          impact_score: 12,
          affected_urls: [`${shopData.shop.domain}/products/${product.handle}`]
        });
      });
    }
    
    // Check for product images without alt text
    const productsWithImagesMissingAlt = shopData.products.filter(product => {
      return product.images && product.images.some(img => !img.alt || img.alt.trim() === '');
    });
    
    if (productsWithImagesMissingAlt.length > 0) {
      issues.push({
        id: crypto.randomUUID(),
        type: 'content',
        severity: 'medium',
        message: `${productsWithImagesMissingAlt.length} products have images missing alt text`,
        details: 'Image alt text is important for accessibility and SEO.',
        affected_urls: productsWithImagesMissingAlt.map(p => `${shopData.shop.domain}/products/${p.handle}`),
        impact_score: 8
      });
      score -= Math.min(15, productsWithImagesMissingAlt.length);
      
      // Generate optimization suggestions
      productsWithImagesMissingAlt.forEach(product => {
        product.images.forEach((img, index) => {
          if (!img.alt || img.alt.trim() === '') {
            optimizations.push({
              id: crypto.randomUUID(),
              type: 'content',
              entity: 'product',
              field: `images[${index}].alt`,
              original: img.alt || '',
              suggestion: `${product.title} - ${product.product_type || 'Product'} image ${index + 1}`,
              applied: false,
              impact_score: 8,
              affected_urls: [`${shopData.shop.domain}/products/${product.handle}`]
            });
          }
        });
      });
    }
  } else {
    issues.push({
      id: crypto.randomUUID(),
      type: 'content',
      severity: 'high',
      message: 'No products found',
      details: 'Your store has no products, which is essential for an e-commerce site.',
      impact_score: 20
    });
    score -= 20;
  }
  
  // Blog analysis
  if (shopData.blogs.length === 0) {
    issues.push({
      id: crypto.randomUUID(),
      type: 'content',
      severity: 'medium',
      message: 'No blog found',
      details: 'Having a blog can significantly improve SEO through fresh content and internal linking.',
      impact_score: 10
    });
    score -= 10;
    
    optimizations.push({
      id: crypto.randomUUID(),
      type: 'structure',
      entity: 'shop',
      field: 'blogs',
      original: 'No blogs',
      suggestion: 'Create a blog section with regular content related to your products and industry.',
      applied: false,
      impact_score: 10
    });
  } else if (shopData.articles.length < 5) {
    issues.push({
      id: crypto.randomUUID(),
      type: 'content',
      severity: 'low',
      message: 'Few blog articles',
      details: 'Having more blog articles increases your keyword coverage and improves search visibility.',
      impact_score: 5
    });
    score -= 5;
    
    optimizations.push({
      id: crypto.randomUUID(),
      type: 'content',
      entity: 'blog',
      field: 'articles',
      original: `${shopData.articles.length} articles`,
      suggestion: 'Add more blog articles targeting relevant keywords to increase organic traffic.',
      applied: false,
      impact_score: 5
    });
  }
  
  // Page analysis
  const homePage = shopData.pages.find(page => page.handle === 'home' || page.title.toLowerCase().includes('home'));
  if (!homePage) {
    issues.push({
      id: crypto.randomUUID(),
      type: 'structure',
      severity: 'medium',
      message: 'No dedicated home page found',
      details: 'A properly optimized home page is essential for establishing site structure and hierarchy.',
      impact_score: 8
    });
    score -= 8;
  }
  
  // Check for standard pages
  const essentialPages = ['about', 'contact', 'faq', 'terms', 'privacy'];
  const missingEssentialPages = essentialPages.filter(pageName => 
    !shopData.pages.some(page => 
      page.handle === pageName || 
      page.title.toLowerCase().includes(pageName)
    )
  );
  
  if (missingEssentialPages.length > 0) {
    issues.push({
      id: crypto.randomUUID(),
      type: 'structure',
      severity: 'low',
      message: `Missing essential pages: ${missingEssentialPages.join(', ')}`,
      details: 'Essential pages help establish site credibility and improve user experience.',
      impact_score: missingEssentialPages.length * 2
    });
    score -= missingEssentialPages.length * 2;
    
    optimizations.push({
      id: crypto.randomUUID(),
      type: 'structure',
      entity: 'shop',
      field: 'pages',
      original: `Missing: ${missingEssentialPages.join(', ')}`,
      suggestion: `Create these essential pages: ${missingEssentialPages.join(', ')}`,
      applied: false,
      impact_score: missingEssentialPages.length * 2
    });
  }
  
  // Ensure score is within 0-100
  score = Math.max(0, Math.min(100, score));
  
  return {
    id: auditId,
    store_id: store.id,
    created_at: new Date().toISOString(),
    score,
    issues,
    optimizations,
    meta: {
      pages_analyzed: shopData.pages.length + shopData.products.length + shopData.articles.length,
      product_pages: shopData.products.length,
      collection_pages: 0, // We didn't fetch collections in this example
      blog_pages: shopData.articles.length,
      other_pages: shopData.pages.length
    }
  };
}

// Store audit results in database
async function storeAuditResults(supabase, storeId, auditResults) {
  try {
    const { data, error } = await supabase
      .from('shopify_site_audits')
      .insert({
        store_id: storeId,
        audit_data: {
          issues: auditResults.issues,
          optimizations: auditResults.optimizations,
          meta: auditResults.meta
        },
        score: auditResults.score,
        created_at: new Date().toISOString(),
      });
      
    if (error) {
      console.error('Error storing audit results:', error);
    }
    
    return data;
  } catch (error) {
    console.error('Error storing audit results:', error);
    throw error;
  }
}
