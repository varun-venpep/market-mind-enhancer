
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
    const { storeId, productId } = await req.json();
    
    if (!storeId || !productId) {
      return new Response(JSON.stringify({ 
        error: 'Store ID and Product ID are required' 
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
    
    // Verify the token
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
    
    // Fetch product details from Shopify
    const apiUrl = `https://${store.store_url}/admin/api/2023-07/products/${productId}.json`;
    const productResponse = await fetch(apiUrl, {
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
    
    // Analyze SEO
    const issues = [];
    let score = 100;
    const optimizations = [];

    // Check title length
    if (!product.title || product.title.length < 5) {
      issues.push({
        type: 'title',
        severity: 'high',
        message: 'Product title is too short or missing',
      });
      score -= 20;
      optimizations.push({
        type: 'title',
        field: 'title',
        original: product.title || '',
        suggestion: product.title ? `${product.title} - Best Quality Product` : 'New High-Quality Product',
        applied: false,
      });
    } else if (product.title.length > 70) {
      issues.push({
        type: 'title',
        severity: 'medium',
        message: 'Product title is too long (over 70 characters)',
      });
      score -= 10;
      optimizations.push({
        type: 'title',
        field: 'title',
        original: product.title,
        suggestion: product.title.substring(0, 67) + '...',
        applied: false,
      });
    }

    // Check description
    if (!product.body_html || product.body_html.length < 50) {
      issues.push({
        type: 'description',
        severity: 'high',
        message: 'Product description is too short or missing',
      });
      score -= 20;
      optimizations.push({
        type: 'description',
        field: 'body_html',
        original: product.body_html || '',
        suggestion: product.body_html ? `${product.body_html}<p>High quality product with premium features.</p>` : '<p>This is a premium quality product that offers exceptional value. Perfect for those looking for reliability and performance.</p>',
        applied: false,
      });
    }

    // Check images
    if (!product.images || product.images.length === 0) {
      issues.push({
        type: 'image',
        severity: 'high',
        message: 'Product has no images',
      });
      score -= 15;
      optimizations.push({
        type: 'image',
        field: 'images',
        original: 'No images',
        suggestion: 'Add at least one high-quality product image',
        applied: false,
      });
    } else if (product.images.length < 3) {
      issues.push({
        type: 'image',
        severity: 'medium',
        message: 'Product has fewer than 3 images',
      });
      score -= 5;
      optimizations.push({
        type: 'image',
        field: 'images',
        original: `${product.images.length} images`,
        suggestion: 'Add more product images from different angles',
        applied: false,
      });
    }

    // Check for image alt texts
    const imagesWithoutAlt = product.images.filter(img => !img.alt || img.alt.trim() === '').length;
    if (imagesWithoutAlt > 0 && product.images.length > 0) {
      issues.push({
        type: 'image',
        severity: 'medium',
        message: `${imagesWithoutAlt} images missing alt text`,
      });
      score -= 5;
      optimizations.push({
        type: 'image',
        field: 'image_alt',
        original: 'Missing alt text',
        suggestion: `${product.title} - product image`,
        applied: false,
      });
    }

    // Check URL/handle
    if (!product.handle || product.handle.includes('copy-of') || product.handle.includes('untitled')) {
      issues.push({
        type: 'url',
        severity: 'medium',
        message: 'Product URL could be improved',
      });
      score -= 10;
      optimizations.push({
        type: 'url',
        field: 'handle',
        original: product.handle || '',
        suggestion: product.title ? product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, '').replace(/^-/, '') : 'improved-product-url',
        applied: false,
      });
    }

    // Check tags
    if (!product.tags || product.tags.length === 0) {
      issues.push({
        type: 'content',
        severity: 'medium',
        message: 'No product tags defined',
      });
      score -= 10;
      optimizations.push({
        type: 'content',
        field: 'tags',
        original: '',
        suggestion: `${product.product_type || ''}, quality product, best seller`,
        applied: false,
      });
    }

    // Ensure score is within 0-100
    score = Math.max(0, Math.min(100, score));

    // Create result object
    const analysisResult = {
      product_id: productId,
      title: product.title,
      handle: product.handle,
      issues,
      score,
      optimizations,
    };

    // Store analysis in database
    const { data: existingAnalysis } = await supabase
      .from('shopify_seo_analyses')
      .select('id')
      .eq('store_id', storeId)
      .eq('product_id', productId)
      .maybeSingle();

    if (existingAnalysis) {
      await supabase
        .from('shopify_seo_analyses')
        .update({
          title: product.title,
          handle: product.handle,
          issues,
          score,
          optimizations,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingAnalysis.id);
    } else {
      await supabase
        .from('shopify_seo_analyses')
        .insert({
          store_id: storeId,
          product_id: productId,
          title: product.title,
          handle: product.handle,
          issues,
          score,
          optimizations,
        });
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error analyzing product SEO:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to analyze product SEO' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
