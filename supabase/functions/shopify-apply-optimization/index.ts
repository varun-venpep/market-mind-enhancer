
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
    const { storeId, optimization, auditId } = await req.json();
    
    if (!storeId || !optimization) {
      return new Response(JSON.stringify({ 
        error: 'Store ID and optimization details are required' 
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
    
    // Apply the optimization based on its type and location
    let result;
    
    if (optimization.location === 'store') {
      if (optimization.entity_id === 'shop') {
        // Update the shop details
        const shopResponse = await fetch(`https://${store.store_url}/admin/api/2023-07/shop.json`, {
          method: 'PUT',
          headers: {
            'X-Shopify-Access-Token': store.access_token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            shop: {
              [optimization.field]: optimization.suggestion
            }
          })
        });
        
        if (!shopResponse.ok) {
          console.error(`Shopify API error: ${shopResponse.status} ${shopResponse.statusText}`);
          throw new Error(`Failed to update shop: ${shopResponse.statusText}`);
        }
        
        result = await shopResponse.json();
      } else if (optimization.entity_id === 'robots' || optimization.entity_id === 'sitemap') {
        // These typically require theme edits or settings changes
        // For this example, we'll just return success
        result = { success: true, message: 'Technical recommendation noted. This requires manual implementation.' };
      }
    } else if (optimization.location === 'page') {
      // Update a page
      const pageResponse = await fetch(`https://${store.store_url}/admin/api/2023-07/pages/${optimization.entity_id}.json`, {
        method: 'PUT',
        headers: {
          'X-Shopify-Access-Token': store.access_token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page: {
            [optimization.field]: optimization.suggestion
          }
        })
      });
      
      if (!pageResponse.ok) {
        console.error(`Shopify API error: ${pageResponse.status} ${pageResponse.statusText}`);
        throw new Error(`Failed to update page: ${pageResponse.statusText}`);
      }
      
      result = await pageResponse.json();
    } else if (optimization.location === 'blog') {
      // Update a blog
      const blogResponse = await fetch(`https://${store.store_url}/admin/api/2023-07/blogs/${optimization.entity_id}.json`, {
        method: 'PUT',
        headers: {
          'X-Shopify-Access-Token': store.access_token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blog: {
            [optimization.field]: optimization.suggestion
          }
        })
      });
      
      if (!blogResponse.ok) {
        console.error(`Shopify API error: ${blogResponse.status} ${blogResponse.statusText}`);
        throw new Error(`Failed to update blog: ${blogResponse.statusText}`);
      }
      
      result = await blogResponse.json();
    } else if (optimization.location === 'product') {
      // Update a product
      const productResponse = await fetch(`https://${store.store_url}/admin/api/2023-07/products/${optimization.entity_id}.json`, {
        method: 'PUT',
        headers: {
          'X-Shopify-Access-Token': store.access_token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product: {
            [optimization.field]: optimization.suggestion
          }
        })
      });
      
      if (!productResponse.ok) {
        console.error(`Shopify API error: ${productResponse.status} ${productResponse.statusText}`);
        throw new Error(`Failed to update product: ${productResponse.statusText}`);
      }
      
      result = await productResponse.json();
    }
    
    // Mark this optimization as applied in the audit
    if (auditId) {
      const { data: auditData, error: getAuditError } = await supabase
        .from('shopify_site_audits')
        .select('audit_data')
        .eq('id', auditId)
        .single();
        
      if (!getAuditError && auditData) {
        const updatedAudit = { ...auditData.audit_data };
        
        // Find and mark the optimization as applied
        updatedAudit.optimizations = updatedAudit.optimizations.map(opt => {
          if (opt.location === optimization.location && 
              opt.entity_id === optimization.entity_id && 
              opt.field === optimization.field) {
            return { ...opt, applied: true };
          }
          return opt;
        });
        
        // Update the audit record
        await supabase
          .from('shopify_site_audits')
          .update({ audit_data: updatedAudit })
          .eq('id', auditId);
      }
    }
    
    // Log the optimization in a separate table for tracking
    await supabase
      .from('shopify_optimization_history')
      .insert({
        store_id: storeId,
        optimization_type: optimization.type,
        entity_id: optimization.entity_id,
        entity_type: optimization.location,
        field: optimization.field,
        original_value: optimization.original,
        new_value: optimization.suggestion,
        applied_at: new Date().toISOString()
      });

    return new Response(JSON.stringify({
      success: true,
      message: 'Optimization applied successfully',
      result
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
