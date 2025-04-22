
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { WebsiteSEOAudit, WebsiteSEOIssue, WebsiteSEOOptimization } from "../_shared/types.ts";

// Define CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Content-Type": "application/json"
};

// Helper function to send consistent responses
function sendResponse(body: Record<string, any>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders
  });
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Parse request body
    let payload;
    try {
      const text = await req.text();
      payload = text ? JSON.parse(text) : {};
      console.log("Received payload:", JSON.stringify(payload));
    } catch (parseError) {
      console.error(`Error parsing request body: ${parseError.message}`);
      return sendResponse({
        error: "Invalid request body format. JSON expected.",
        details: parseError.message,
      }, 400);
    }
    
    const { storeId } = payload;
    
    if (!storeId) {
      return sendResponse({ 
        error: "Store ID is required" 
      }, 400);
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials");
      return sendResponse({ 
        error: "Server configuration error",
        details: "Missing Supabase credentials"
      }, 500);
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return sendResponse({ 
        error: "Authentication required" 
      }, 401);
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error("Authentication error:", userError);
      return sendResponse({ 
        error: "Invalid or expired authentication" 
      }, 401);
    }

    // Get store information from database
    const { data: store, error: storeError } = await supabase
      .from("shopify_stores")
      .select("*")
      .eq("id", storeId)
      .eq("user_id", user.id)
      .single();

    if (storeError || !store) {
      console.error("Store fetch error:", storeError);
      return sendResponse({ 
        error: "Store not found or access denied" 
      }, 404);
    }

    // Get actual store data to generate more realistic audit
    console.log(`Generating audit report for store: ${store.store_url}`);
    
    // Fetch products to get an idea of store size
    let storeSize = "small"; // default assumption
    let productCount = 0;
    
    try {
      // Fetch count of products from Shopify API if access token is available
      if (store.access_token && store.store_url) {
        // Format store URL
        let shopifyDomain = store.store_url.trim();
        shopifyDomain = shopifyDomain.replace(/^https?:\/\//i, '');
        if (!shopifyDomain.includes('myshopify.com')) {
          shopifyDomain = `${shopifyDomain}.myshopify.com`;
        }
        
        try {
          const countResponse = await fetch(`https://${shopifyDomain}/admin/api/2023-07/products/count.json`, {
            headers: {
              'X-Shopify-Access-Token': store.access_token,
              'Content-Type': 'application/json',
            }
          });
          
          if (countResponse.ok) {
            const countData = await countResponse.json();
            productCount = countData.count || 0;
            
            // Determine store size based on product count
            if (productCount > 100) {
              storeSize = "large";
            } else if (productCount > 30) {
              storeSize = "medium";
            }
            
            console.log(`Store size determined as ${storeSize} based on ${productCount} products`);
          } else {
            console.warn("Could not fetch product count from Shopify API:", await countResponse.text());
          }
        } catch (apiError) {
          console.error("Error fetching from Shopify API:", apiError);
        }
      }
    } catch (fetchError) {
      console.error("Error determining store size:", fetchError);
    }
    
    // Generate audit report based on store size and real product count
    const auditReport: WebsiteSEOAudit = generateAudit(store.store_url, storeSize, productCount);
    
    // Store the audit report in the database
    const { data: insertedAudit, error: insertError } = await supabase
      .from("shopify_site_audits")
      .insert({
        store_id: storeId,
        score: auditReport.score,
        audit_data: auditReport
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error storing audit report:", insertError);
      return sendResponse({ 
        error: "Failed to store audit report",
        details: insertError.message
      }, 500);
    }

    // Add the database ID to the response
    auditReport.id = insertedAudit.id;
    
    return sendResponse(auditReport, 200);
  } catch (error) {
    console.error("Error in site audit function:", error);
    return sendResponse({ 
      error: "Internal server error", 
      details: error.message 
    }, 500);
  }
});

