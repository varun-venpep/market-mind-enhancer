
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Send an event to Zapier webhook
 * @param eventName The name of the event to send
 * @param payload Data to send with the event
 * @returns Whether the event was successfully sent
 */
export const sendZapierEvent = async (
  eventName: string, 
  payload: Record<string, any>
): Promise<boolean> => {
  try {
    // Get the user's Zapier integration
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      console.error('User not authenticated');
      return false;
    }
    
    // Use type assertion to bypass TypeScript error
    const { data: integrations, error } = await (supabase as any)
      .from('integrations')
      .select('credentials')
      .eq('user_id', user.user.id)
      .eq('type', 'zapier')
      .maybeSingle();
    
    if (error || !integrations?.credentials?.webhook_url) {
      console.error('No Zapier webhook URL found:', error);
      return false;
    }
    
    const webhookUrl = integrations.credentials.webhook_url;
    
    // Send the event to the webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: eventName,
        timestamp: new Date().toISOString(),
        ...payload
      }),
      mode: 'no-cors', // Handle CORS issues
    });
    
    // Since we're using no-cors, we won't get a proper response
    console.log('Zapier webhook triggered for event:', eventName);
    return true;
  } catch (error) {
    console.error('Error sending Zapier event:', error);
    return false;
  }
};

/**
 * Create a Zapier Edge Function to handle webhook requests
 * @param webhookUrl The Zapier webhook URL to trigger
 * @param payload Data to send with the webhook
 * @returns Response from the edge function
 */
export const triggerZapierWebhook = async (
  webhookUrl: string,
  payload: Record<string, any>
): Promise<boolean> => {
  try {
    if (!webhookUrl) {
      toast.error('Webhook URL is required');
      return false;
    }
    
    // Prepare the payload
    const webhookPayload = {
      url: webhookUrl,
      data: {
        source: 'MarketMind SEO',
        timestamp: new Date().toISOString(),
        ...payload
      }
    };
    
    // Send the request directly to the webhook URL
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(webhookPayload.data),
      mode: 'no-cors' // Handle CORS issues
    });
    
    // Since we're using no-cors, assume success
    toast.success('Webhook triggered successfully');
    return true;
  } catch (error) {
    console.error('Error triggering webhook:', error);
    toast.error('Failed to trigger webhook');
    return false;
  }
};
