
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { apiKey, apiSecretKey, storeUrl } = await req.json();
    
    if (!apiKey || !apiSecretKey || !storeUrl) {
      return new Response(JSON.stringify({ 
        error: 'Missing required Shopify credentials' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Format the store URL
    let formattedUrl = storeUrl.trim();
    if (formattedUrl.startsWith('http://') || formattedUrl.startsWith('https://')) {
      formattedUrl = formattedUrl.replace(/^https?:\/\//, '');
    }
    if (formattedUrl.endsWith('/')) {
      formattedUrl = formattedUrl.slice(0, -1);
    }
    
    // Connect to Shopify Admin API
    const response = await fetch(`https://${formattedUrl}/admin/api/2023-01/shop.json`, {
      headers: {
        'X-Shopify-Access-Token': apiSecretKey,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to connect to Shopify: ${response.statusText}`);
    }
    
    const { shop } = await response.json();
    
    return new Response(JSON.stringify({ 
      shop,
      access_token: apiSecretKey
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to connect to Shopify' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
