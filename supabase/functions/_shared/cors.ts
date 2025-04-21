
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
}

// Utility for CORS and sending JSON
export function sendResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    headers: corsHeaders,
    status,
  });
}
