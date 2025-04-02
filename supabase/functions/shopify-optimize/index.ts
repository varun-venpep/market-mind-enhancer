
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
    const { storeId, productId, optimizations } = await req.json();
    
    if (!storeId || !productId || !optimizations) {
      return new Response(JSON.stringify({ 
        error: 'Store ID, Product ID, and optimizations are required' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
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
    
    // Fetch product details from Shopify
    const getUrl = `https://${store.store_url}/admin/api/2023-07/products/${productId}.json`;
    const productResponse = await fetch(getUrl, {
      headers: {
        'X-Shopify-Access-Token': store.access_token,
        'Content-Type': 'application/json',
      },
    });
    
    if (!productResponse.ok) {
      console.error(`Shopify API error: ${productResponse.status} ${productResponse.statusText}`);
      throw new Error(`Failed to fetch product from Shopify: ${productResponse.statusText}`);
    }
    
    const productData = await productResponse.json();
    const product = productData.product;
    
    // Apply optimizations
    const updatedProduct = { ...product };
    const appliedChanges = [];
    
    for (const opt of optimizations) {
      if (!opt.applied) {
        switch (opt.type) {
          case 'title':
            if (opt.field === 'title') {
              updatedProduct.title = opt.suggestion;
              appliedChanges.push({ field: 'title', from: opt.original, to: opt.suggestion });
            }
            break;
          case 'description':
            if (opt.field === 'body_html') {
              updatedProduct.body_html = opt.suggestion;
              appliedChanges.push({ field: 'body_html', from: opt.original, to: opt.suggestion });
            }
            break;
          case 'url':
            if (opt.field === 'handle') {
              updatedProduct.handle = opt.suggestion;
              appliedChanges.push({ field: 'handle', from: opt.original, to: opt.suggestion });
            }
            break;
          case 'content':
            if (opt.field === 'tags') {
              updatedProduct.tags = opt.suggestion;
              appliedChanges.push({ field: 'tags', from: opt.original, to: opt.suggestion });
            }
            break;
          case 'image':
            if (opt.field === 'image_alt' && updatedProduct.images && updatedProduct.images.length > 0) {
              // Update all images without alt text
              updatedProduct.images = updatedProduct.images.map(img => {
                if (!img.alt || img.alt.trim() === '') {
                  return { ...img, alt: opt.suggestion };
                }
                return img;
              });
              appliedChanges.push({ field: 'image_alt', from: opt.original, to: opt.suggestion });
            }
            break;
        }
        
        // Mark this optimization as applied in the database
        opt.applied = true;
      }
    }
    
    // Update the product in Shopify
    if (appliedChanges.length > 0) {
      const updateUrl = `https://${store.store_url}/admin/api/2023-07/products/${productId}.json`;
      const updateResponse = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'X-Shopify-Access-Token': store.access_token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product: updatedProduct }),
      });
      
      if (!updateResponse.ok) {
        console.error(`Shopify API error: ${updateResponse.status} ${updateResponse.statusText}`);
        throw new Error(`Failed to update product in Shopify: ${updateResponse.statusText}`);
      }
    }
    
    // Update the optimizations in the database
    const { data: analysis } = await supabase
      .from('shopify_seo_analyses')
      .select('*')
      .eq('store_id', storeId)
      .eq('product_id', productId)
      .single();
    
    if (analysis) {
      await supabase
        .from('shopify_seo_analyses')
        .update({
          optimizations: optimizations,
          updated_at: new Date().toISOString(),
        })
        .eq('id', analysis.id);
    }
    
    return new Response(JSON.stringify({
      success: true,
      appliedChanges,
      message: `Applied ${appliedChanges.length} optimizations to the product`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error optimizing product SEO:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to optimize product SEO' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
