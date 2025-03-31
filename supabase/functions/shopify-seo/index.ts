
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// SEO analysis functions
function analyzeTitleTag(title: string) {
  const issues = [];
  let score = 100;
  
  // Check title length (ideal is 50-60 characters)
  if (!title) {
    issues.push({
      type: 'title',
      severity: 'high',
      message: 'Missing title tag'
    });
    score -= 20;
  } else if (title.length < 30) {
    issues.push({
      type: 'title',
      severity: 'medium',
      message: 'Title tag is too short (less than 30 characters)'
    });
    score -= 10;
  } else if (title.length > 60) {
    issues.push({
      type: 'title',
      severity: 'medium',
      message: 'Title tag is too long (more than 60 characters)'
    });
    score -= 10;
  }
  
  // Check for keyword stuffing
  const words = title?.split(' ') || [];
  const wordCounts = words.reduce((acc, word) => {
    const lowerWord = word.toLowerCase();
    acc[lowerWord] = (acc[lowerWord] || 0) + 1;
    return acc;
  }, {});
  
  const stuffedWords = Object.entries(wordCounts)
    .filter(([word, count]) => (count as number) > 2 && word.length > 3);
    
  if (stuffedWords.length > 0) {
    issues.push({
      type: 'title',
      severity: 'medium',
      message: `Possible keyword stuffing detected with "${stuffedWords[0][0]}"`
    });
    score -= 10;
  }
  
  return { issues, score, title };
}

function analyzeDescription(description: string) {
  const issues = [];
  let score = 100;
  
  // Check description length (ideal is 120-160 characters)
  if (!description) {
    issues.push({
      type: 'description',
      severity: 'high',
      message: 'Missing meta description'
    });
    score -= 20;
  } else if (description.length < 70) {
    issues.push({
      type: 'description',
      severity: 'medium',
      message: 'Meta description is too short (less than 70 characters)'
    });
    score -= 10;
  } else if (description.length > 160) {
    issues.push({
      type: 'description',
      severity: 'low',
      message: 'Meta description is too long (more than 160 characters)'
    });
    score -= 5;
  }
  
  return { issues, score, description };
}

function analyzeContent(content: string) {
  const issues = [];
  let score = 100;
  
  // Check content length
  if (!content) {
    issues.push({
      type: 'content',
      severity: 'high',
      message: 'Missing product description content'
    });
    score -= 20;
  } else if (content.length < 300) {
    issues.push({
      type: 'content',
      severity: 'medium',
      message: 'Product description is too short (less than 300 characters)'
    });
    score -= 10;
  }
  
  // Check for HTML formatting
  if (content && !/<h[1-6]|<p|<ul|<ol|<li/i.test(content)) {
    issues.push({
      type: 'content',
      severity: 'low',
      message: 'Product description lacks proper HTML formatting (headings, paragraphs, lists)'
    });
    score -= 5;
  }
  
  return { issues, score, content };
}

function analyzeImages(images) {
  const issues = [];
  let score = 100;
  
  // Check if there are images
  if (!images || images.length === 0) {
    issues.push({
      type: 'image',
      severity: 'high',
      message: 'No product images found'
    });
    score -= 20;
  } else {
    // Check alt text
    const imagesWithoutAlt = images.filter(img => !img.alt || img.alt.trim() === '');
    if (imagesWithoutAlt.length > 0) {
      issues.push({
        type: 'image',
        severity: 'medium',
        message: `${imagesWithoutAlt.length} image(s) missing alt text`
      });
      score -= 10 * (imagesWithoutAlt.length / images.length);
    }
  }
  
  return { issues, score, images };
}