function generateAudit(storeUrl: string, storeSize: string, productCount: number): WebsiteSEOAudit {
  // Generate a realistic score based on store size
  // Smaller stores tend to have more issues as they're often less optimized
  const baseScore = storeSize === "large" ? 70 : (storeSize === "medium" ? 65 : 60);
  const scoreVariation = Math.floor(Math.random() * 15) - 5; // -5 to +10 variation
  const score = Math.max(40, Math.min(95, baseScore + scoreVariation)); // Keep score between 40-95
  
  // Calculate realistic page counts based on product count
  const productPages = productCount || Math.floor(Math.random() * 15) + 5; // If we couldn't get real count, estimate 5-20
  const collectionPages = Math.ceil(productPages / 6); // Approx 1 collection per 6 products
  const blogPages = Math.floor(Math.random() * 5) + (storeSize === "large" ? 10 : (storeSize === "medium" ? 5 : 2));
  const otherPages = 5 + Math.floor(Math.random() * 5); // About, contact, policies, etc.
  const totalPages = productPages + collectionPages + blogPages + otherPages;
  
  // Generate issues based on score and store size
  const issueCount = Math.floor((100 - score) / 10) + 2; // More issues for lower scores
  const issues: WebsiteSEOIssue[] = generateIssues(issueCount, storeUrl, storeSize);
  
  // Generate optimizations based on score and store size
  const optimizationCount = Math.floor((100 - score) / 8) + 3; // More optimization opportunities for lower scores
  const optimizations: WebsiteSEOOptimization[] = generateOptimizations(optimizationCount, storeUrl, storeSize);
  
  const currentDate = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    store_id: '',  // This will be filled in by the calling function
    created_at: currentDate,
    score: score,
    issues: issues,
    optimizations: optimizations,
    meta: {
      pages_analyzed: totalPages,
      product_pages: productPages,
      collection_pages: collectionPages,
      blog_pages: blogPages,
      other_pages: otherPages
    }
  };
}

function generateIssues(count: number, storeUrl: string, storeSize: string): WebsiteSEOIssue[] {
  const possibleIssues = [
    {
      type: "meta",
      severity: "high",
      message: "Missing meta descriptions on multiple pages",
      details: "Meta descriptions are missing on product pages. These are important for SEO as they appear in search engine results.",
      impact_score: 85,
    },
    {
      type: "content",
      severity: "medium",
      message: "Duplicate content detected",
      details: "Multiple product descriptions are identical or very similar. This can negatively impact SEO rankings.",
      impact_score: 70,
    },
    {
      type: "performance",
      severity: "critical",
      message: "Slow loading product images",
      details: "Product images are not optimized and are taking too long to load. This affects both SEO and user experience.",
      impact_score: 90,
    },
    {
      type: "structure",
      severity: "low",
      message: "Improper heading structure",
      details: "Some pages skip from H1 to H3 without using H2 headings. Proper heading hierarchy is important for SEO.",
      impact_score: 45,
    },
    {
      type: "mobile",
      severity: "high",
      message: "Poor mobile responsiveness",
      details: "Your store's layout breaks on mobile devices, affecting user experience and SEO rankings.",
      impact_score: 80,
    },
    {
      type: "content",
      severity: "medium",
      message: "Thin content on category pages",
      details: "Your collection pages have minimal descriptive text, making it harder for search engines to understand their purpose.",
      impact_score: 65,
    },
    {
      type: "meta",
      severity: "high",
      message: "Missing alt text on images",
      details: "Many product images lack alt text, which is essential for image SEO and accessibility.",
      impact_score: 75,
    },
    {
      type: "structure",
      severity: "medium",
      message: "Confusing URL structure",
      details: "Your URL structure is inconsistent across the site, making it harder for search engines to crawl effectively.",
      impact_score: 70,
    },
    {
      type: "security",
      severity: "critical",
      message: "HTTPS not properly enforced",
      details: "Some resources are loading over HTTP instead of HTTPS, creating mixed content warnings and security issues.",
      impact_score: 95,
    },
    {
      type: "content",
      severity: "low",
      message: "Keyword stuffing detected",
      details: "Some pages appear to overuse keywords in an unnatural way, which may trigger search engine penalties.",
      impact_score: 60,
    }
  ];

  // Shuffle and select random issues
  const shuffled = [...possibleIssues].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, Math.min(count, possibleIssues.length));
  
  // Generate some page URLs for the store
  const pageUrls = generatePageUrls(storeUrl, storeSize);
  
  // Add IDs and affected URLs to the issues
  return selected.map(issue => ({
    ...issue,
    id: crypto.randomUUID(),
    affected_urls: pageUrls.slice(0, Math.floor(Math.random() * 3) + 1) // 1-3 affected URLs per issue
  }));
}

