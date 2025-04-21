
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

    // Generate a sample audit report
    console.log(`Generating audit report for store: ${store.store_url}`);
    const auditReport: WebsiteSEOAudit = generateSampleAudit(store.store_url);
    
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

function generateSampleAudit(storeUrl: string): WebsiteSEOAudit {
  const score = Math.floor(Math.random() * 40) + 60; // Random score between 60-99
  
  const issues: WebsiteSEOIssue[] = [
    {
      id: crypto.randomUUID(),
      type: "meta",
      severity: "high",
      message: "Missing meta descriptions on multiple pages",
      details: "Meta descriptions are missing on 12 product pages. These are important for SEO as they appear in search engine results.",
      impact_score: 85,
      affected_urls: [
        `https://${storeUrl}/products/example-product-1`,
        `https://${storeUrl}/products/example-product-2`
      ]
    },
    {
      id: crypto.randomUUID(),
      type: "content",
      severity: "medium",
      message: "Duplicate content detected",
      details: "Multiple product descriptions are identical or very similar. This can negatively impact SEO rankings.",
      impact_score: 70,
      affected_urls: [
        `https://${storeUrl}/products/similar-product-1`,
        `https://${storeUrl}/products/similar-product-2`
      ]
    },
    {
      id: crypto.randomUUID(),
      type: "performance",
      severity: "critical",
      message: "Slow loading product images",
      details: "Product images are not optimized and are taking too long to load. This affects both SEO and user experience.",
      impact_score: 90,
      affected_urls: [
        `https://${storeUrl}/products/heavy-image-product`
      ]
    },
    {
      id: crypto.randomUUID(),
      type: "structure",
      severity: "low",
      message: "Improper heading structure",
      details: "Some pages skip from H1 to H3 without using H2 headings. Proper heading hierarchy is important for SEO.",
      impact_score: 45,
      affected_urls: [
        `https://${storeUrl}/collections/main-collection`
      ]
    }
  ];
  
  const optimizations: WebsiteSEOOptimization[] = [
    {
      id: crypto.randomUUID(),
      type: "meta",
      entity: "product",
      field: "meta_title",
      original: "Blue T-Shirt",
      suggestion: "Premium Blue Cotton T-Shirt - Fast Shipping | " + storeUrl,
      impact_score: 80,
      applied: false,
      affected_urls: [`https://${storeUrl}/products/blue-tshirt`]
    },
    {
      id: crypto.randomUUID(),
      type: "content",
      entity: "product",
      field: "description",
      original: "This is a nice shirt.",
      suggestion: "Our premium blue t-shirt is made from 100% organic cotton, providing ultimate comfort and durability. Perfect for casual wear or layering, this versatile shirt comes in sizes S-XXL and features reinforced stitching for long-lasting quality.",
      impact_score: 85,
      applied: false,
      affected_urls: [`https://${storeUrl}/products/blue-tshirt`]
    },
    {
      id: crypto.randomUUID(),
      type: "structure",
      entity: "collection",
      field: "title",
      original: "Items",
      suggestion: "Summer Collection 2025 - Exclusive Fashion | " + storeUrl,
      impact_score: 75,
      applied: false,
      affected_urls: [`https://${storeUrl}/collections/summer`]
    },
    {
      id: crypto.randomUUID(),
      type: "mobile",
      entity: "theme",
      field: "responsive_design",
      original: "Not fully mobile optimized",
      suggestion: "Implement responsive design improvements for better mobile experience",
      impact_score: 90,
      applied: false,
      affected_urls: [`https://${storeUrl}`]
    }
  ];
  
  const currentDate = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    store_id: '',  // This will be filled in by the calling function
    created_at: currentDate,
    score: score,
    issues: issues,
    optimizations: optimizations,
    meta: {
      pages_analyzed: Math.floor(Math.random() * 50) + 50,
      product_pages: Math.floor(Math.random() * 30) + 20,
      collection_pages: Math.floor(Math.random() * 10) + 5,
      blog_pages: Math.floor(Math.random() * 8) + 2,
      other_pages: Math.floor(Math.random() * 10) + 5
    }
  };
}
