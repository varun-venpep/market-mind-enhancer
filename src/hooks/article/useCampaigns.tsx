
import { useState, useEffect } from 'react';
import { fetchUserCampaigns } from '@/services/articles/campaigns';
import { Campaign } from '@/types';

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const campaignsData = await fetchUserCampaigns();
        setCampaigns(campaignsData);
        
        if (campaignsData.length > 0) {
          return campaignsData[0].id;
        }
        return null;
      } catch (error) {
        console.error("Error loading campaigns:", error);
        return null;
      }
    };
    
    loadCampaigns();
  }, []);

  return {
    campaigns
  };
}
