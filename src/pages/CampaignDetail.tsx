
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
import { toast } from "sonner";
import { fetchCampaign, fetchCampaignArticles, deleteCampaign, deleteArticle } from '@/services/articles';
import { Campaign, Article } from '@/types';
import { formatDate, truncateText } from '@/lib/utils';
import { Link } from 'react-router-dom';

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
    if (!campaign || !window.confirm("Are you sure you want to delete this campaign? All associated articles will also be deleted.")) return;
    
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

  const handleDeleteArticle = async (articleId: string) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    
    try {
      await deleteArticle(articleId);
      toast.success("Article deleted successfully");
      setArticles(articles.filter(article => article.id !== articleId));
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Failed to delete article");
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
            <Button 
              variant="destructive" 
              onClick={handleDeleteCampaign}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash className="h-4 w-4" />}
              Delete Campaign
            </Button>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Articles</h2>
            {articles.length === 0 ? (
              <p className="text-muted-foreground">No articles found for this campaign.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {articles.map((article) => (
                  <Card key={article.id} className="bg-card text-card-foreground shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{truncateText(article.title, 50)}</h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/dashboard/article-editor/${article.id}`)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/dashboard/article/${article.id}`)}>
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteArticle(article.id)}>
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Updated: {formatDate(article.updated_at)}
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/dashboard/article-editor/${article.id}`)}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => navigate(`/dashboard/article/${article.id}`)}
                        >
                          View Article
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
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
