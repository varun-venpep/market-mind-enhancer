
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.1.1'
import { corsHeaders } from '../_shared/cors.ts'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || ''
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || ''
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { admin_id, plan, subscription_status, trial_ends_at, stripe_customer_id } = await req.json()
    
    if (!admin_id) {
      return new Response(
        JSON.stringify({ error: 'Admin ID is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Update the admin's profile
    const { error } = await supabase
      .from('profiles')
      .update({
        plan,
        subscription_status,
        trial_ends_at,
        stripe_customer_id
      })
      .eq('id', admin_id)

    if (error) {
      console.error('Error updating profile:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to update admin profile' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500
        }
      )
    }

    // Return success
    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Admin profile update error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
