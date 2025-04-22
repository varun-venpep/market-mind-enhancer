
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
    // Log all headers for debugging
    console.log("Headers received in shopify-optimize:", JSON.stringify(Object.fromEntries([...req.headers])));
    
    // Check for authentication header first
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error("Missing authorization header in shopify-optimize function");
      return new Response(JSON.stringify({ 
        error: 'Not authenticated',
        debug: {
          headers: Object.fromEntries([...req.headers]),
          method: req.method
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }
    
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
    
    // Log authentication info
    console.log("Authenticating with token:", authHeader.substring(0, 15) + "...");
    
    // Verify the token
    const token = authHeader.replace('Bearer ', '');
    let user = null;
    
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser(token);
      
      if (userError || !userData.user) {
        console.error("Authentication failed with getUser:", userError);
        console.log("Attempting session refresh...");
        
        // Try to refresh session if available
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession({
          refresh_token: token,
        });
        
        if (!refreshError && refreshData.session) {
          console.log("Session refreshed successfully");
          user = refreshData.session.user;
        } else {
          console.error("Session refresh failed:", refreshError);
          return new Response(JSON.stringify({ 
            error: 'Failed to authenticate user: Invalid or expired token'
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 401,
          });
        }
      } else {
        user = userData.user;
      }
    } catch (authError) {
      console.error("Exception during authentication:", authError);
      return new Response(JSON.stringify({ 
        error: 'Authentication error: ' + (authError.message || 'Unknown error') 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }
    
    if (!user) {
      return new Response(JSON.stringify({ 
        error: 'Authentication failed: User not found' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }
    
    console.log("User authenticated successfully:", user.id);
    
    // Get the store details
    const { data: store, error: storeError } = await supabase
      .from('shopify_stores')
      .select('*')
      .eq('id', storeId)
      .single();
    
    if (storeError) {
      console.error("Store not found:", storeError);
      return new Response(JSON.stringify({ 
        error: 'Store not found' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }
    
    // Format the store URL correctly
    let storeUrl = store.store_url.trim();
    // Remove protocol if present
    storeUrl = storeUrl.replace(/^https?:\/\//i, '');
    // Ensure myshopify.com domain
    if (!storeUrl.includes('myshopify.com')) {
      storeUrl = `${storeUrl}.myshopify.com`;
    }
    
    console.log("Using store URL for API calls:", storeUrl);
    
    try {
      // Fetch product details from Shopify
      const getUrl = `https://${storeUrl}/admin/api/2023-07/products/${productId}.json`;
      console.log("Fetching product from Shopify:", getUrl);
      
      const productResponse = await fetch(getUrl, {
        headers: {
          'X-Shopify-Access-Token': store.access_token,
          'Content-Type': 'application/json',
        },
      });
      
      if (!productResponse.ok) {
        const errorText = await productResponse.text();
        console.error(`Shopify API error: ${productResponse.status} ${productResponse.statusText} - ${errorText}`);
        throw new Error(`Failed to fetch product from Shopify: ${productResponse.statusText}`);
      }
      
      const productData = await productResponse.json();
      const product = productData.product;
      
      console.log("Successfully fetched product:", { id: product.id, title: product.title });
      
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
                updatedProduct.images = updatedProduct.images.map((img: any) => {
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
        const updateUrl = `https://${storeUrl}/admin/api/2023-07/products/${productId}.json`;
        console.log("Updating product in Shopify:", updateUrl);
        
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
            optimizations,
            updated_at: new Date().toISOString(),
          })
          .eq('id', analysis.id);
      }
      
      // Record optimization history
      if (appliedChanges.length > 0) {
        for (const change of appliedChanges) {
          await supabase
            .from('shopify_optimization_history')
            .insert({
              store_id: storeId,
              entity_id: productId,
              entity_type: 'product',
              field: change.field,
              original_value: change.from,
              new_value: change.to,
              optimization_type: optimizations.find((opt: any) => opt.field === change.field)?.type || 'content'
            });
        }
      }
      
      return new Response(JSON.stringify({
        success: true,
        appliedChanges,
        message: `Applied ${appliedChanges.length} optimizations to the product`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error: any) {
      console.error('Error optimizing product SEO:', error);
      return new Response(JSON.stringify({ 
        error: error.message || 'Failed to optimize product SEO' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }
  } catch (error: any) {
    console.error('Error handling optimize request:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to handle optimize request' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
