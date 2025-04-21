
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

// Import shared types
import { WebsiteSEOAudit, WebsiteSEOIssue, WebsiteSEOOptimization } from "../_shared/types.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    const { storeId } = await req.json();
    
    if (!storeId) {
      return new Response(
        JSON.stringify({ error: "Store ID is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired authentication" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Get store information from database
    const { data: store, error: storeError } = await supabase
      .from("shopify_stores")
      .select("*")
      .eq("id", storeId)
      .eq("user_id", user.id)
      .single();

    if (storeError || !store) {
      return new Response(
        JSON.stringify({ error: "Store not found or access denied" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
      );
    }

    // Generate a sample audit report (In a real app, you would crawl the store and analyze it)
    // For demo purposes, we're creating mock data
    const auditReport: WebsiteSEOAudit = generateSampleAudit(store.store_url);
    
    // Ensure all issues and optimizations have an ID
    auditReport.issues = auditReport.issues.map(issue => ({
      ...issue,
      id: crypto.randomUUID()
    }));
    
    auditReport.optimizations = auditReport.optimizations.map(opt => ({
      ...opt,
      id: crypto.randomUUID()
    }));
    
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
      return new Response(
        JSON.stringify({ error: "Failed to store audit report" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    // Add the database ID to the response
    auditReport.id = insertedAudit.id;
    
    return new Response(
      JSON.stringify(auditReport),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Error in site audit function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
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
  
  return {
    id: crypto.randomUUID(),
    store_id: '',  // This will be filled in later
    created_at: new Date().toISOString(),
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
