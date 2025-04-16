
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Trash } from "lucide-react";
import { Campaign } from "@/types";

interface CampaignHeaderProps {
  campaign: Campaign;
  onGoBack: () => void;
  onCreateArticle: () => void;
  onDeleteClick: () => void;
}

const CampaignHeader: React.FC<CampaignHeaderProps> = ({
  campaign,
  onGoBack,
  onCreateArticle,
  onDeleteClick,
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onGoBack}
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Campaigns
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{campaign.name}</h1>
          <p className="text-muted-foreground">
            {campaign.description || 'No description provided.'}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={onCreateArticle}>
          <Plus className="h-4 w-4 mr-2" />
          Create Article
        </Button>
        <Button variant="destructive" onClick={onDeleteClick}>
          <Trash className="h-4 w-4 mr-2" />
          Delete Campaign
        </Button>
      </div>
    </div>
  );
};

export default CampaignHeader;
