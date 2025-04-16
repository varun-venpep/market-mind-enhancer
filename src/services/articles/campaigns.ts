
import { supabase } from "@/integrations/supabase/client";
import { Campaign, Article } from "@/types";

export async function fetchUserCampaigns(): Promise<Campaign[]> {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data as Campaign[] || [];
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
}

export async function fetchCampaign(id: string): Promise<Campaign | null> {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .maybeSingle();
      
    if (error) throw error;
    return data as Campaign | null;
  } catch (error) {
    console.error('Error fetching campaign:', error);
    throw error;
  }
}

export async function createCampaign(name: string, description?: string): Promise<Campaign> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('You must be logged in to create a campaign');
    }
    
    const { data, error } = await supabase
      .from('campaigns')
      .insert({
        name,
        description,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (error) throw error;
    return data as Campaign;
  } catch (error) {
    console.error('Error creating campaign:', error);
    throw error;
  }
}

export async function fetchCampaignArticles(campaignId: string): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data as Article[] || [];
  } catch (error) {
    console.error('Error fetching campaign articles:', error);
    throw error;
  }
}
