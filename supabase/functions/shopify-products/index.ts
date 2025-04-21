
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { parseBody } from "./utils/parseBody.ts";
import { authenticate } from "./utils/authenticate.ts";
import { getStore } from "./utils/getStore.ts";
import { fetchShopifyProductsFromShopify } from "./utils/fetchShopifyProducts.ts";
import { sendResponse, corsHeaders } from "./utils/sendResponse.ts";

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  // Body parsing
  const parsed = await parseBody(req);
  if (parsed.error) {
    return sendResponse({ ...parsed.error, products: [], page: 1, limit: 20, total: 0 }, 400);
  }
  const { storeId, page = 1, limit = 20 } = parsed.body;

  if (!storeId) {
    return sendResponse({ error: 'Store ID is required', products: [], page, limit, total: 0 }, 400);
  }

  // Supabase credentials
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

  // Authenticate
  const auth = await authenticate(req, supabaseUrl, supabaseKey);
  if (auth.error) {
    return sendResponse({ error: auth.error, products: [], page, limit, total: 0 }, 401);
  }
  const supabase = auth.supabase;

  // Get store
  const { store, error: storeError } = await getStore(supabase, storeId);
  if (storeError) {
    return sendResponse({ error: "Error fetching store details", details: storeError.message, products: [], page, limit, total: 0 }, 500);
  }
  if (!store) {
    return sendResponse({ error: 'Store not found with ID: ' + storeId, products: [], page, limit, total: 0 }, 404);
  }
  if (!store.access_token) {
    return sendResponse({ error: 'Store access token is missing', products: [], page, limit, total: 0 }, 400);
  }

  // Fetch from Shopify
  const shopifyResult = await fetchShopifyProductsFromShopify(store, page, limit);
  return sendResponse(shopifyResult, 200);
});
