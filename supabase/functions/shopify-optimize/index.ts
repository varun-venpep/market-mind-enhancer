
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    
    // Authenticate the user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }
    
    // Get store credentials and verify ownership
    const { data: store, error: storeError } = await supabase
      .from('shopify_stores')
      .select('*')
      .eq('id', storeId)
      .eq('user_id', user.id)  // Ensure the user owns this store
      .single();
      
    if (storeError || !store) {
      return new Response(JSON.stringify({ error: 'Store not found or access denied' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    // Prepare product update object
    const productUpdate = {};
    const metafieldsToUpdate = [];
    const imagesToUpdate = [];
    
    // Process optimizations
    optimizations.forEach(opt => {
      if (opt.type === 'title' && opt.field === 'title') {
        productUpdate.title = opt.suggestion;
      } else if (opt.type === 'description' && opt.field === 'metafields') {
        metafieldsToUpdate.push({
          namespace: 'global',
          key: 'description_tag',
          value: opt.suggestion,
          type: 'single_line_text_field'
        });
      } else if (opt.type === 'image' && opt.field.startsWith('images[')) {
        const match = opt.field.match(/images\[(\d+)\]\.alt/);
        if (match && match[1]) {
          const imageIndex = parseInt(match[1], 10);
          imagesToUpdate.push({ id: imageIndex, alt: opt.suggestion });
        }
      }
    });
    
    // Update product on Shopify
    if (Object.keys(productUpdate).length > 0) {
      const productResponse = await fetch(`https://${store.store_url}/admin/api/2023-01/products/${productId}.json`, {
        method: 'PUT',
        headers: {
          'X-Shopify-Access-Token': store.access_token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product: productUpdate }),
      });
      
      if (!productResponse.ok) {
        throw new Error(`Failed to update product: ${productResponse.statusText}`);
      }
    }
    
    // Update metafields
    if (metafieldsToUpdate.length > 0) {
      for (const metafield of metafieldsToUpdate) {
        const metafieldResponse = await fetch(`https://${store.store_url}/admin/api/2023-01/products/${productId}/metafields.json`, {
          method: 'POST',
          headers: {
            'X-Shopify-Access-Token': store.access_token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ metafield }),
        });
        
        if (!metafieldResponse.ok) {
          console.warn(`Failed to update metafield: ${metafieldResponse.statusText}`);
        }
      }
    }
    
    // Update images
    if (imagesToUpdate.length > 0) {
      // First, get the current images
      const imagesResponse = await fetch(`https://${store.store_url}/admin/api/2023-01/products/${productId}/images.json`, {
        headers: {
          'X-Shopify-Access-Token': store.access_token,
          'Content-Type': 'application/json',
        },
      });
      
      if (!imagesResponse.ok) {
        throw new Error(`Failed to fetch images: ${imagesResponse.statusText}`);
      }
      
      const { images } = await imagesResponse.json();
      
      // Update each image
      for (const imageUpdate of imagesToUpdate) {
        const image = images[imageUpdate.id];
        if (image) {
          const updateResponse = await fetch(`https://${store.store_url}/admin/api/2023-01/products/${productId}/images/${image.id}.json`, {
            method: 'PUT',
            headers: {
              'X-Shopify-Access-Token': store.access_token,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: { id: image.id, alt: imageUpdate.alt } }),
          });
          
          if (!updateResponse.ok) {
            console.warn(`Failed to update image: ${updateResponse.statusText}`);
          }
        }
      }
    }
    
    // Update the analysis in the database with applied optimizations
    const { data: analysis, error: analysisError } = await supabase
      .from('shopify_seo_analyses')
      .select('*')
      .eq('store_id', storeId)
      .eq('product_id', productId)
      .single();
      
    if (!analysisError && analysis) {
      const updatedOptimizations = analysis.optimizations.map(opt => {
        // Check if this optimization was part of the ones we just applied
        const wasApplied = optimizations.some(applied => 
          applied.type === opt.type && applied.field === opt.field
        );
        
        if (wasApplied) {
          return { ...opt, applied: true };
        }
        
        return opt;
      });
      
      await supabase.from('shopify_seo_analyses')
        .update({
          optimizations: updatedOptimizations,
          updated_at: new Date().toISOString()
        })
        .eq('store_id', storeId)
        .eq('product_id', productId);
    }
    
    return new Response(JSON.stringify({ 
      success: true,
      message: 'SEO optimizations applied successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error applying optimizations:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to apply SEO optimizations' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
