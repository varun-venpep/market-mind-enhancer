
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { fetchCampaign, fetchCampaignArticles, createArticle, deleteArticle } from '@/services/articleService';
import { Campaign, Article } from '@/types';
import { ArrowLeft, Plus, FileText, AlertCircle, Loader2, X, Trash2 } from 'lucide-react';
import ArticlePreview from '@/components/Articles/ArticlePreview';

const CampaignDetail = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newArticleTitle, setNewArticleTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<Article | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!campaignId) return;
    
    const loadCampaignData = async () => {
      try {
        setLoading(true);
        const campaignData = await fetchCampaign(campaignId);
        
        if (!campaignData) {
          toast.error("Campaign not found");
          navigate("/dashboard/campaigns");
          return;
        }
        
        setCampaign(campaignData);
        
        const articlesData = await fetchCampaignArticles(campaignId);
        setArticles(articlesData);
        
      } catch (error) {
        console.error("Error loading campaign:", error);
        toast.error("Failed to load campaign data");
      } finally {
        setLoading(false);
      }
    };
    
    loadCampaignData();
  }, [campaignId, navigate]);

  const handleCreateArticle = async () => {
    if (!newArticleTitle.trim()) {
      toast.error("Please enter a title for the article");
      return;
    }
    
    setIsCreating(true);
    
    try {
      const article = await createArticle({
        title: newArticleTitle,
        campaign_id: campaignId!,
        status: 'draft'
      });
      
      // Add the new article to the list
      setArticles(prev => [article, ...prev]);
      
      setShowNewDialog(false);
      setNewArticleTitle('');
      
      toast.success("Article created successfully");
      
      // Navigate to the article editor
      navigate(`/dashboard/article-editor/${article.id}`);
      
    } catch (error) {
      console.error("Error creating article:", error);
      toast.error("Failed to create article");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteArticle = async () => {
    if (!articleToDelete) return;
    
    setIsDeleting(true);
    
    try {
      await deleteArticle(articleToDelete.id);
      
      // Remove the deleted article from the list
      setArticles(prev => prev.filter(a => a.id !== articleToDelete.id));
      
      setShowDeleteDialog(false);
      setArticleToDelete(null);
      
      toast.success("Article deleted successfully");
      
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Failed to delete article");
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDeleteArticle = (article: Article) => {
    setArticleToDelete(article);
    setShowDeleteDialog(true);
  };

  const goToGenerateArticle = () => {
    navigate("/dashboard/article-generator", { state: { campaignId } });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <div className="flex items-center gap-2 mb-8">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </div>
          
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!campaign) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h2 className="text-xl font-semibold mb-2">Campaign Not Found</h2>
              <p className="text-muted-foreground mb-4">The campaign you are looking for does not exist or has been deleted.</p>
              <Button onClick={() => navigate("/dashboard/campaigns")}>
                Go to Campaigns
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/dashboard/campaigns")}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Campaigns
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">{campaign.name}</h1>
            {campaign.description && (
              <p className="text-muted-foreground mt-1">{campaign.description}</p>
            )}
          </div>
          
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button onClick={goToGenerateArticle} className="gradient-button">
              <Plus className="h-4 w-4 mr-2" />
              Generate AI Article
            </Button>
            <DialogTrigger asChild onClick={() => setShowNewDialog(true)}>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                New Article
              </Button>
            </DialogTrigger>
          </div>
        </div>
        
        {articles.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
              <h2 className="text-xl font-semibold mb-2">No Articles Yet</h2>
              <p className="text-muted-foreground mb-6">This campaign doesn't have any articles. Get started by creating your first article.</p>
              
              <div className="flex gap-4">
                <Button onClick={goToGenerateArticle} className="gradient-button">
                  <Plus className="h-4 w-4 mr-2" />
                  Generate AI Article
                </Button>
                <DialogTrigger asChild onClick={() => setShowNewDialog(true)}>
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    New Article
                  </Button>
                </DialogTrigger>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map(article => (
              <ArticlePreview 
                key={article.id} 
                article={article} 
                onDeleted={() => confirmDeleteArticle(article)}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* New Article Dialog */}
      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Article</DialogTitle>
            <DialogDescription>
              Enter a title for your new article. You can edit the content later.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <Input 
              placeholder="Article Title"
              value={newArticleTitle}
              onChange={e => setNewArticleTitle(e.target.value)}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateArticle} disabled={isCreating}>
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
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this article? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {articleToDelete && (
              <Card>
                <CardContent className="py-4">
                  <h3 className="font-semibold">{articleToDelete.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {articleToDelete.keywords?.slice(0, 3).map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteArticle}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Article
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default CampaignDetail;
