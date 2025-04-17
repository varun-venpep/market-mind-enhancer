
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { fetchUserCampaigns, createCampaign } from '@/services/articles';
import { Campaign } from '@/types';
import { formatDate, truncateText } from '@/lib/utils';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CreateCampaignDialog } from '@/components/Dashboard/CreateCampaignDialog';

const Campaigns = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  
  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setIsLoading(true);
        const data = await fetchUserCampaigns();
        setCampaigns(data);
        console.log("Loaded campaigns:", data);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        toast.error("Failed to load campaigns");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCampaigns();
  }, []);
  
  const handleCreateCampaign = async (name: string, description: string) => {
    if (!name.trim()) {
      toast.error("Campaign name is required");
      return;
    }
    
    try {
      setIsCreating(true);
      const newCampaign = await createCampaign(name, description);
      setCampaigns([newCampaign, ...campaigns]);
      setOpenDialog(false);
      toast.success("Campaign created successfully");
      // Navigate to the new campaign
      navigate(`/dashboard/campaign/${newCampaign.id}`);
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast.error("Failed to create campaign");
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleCampaignClick = (campaignId: string) => {
    console.log("Navigating to campaign:", campaignId);
    navigate(`/dashboard/campaigns/${campaignId}`);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8 flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Campaigns</h1>
          <Button onClick={() => setOpenDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
          
          <CreateCampaignDialog 
            open={openDialog}
            onOpenChange={setOpenDialog}
            onSubmit={handleCreateCampaign}
          />
        </div>
        
        {campaigns.length === 0 ? (
          <Card className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">No Campaigns Yet</h2>
            <p className="text-muted-foreground mb-6">
              Get started by creating your first campaign.
            </p>
            <Button onClick={() => setOpenDialog(true)}>
              Create Your First Campaign
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <Card 
                key={campaign.id} 
                className="cursor-pointer hover:shadow-md transition-all duration-200" 
                onClick={() => handleCampaignClick(campaign.id)}
              >
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-2">{campaign.name}</h2>
                  <p className="text-muted-foreground mb-4">
                    {truncateText(campaign.description || 'No description provided.', 100)}
                  </p>
                  <div className="text-sm text-muted-foreground">
                    Created: {formatDate(campaign.created_at)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Campaigns;
