
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

    // Fetch store theme data from Shopify
    const themeResponse = await fetch(`https://${store.store_url}/admin/api/2023-07/themes.json`, {
      headers: {
        'X-Shopify-Access-Token': store.access_token,
        'Content-Type': 'application/json',
      },
    });
    
    if (!themeResponse.ok) {
      console.error(`Shopify API error: ${themeResponse.status} ${themeResponse.statusText}`);
      throw new Error(`Failed to fetch store themes: ${themeResponse.statusText}`);
    }
    
    const themesData = await themeResponse.json();
    const mainTheme = themesData.themes.find(theme => theme.role === 'main');
    
    if (!mainTheme) {
      return new Response(JSON.stringify({ 
        error: 'No main theme found' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    // Fetch store pages
    const pagesResponse = await fetch(`https://${store.store_url}/admin/api/2023-07/pages.json`, {
      headers: {
        'X-Shopify-Access-Token': store.access_token,
        'Content-Type': 'application/json',
      },
    });
    
    if (!pagesResponse.ok) {
      console.error(`Shopify API error: ${pagesResponse.status} ${pagesResponse.statusText}`);
      throw new Error(`Failed to fetch store pages: ${pagesResponse.statusText}`);
    }
    
    const pagesData = await pagesResponse.json();
    
    // Fetch store blogs
    const blogsResponse = await fetch(`https://${store.store_url}/admin/api/2023-07/blogs.json`, {
      headers: {
        'X-Shopify-Access-Token': store.access_token,
        'Content-Type': 'application/json',
      },
    });
    
    if (!blogsResponse.ok) {
      console.error(`Shopify API error: ${blogsResponse.status} ${blogsResponse.statusText}`);
      throw new Error(`Failed to fetch store blogs: ${blogsResponse.statusText}`);
    }
    
    const blogsData = await blogsResponse.json();
    
    // Get shop details for base information
    const shopResponse = await fetch(`https://${store.store_url}/admin/api/2023-07/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': store.access_token,
        'Content-Type': 'application/json',
      },
    });
    
    if (!shopResponse.ok) {
      console.error(`Shopify API error: ${shopResponse.status} ${shopResponse.statusText}`);
      throw new Error(`Failed to fetch shop details: ${shopResponse.statusText}`);
    }
    
    const shopData = await shopResponse.json();
    
    // Analyze the store structure and identify SEO issues
    const shopDetails = shopData.shop;
    const issues = [];
    const optimizations = [];
    let score = 100;
    
    // Check title and meta description
    if (!shopDetails.name || shopDetails.name.length < 5) {
      issues.push({
        type: 'title',
        location: 'store',
        severity: 'high',
        message: 'Store name is too short or missing',
        details: 'Your store name should be descriptive and contain relevant keywords'
      });
      score -= 10;
      optimizations.push({
        type: 'title',
        location: 'store',
        field: 'name',
        original: shopDetails.name || '',
        suggestion: shopDetails.name ? `${shopDetails.name} - Premium Online Store` : 'Premium Online Store with Quality Products',
        applied: false,
        entity_id: 'shop'
      });
    }
    
    if (!shopDetails.meta_description || shopDetails.meta_description.length < 50) {
      issues.push({
        type: 'description',
        location: 'store',
        severity: 'high',
        message: 'Store meta description is too short or missing',
        details: 'Meta descriptions help search engines understand your site content and appear in search results'
      });
      score -= 15;
      optimizations.push({
        type: 'description',
        location: 'store',
        field: 'meta_description',
        original: shopDetails.meta_description || '',
        suggestion: shopDetails.meta_description ? 
          shopDetails.meta_description : 
          `${shopDetails.name || 'Our store'} offers premium products with fast shipping and excellent customer service. Shop now for the best deals.`,
        applied: false,
        entity_id: 'shop'
      });
    }
    
    // Check pages for SEO issues
    pagesData.pages.forEach(page => {
      if (!page.title || page.title.length < 5) {
        issues.push({
          type: 'title',
          location: 'page',
          entity_id: page.id,
          entity_name: page.title || 'Untitled Page',
          severity: 'medium',
          message: `Page title is too short or missing: ${page.title || 'Untitled Page'}`,
          details: 'Page titles are crucial for SEO and should be descriptive and contain relevant keywords'
        });
        score -= 5;
        optimizations.push({
          type: 'title',
          location: 'page',
          field: 'title',
          original: page.title || '',
          suggestion: page.title ? 
            `${page.title} | ${shopDetails.name}` : 
            `About Our Store | ${shopDetails.name}`,
          applied: false,
          entity_id: page.id
        });
      }
      
      if (!page.body_html || page.body_html.length < 100) {
        issues.push({
          type: 'content',
          location: 'page',
          entity_id: page.id,
          entity_name: page.title || 'Untitled Page',
          severity: 'medium',
          message: `Page content is too short or missing: ${page.title || 'Untitled Page'}`,
          details: 'Pages with thin content may not rank well in search engines'
        });
        score -= 5;
        optimizations.push({
          type: 'content',
          location: 'page',
          field: 'body_html',
          original: page.body_html || '',
          suggestion: page.body_html ? 
            page.body_html : 
            `<h1>Welcome to our page</h1><p>This page provides important information about our store and products. We are committed to quality and customer satisfaction.</p>`,
          applied: false,
          entity_id: page.id
        });
      }
      
      if (!page.handle || page.handle.includes('copy-of')) {
        issues.push({
          type: 'url',
          location: 'page',
          entity_id: page.id,
          entity_name: page.title || 'Untitled Page',
          severity: 'medium',
          message: `Page URL could be improved: ${page.handle}`,
          details: 'Descriptive URLs help with SEO and user experience'
        });
        score -= 3;
        optimizations.push({
          type: 'url',
          location: 'page',
          field: 'handle',
          original: page.handle || '',
          suggestion: page.title ? 
            page.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '').replace(/^-/, '') : 
            'about-our-store',
          applied: false,
          entity_id: page.id
        });
      }
    });
    
    // Check blogs for SEO issues
    blogsData.blogs.forEach(blog => {
      if (!blog.title || blog.title.length < 5) {
        issues.push({
          type: 'title',
          location: 'blog',
          entity_id: blog.id,
          entity_name: blog.title || 'Untitled Blog',
          severity: 'medium',
          message: `Blog title is too short or missing: ${blog.title || 'Untitled Blog'}`,
          details: 'Blog titles are crucial for SEO and should be descriptive and contain relevant keywords'
        });
        score -= 5;
        optimizations.push({
          type: 'title',
          location: 'blog',
          field: 'title',
          original: blog.title || '',
          suggestion: blog.title ? 
            `${blog.title} | ${shopDetails.name}` : 
            `News & Updates | ${shopDetails.name}`,
          applied: false,
          entity_id: blog.id
        });
      }
      
      if (!blog.handle || blog.handle.includes('copy-of')) {
        issues.push({
          type: 'url',
          location: 'blog',
          entity_id: blog.id,
          entity_name: blog.title || 'Untitled Blog',
          severity: 'medium',
          message: `Blog URL could be improved: ${blog.handle}`,
          details: 'Descriptive URLs help with SEO and user experience'
        });
        score -= 3;
        optimizations.push({
          type: 'url',
          location: 'blog',
          field: 'handle',
          original: blog.handle || '',
          suggestion: blog.title ? 
            blog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '').replace(/^-/, '') : 
            'news-and-updates',
          applied: false,
          entity_id: blog.id
        });
      }
    });
    
    // Check site-wide SEO issues
    if (!mainTheme || !mainTheme.name) {
      issues.push({
        type: 'theme',
        location: 'store',
        severity: 'low',
        message: 'Theme details are missing or incomplete',
        details: 'Having a well-structured theme helps with SEO and user experience'
      });
      score -= 2;
    }
    
    // Check for robots.txt
    try {
      const robotsResponse = await fetch(`https://${store.store_url}/robots.txt`);
      if (!robotsResponse.ok) {
        issues.push({
          type: 'technical',
          location: 'store',
          severity: 'medium',
          message: 'No robots.txt file found or it returns an error',
          details: 'A robots.txt file helps search engines navigate your site properly'
        });
        score -= 8;
        optimizations.push({
          type: 'technical',
          location: 'store',
          field: 'robots_txt',
          original: 'Missing or error',
          suggestion: `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /cart\nDisallow: /orders\nDisallow: /checkout\nSitemap: https://${store.store_url}/sitemap.xml`,
          applied: false,
          entity_id: 'robots'
        });
      }
    } catch (error) {
      console.error('Error checking robots.txt:', error);
      // Don't add an issue here since it might just be an error in our check
    }
    
    // Check for sitemap
    try {
      const sitemapResponse = await fetch(`https://${store.store_url}/sitemap.xml`);
      if (!sitemapResponse.ok) {
        issues.push({
          type: 'technical',
          location: 'store',
          severity: 'medium',
          message: 'No sitemap.xml file found or it returns an error',
          details: 'A sitemap helps search engines discover and index all your pages'
        });
        score -= 8;
        optimizations.push({
          type: 'technical',
          location: 'store',
          field: 'sitemap',
          original: 'Missing or error',
          suggestion: 'Enable sitemap generation in your Shopify store settings',
          applied: false,
          entity_id: 'sitemap'
        });
      }
    } catch (error) {
      console.error('Error checking sitemap.xml:', error);
      // Don't add an issue here since it might just be an error in our check
    }
    
    // Check for canonical URLs (do a sample check on the home page)
    try {
      const homePageResponse = await fetch(`https://${store.store_url}`);
      if (homePageResponse.ok) {
        const text = await homePageResponse.text();
        if (!text.includes('<link rel="canonical"')) {
          issues.push({
            type: 'technical',
            location: 'store',
            severity: 'medium',
            message: 'No canonical URL tags found on the home page',
            details: 'Canonical tags prevent duplicate content issues and help with SEO'
          });
          score -= 8;
        }
      }
    } catch (error) {
      console.error('Error checking for canonical URLs:', error);
      // Don't add an issue here since it might just be an error in our check
    }
    
    // Ensure score is within 0-100
    score = Math.max(0, Math.min(100, score));

    // Create the audit result object
    const auditResult = {
      store_id: storeId,
      store_url: store.store_url,
      store_name: shopDetails.name,
      theme: mainTheme ? mainTheme.name : 'Unknown',
      pages_count: pagesData.pages.length,
      blogs_count: blogsData.blogs.length,
      issues,
      score,
      optimizations,
      created_at: new Date().toISOString()
    };

    // Store the audit in the database
    const { data: savedAudit, error: auditError } = await supabase
      .from('shopify_site_audits')
      .upsert({
        store_id: storeId,
        audit_data: auditResult,
        created_at: new Date().toISOString(),
        score: score
      })
      .select()
      .single();
      
    if (auditError) {
      console.error('Error saving audit to database:', auditError);
      // Continue anyway as we can still return the result
    }

    return new Response(JSON.stringify(auditResult), {
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
