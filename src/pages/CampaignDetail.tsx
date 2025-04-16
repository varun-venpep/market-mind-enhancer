import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetchCampaign, fetchCampaignArticles, deleteCampaign } from '@/services/articles';
import { Campaign, Article } from '@/types';
import CampaignHeader from '@/components/Campaigns/CampaignHeader';
import DeleteCampaignDialog from '@/components/Campaigns/DeleteCampaignDialog';
import CampaignArticlesList from '@/components/Campaigns/CampaignArticlesList';

const CampaignDetail = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  useEffect(() => {
    const loadCampaignAndArticles = async () => {
      if (!campaignId) return;
      
      try {
        setIsLoading(true);
        const campaignData = await fetchCampaign(campaignId);
        const articlesData = await fetchCampaignArticles(campaignId);
        
        setCampaign(campaignData);
        setArticles(articlesData);
      } catch (error) {
        console.error("Error loading campaign and articles:", error);
        toast.error("Failed to load campaign details");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCampaignAndArticles();
  }, [campaignId]);
  
  const handleCreateArticle = () => {
    navigate(`/dashboard/article-generator?campaignId=${campaignId}`);
  };
  
  const handleGoBack = () => {
    navigate('/dashboard/campaigns');
  };

  const handleDeleteCampaign = async () => {
    if (!campaign) return;
    
    try {
      setIsDeleting(true);
      await deleteCampaign(campaignId!);
      toast.success("Campaign deleted successfully");
      navigate('/dashboard/campaigns');
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast.error("Failed to delete campaign");
      setIsDeleting(false);
    }
  };

  const handleArticleDeleted = async () => {
    if (!campaignId) return;
    
    try {
      const articlesData = await fetchCampaignArticles(campaignId);
      setArticles(articlesData);
    } catch (error) {
      console.error("Error refreshing campaign articles:", error);
      toast.error("Failed to refresh articles");
    }
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

  if (!campaign) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleGoBack}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Campaigns
            </Button>
          </div>
          
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Campaign Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The campaign you are looking for does not exist or has been deleted.
            </p>
            <Button onClick={handleGoBack}>
              Go to Campaigns
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <CampaignHeader 
          campaign={campaign}
          onGoBack={handleGoBack}
          onCreateArticle={handleCreateArticle}
          onDeleteClick={() => setShowDeleteDialog(true)}
        />
        
        <CampaignArticlesList 
          articles={articles}
          onCreateArticle={handleCreateArticle}
          onArticleDeleted={handleArticleDeleted}
        />

        <DeleteCampaignDialog 
          isOpen={showDeleteDialog}
          isDeleting={isDeleting}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDeleteCampaign}
        />
      </div>
    </DashboardLayout>
  );
};

export default CampaignDetail;
