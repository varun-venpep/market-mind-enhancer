
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

interface WebResponse {
  status: number;
  data?: any;
  error?: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the admin key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get the user token from the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return Response.json(
        { error: 'No authorization header' },
        { status: 401, headers: { ...corsHeaders } }
      )
    }

    // Verify the user token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)

    if (userError || !user) {
      return Response.json(
        { error: 'Invalid token' },
        { status: 401, headers: { ...corsHeaders } }
      )
    }

    // Get the TinyMCE API key
    const tinyApiKey = Deno.env.get('TINY_API_KEY')
    if (!tinyApiKey) {
      return Response.json(
        { error: 'TinyMCE API key not configured' },
        { status: 500, headers: { ...corsHeaders } }
      )
    }

    const response: WebResponse = {
      status: 200,
      data: { key: tinyApiKey }
    }

    return Response.json(response, {
      headers: { ...corsHeaders }
    })
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500, headers: { ...corsHeaders } }
    )
  }
})
