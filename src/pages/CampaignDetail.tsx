
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeft, Loader2, MoreHorizontal, Pencil, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { fetchCampaign, fetchCampaignArticles, deleteCampaign, deleteArticle } from '@/services/articles';
import { Campaign, Article } from '@/types';
import { formatDate, truncateText } from '@/lib/utils';
import ArticlePreview from '@/components/Articles/ArticlePreview';

const CampaignDetail = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  
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

  const handleArticleDeleted = () => {
    // Refresh the article list after deletion
    if (!campaignId) return;
    
    fetchCampaignArticles(campaignId)
      .then(data => setArticles(data))
      .catch(error => {
        console.error("Error refreshing campaign articles:", error);
        toast.error("Failed to refresh articles");
      });
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleGoBack}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Campaigns
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{campaign.name}</h1>
              <p className="text-muted-foreground">{campaign.description || 'No description provided.'}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreateArticle}>
              <Plus className="h-4 w-4 mr-2" />
              Create Article
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash className="h-4 w-4 mr-2" />
                  Delete Campaign
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the campaign
                    and all associated articles.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteCampaign}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete Campaign"
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Articles</h2>
            {articles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No articles found for this campaign.</p>
                <Button onClick={handleCreateArticle}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Article
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                  <ArticlePreview 
                    key={article.id} 
                    article={article} 
                    onDeleted={handleArticleDeleted}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CampaignDetail;
