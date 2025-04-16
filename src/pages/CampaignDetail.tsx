
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { fetchCampaign, fetchCampaignArticles, deleteCampaign } from '@/services/articles/campaigns';
import { createArticle } from '@/services/articles';
import { Campaign, Article } from '@/types';
import CampaignHeader from '@/components/Campaigns/CampaignHeader';
import CampaignArticlesList from '@/components/Campaigns/CampaignArticlesList';
import { DeleteCampaignDialog } from '@/components/Campaigns/DeleteCampaignDialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CampaignDetail = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newArticleTitle, setNewArticleTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const loadCampaignData = async () => {
      if (!campaignId) return;
      
      try {
        setIsLoading(true);
        // Fetch campaign details
        const campaignData = await fetchCampaign(campaignId);
        if (!campaignData) {
          toast.error("Campaign not found");
          navigate('/dashboard/campaigns');
          return;
        }
        setCampaign(campaignData);
        
        // Fetch articles for this campaign
        const articlesData = await fetchCampaignArticles(campaignId);
        setArticles(articlesData);
      } catch (error) {
        console.error("Error loading campaign data:", error);
        toast.error("Failed to load campaign data");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCampaignData();
  }, [campaignId, navigate]);

  const handleGoBack = () => {
    navigate('/dashboard/campaigns');
  };

  const handleDeleteCampaign = async () => {
    if (!campaign || !campaignId) return;
    
    try {
      setIsDeleting(true);
      await deleteCampaign(campaignId);
      toast.success("Campaign deleted successfully");
      navigate('/dashboard/campaigns');
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast.error("Failed to delete campaign");
      setIsDeleting(false);
    }
  };

  const handleCreateArticle = async () => {
    if (!campaign || !campaignId || !newArticleTitle.trim()) return;
    
    try {
      setIsCreating(true);
      const newArticle = await createArticle({
        title: newArticleTitle,
        campaign_id: campaignId,
        status: 'draft',
        keywords: []
      });
      
      setArticles([newArticle, ...articles]);
      setNewArticleTitle('');
      setShowCreateDialog(false);
      toast.success("Article created successfully");
      
      // Navigate to the article editor
      navigate(`/dashboard/article-editor/${newArticle.id}`);
    } catch (error) {
      console.error("Error creating article:", error);
      toast.error("Failed to create article");
    } finally {
      setIsCreating(false);
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
        <div className="container mx-auto py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Campaign Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The campaign you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={handleGoBack}>
            Go Back to Campaigns
          </Button>
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
          onCreateArticle={() => setShowCreateDialog(true)}
          onDeleteClick={() => setShowDeleteDialog(true)}
        />

        <CampaignArticlesList 
          articles={articles} 
          onArticleDeleted={(deletedId) => {
            setArticles(articles.filter(article => article.id !== deletedId));
          }}
        />

        {/* Delete Campaign Dialog */}
        <DeleteCampaignDialog 
          open={showDeleteDialog} 
          onOpenChange={setShowDeleteDialog}
          isDeleting={isDeleting}
          onConfirmDelete={handleDeleteCampaign}
          campaignName={campaign.name}
        />

        {/* Create Article Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Article</DialogTitle>
              <DialogDescription>
                Add a new article to the "{campaign.name}" campaign
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <Label htmlFor="article-title">Article Title</Label>
              <Input
                id="article-title"
                value={newArticleTitle}
                onChange={(e) => setNewArticleTitle(e.target.value)}
                placeholder="Enter article title"
                className="mt-1"
              />
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateArticle} 
                disabled={isCreating || !newArticleTitle.trim()}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Article'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default CampaignDetail;
