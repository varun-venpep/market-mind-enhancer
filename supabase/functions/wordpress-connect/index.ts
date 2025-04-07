
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.1.1'
import { corsHeaders } from '../_shared/cors.ts'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || ''
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { siteUrl, username, apiKey, userId } = await req.json()
    
    if (!siteUrl || !username || !apiKey || !userId) {
      return new Response(
        JSON.stringify({ success: false, message: 'Missing required fields' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Validate WordPress credentials by fetching site info
    try {
      const wpUrl = new URL('/wp-json/wp/v2/users/me', siteUrl).toString()
      const credentials = btoa(`${username}:${apiKey}`)
      
      const response = await fetch(wpUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`WordPress API returned status: ${response.status}`)
      }
      
      const wpUser = await response.json()
      
      // Store WordPress connection in database
      const { error } = await supabase
        .from('integrations')
        .upsert({
          user_id: userId,
          type: 'wordpress',
          site_url: siteUrl,
          credentials: { username, api_key: apiKey },
          metadata: { 
            wp_user_id: wpUser.id,
            wp_username: wpUser.username,
            wp_name: wpUser.name,
            connected_at: new Date().toISOString()
          },
          created_at: new Date().toISOString()
        })
      
      if (error) throw error
      
      return new Response(
        JSON.stringify({ success: true, message: 'WordPress site connected successfully' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      )
    } catch (wpError) {
      console.error('WordPress API error:', wpError)
      return new Response(
        JSON.stringify({ success: false, message: 'Failed to connect to WordPress site. Please check your credentials.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }
  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