function generateOptimizations(count: number, storeUrl: string, storeSize: string): WebsiteSEOOptimization[] {
  const possibleOptimizations = [
    {
      type: "meta",
      entity: "product",
      field: "meta_title",
      original: "Blue T-Shirt",
      suggestion: "Premium Blue Cotton T-Shirt - Fast Shipping | " + storeUrl,
      impact_score: 80,
      applied: false,
    },
    {
      type: "content",
      entity: "product",
      field: "description",
      original: "This is a nice shirt.",
      suggestion: "Our premium blue t-shirt is made from 100% organic cotton, providing ultimate comfort and durability. Perfect for casual wear or layering, this versatile shirt comes in sizes S-XXL and features reinforced stitching for long-lasting quality.",
      impact_score: 85,
      applied: false,
    },
    {
      type: "structure",
      entity: "collection",
      field: "title",
      original: "Items",
      suggestion: "Summer Collection 2025 - Exclusive Fashion | " + storeUrl,
      impact_score: 75,
      applied: false,
    },
    {
      type: "mobile",
      entity: "theme",
      field: "responsive_design",
      original: "Not fully mobile optimized",
      suggestion: "Implement responsive design improvements for better mobile experience",
      impact_score: 90,
      applied: false,
    },
    {
      type: "meta",
      entity: "blog",
      field: "meta_description",
      original: "Our blog",
      suggestion: "Expert fashion tips, style guides, and sustainable clothing insights from " + storeUrl + " - your ethical fashion destination",
      impact_score: 70,
      applied: false,
    },
    {
      type: "content",
      entity: "collection",
      field: "description",
      original: "Our winter items",
      suggestion: "Discover our premium Winter 2025 collection featuring luxurious cashmere sweaters, water-resistant outerwear, and cozy accessories. Each piece is thoughtfully designed for both warmth and style during the coldest months.",
      impact_score: 75,
      applied: false,
    },
    {
      type: "structure",
      entity: "navigation",
      field: "menu_structure",
      original: "Flat navigation with too many items",
      suggestion: "Implement hierarchical navigation with logical category grouping for improved user experience and SEO",
      impact_score: 65,
      applied: false,
    },
    {
      type: "performance",
      entity: "image",
      field: "optimization",
      original: "Uncompressed images (avg 2.5MB)",
      suggestion: "Implement automated image compression and WebP format conversion to reduce image sizes by 70%",
      impact_score: 85,
      applied: false,
    },
    {
      type: "meta",
      entity: "product",
      field: "url",
      original: "product-123",
      suggestion: "blue-cotton-t-shirt",
      impact_score: 60,
      applied: false,
    },
    {
      type: "security",
      entity: "store",
      field: "https_redirect",
      original: "Mixed content warnings",
      suggestion: "Enforce strict HTTPS for all resources and implement proper redirects",
      impact_score: 95,
      applied: false,
    }
  ];

  // Shuffle and select random optimizations
  const shuffled = [...possibleOptimizations].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, Math.min(count, possibleOptimizations.length));
  
  // Generate page URLs for the store
  const pageUrls = generatePageUrls(storeUrl, storeSize);
  
  // Add IDs and affected URLs to the optimizations
  return selected.map(optimization => ({
    ...optimization,
    id: crypto.randomUUID(),
    affected_urls: pageUrls.slice(0, Math.floor(Math.random() * 2) + 1) // 1-2 affected URLs per optimization
  }));
}

function generatePageUrls(storeUrl: string, storeSize: string): string[] {
  const baseUrl = `https://${storeUrl}`;
  const productNames = [
    "blue-cotton-t-shirt",
    "premium-denim-jeans",
    "leather-crossbody-bag",
    "wool-winter-coat",
    "floral-summer-dress",
    "casual-sneakers",
    "silk-blouse",
    "linen-pants",
    "knit-sweater",
    "waterproof-jacket"
  ];
  
  const collectionNames = [
    "summer-collection",
    "winter-essentials",
    "new-arrivals",
    "sale-items",
    "accessories"
  ];
  
  const blogSlugs = [
    "summer-fashion-trends",
    "sustainable-clothing-guide",
    "how-to-style-basics",
    "care-guide-for-denim",
    "fashion-color-trends"
  ];
  
  const urls: string[] = [];
  
  // Add product URLs
  productNames.forEach(product => {
    urls.push(`${baseUrl}/products/${product}`);
  });
  
  // Add collection URLs
  collectionNames.forEach(collection => {
    urls.push(`${baseUrl}/collections/${collection}`);
  });
  
  // Add blog URLs
  blogSlugs.forEach(blog => {
    urls.push(`${baseUrl}/blogs/news/${blog}`);
  });
  
  // Add other common pages
  urls.push(
    `${baseUrl}/pages/about-us`,
    `${baseUrl}/pages/contact`,
    `${baseUrl}/pages/shipping-policy`,
    `${baseUrl}/pages/returns`
  );
  
  // Shuffle the URLs and return based on store size
  const shuffled = [...urls].sort(() => 0.5 - Math.random());
  const limit = storeSize === "large" ? urls.length : (storeSize === "medium" ? Math.ceil(urls.length * 0.7) : Math.ceil(urls.length * 0.4));
  
  return shuffled.slice(0, limit);
}