function generateSuggestions(product, analysisResults) {
  const optimizations = [];
  
  // Title optimization
  const titleIssues = analysisResults.filter(result => 
    result.issues.some(issue => issue.type === 'title')
  );
  
  if (titleIssues.length > 0) {
    const title = product.title;
    
    // Generate better title
    let optimizedTitle = title;
    
    // If title is too short, add product type or vendor
    if (title.length < 30 && product.product_type) {
      optimizedTitle = `${title} - ${product.product_type}`;
    }
    
    // If title is too long, truncate it
    if (title.length > 60) {
      optimizedTitle = title.substring(0, 57) + '...';
    }
    
    if (optimizedTitle !== title) {
      optimizations.push({
        type: 'title',
        field: 'title',
        original: title,
        suggestion: optimizedTitle,
        applied: false
      });
    }
  }
  
  // Description optimization - extract from HTML content
  const contentIssues = analysisResults.filter(result => 
    result.issues.some(issue => issue.type === 'content')
  );
  
  if (contentIssues.length > 0 && product.body_html) {
    // Strip HTML tags and generate a clean description
    const strippedContent = product.body_html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    
    if (strippedContent.length > 160) {
      const optimizedDescription = strippedContent.substring(0, 157) + '...';
      
      optimizations.push({
        type: 'description',
        field: 'metafields',
        original: product.metafields.description || '',
        suggestion: optimizedDescription,
        applied: false
      });
    } else if (strippedContent.length > 0) {
      optimizations.push({
        type: 'description',
        field: 'metafields',
        original: product.metafields.description || '',
        suggestion: strippedContent,
        applied: false
      });
    }
  }
  
  // Image alt text optimization
  const imageIssues = analysisResults.filter(result => 
    result.issues.some(issue => issue.type === 'image')
  );
  
  if (imageIssues.length > 0 && product.images && product.images.length > 0) {
    product.images.forEach((image, index) => {
      if (!image.alt || image.alt.trim() === '') {
        // Generate alt text based on product title and position
        const position = index === 0 ? 'Main' : `Alternate ${index}`;
        const altText = `${position} image of ${product.title}`;
        
        optimizations.push({
          type: 'image',
          field: `images[${index}].alt`,
          original: image.alt || '',
          suggestion: altText,
          applied: false
        });
      }
    });
  }
  
  return optimizations;
}

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
    
    // Get store credentials
    const { data: store, error: storeError } = await supabase
      .from('shopify_stores')
      .select('*')
      .eq('id', storeId)
      .single();
      
    if (storeError || !store) {
      return new Response(JSON.stringify({ error: 'Store not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    // Fetch product from Shopify API
    const response = await fetch(`https://${store.store_url}/admin/api/2023-01/products/${productId}.json?fields=id,title,handle,body_html,vendor,product_type,created_at,updated_at,published_at,tags,variants,images,options,metafields`, {
      headers: {
        'X-Shopify-Access-Token': store.access_token,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }
    
    const { product } = await response.json();
    
    // Run SEO analysis
    const titleAnalysis = analyzeTitleTag(product.title);
    const descriptionAnalysis = analyzeDescription(product.metafields?.description || '');
    const contentAnalysis = analyzeContent(product.body_html);
    const imageAnalysis = analyzeImages(product.images);
    
    // Combine all issues
    const allIssues = [
      ...titleAnalysis.issues,
      ...descriptionAnalysis.issues,
      ...contentAnalysis.issues,
      ...imageAnalysis.issues
    ];
    
    // Calculate overall score
    const scoreFactors = [
      titleAnalysis.score * 0.3,  // Title is 30% of the score
      descriptionAnalysis.score * 0.2,  // Description is 20% of the score
      contentAnalysis.score * 0.3,  // Content is 30% of the score
      imageAnalysis.score * 0.2   // Images are 20% of the score
    ];
    
    const overallScore = Math.round(scoreFactors.reduce((sum, score) => sum + score, 0) / scoreFactors.length);
    
    // Generate optimization suggestions
    const optimizations = generateSuggestions(product, [
      titleAnalysis,
      descriptionAnalysis,
      contentAnalysis,
      imageAnalysis
    ]);
    
    const result = {
      product_id: product.id,
      title: product.title,
      handle: product.handle,
      issues: allIssues,
      score: overallScore,
      optimizations
    };
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message || 'Failed to analyze SEO' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
