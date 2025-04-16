
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { fetchArticle, deleteArticle } from '@/services/articles';
import { Article } from "@/types";
import { ArticleMetadata } from '@/components/Articles/ArticleMetadata';
import { ArticleActions } from '@/components/Articles/ArticleActions';
import { ArticleDetailSkeleton } from '@/components/Articles/ArticleDetailSkeleton';
import { ArticleNotFound } from '@/components/Articles/ArticleNotFound';

const ArticleDetail = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      if (!articleId) return;
      
      try {
        setIsLoading(true);
        const data = await fetchArticle(articleId);
        console.log("Loaded article:", data);
        setArticle(data);
      } catch (error) {
        console.error("Error loading article:", error);
        toast.error("Failed to load article");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadArticle();
  }, [articleId]);

  const handleEdit = () => {
    if (article) {
      navigate(`/dashboard/article-editor/${article.id}`);
    }
  };

  const handleDelete = async () => {
    if (!article || !window.confirm("Are you sure you want to delete this article?")) return;
    
    setIsDeleting(true);
    try {
      await deleteArticle(article.id);
      toast.success("Article deleted successfully");
      
      if (article.campaign_id) {
        navigate(`/dashboard/campaign/${article.campaign_id}`);
      } else {
        navigate("/dashboard/campaigns");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Failed to delete article");
      setIsDeleting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };
  
  const handleGoToCampaign = () => {
    if (article && article.campaign_id) {
      navigate(`/dashboard/campaign/${article.campaign_id}`);
    } else {
      navigate('/dashboard/campaigns');
    }
  };

  if (isLoading) {
    return <ArticleDetailSkeleton />;
  }

  if (!article) {
    return <ArticleNotFound />;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleGoToCampaign}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Campaign
          </Button>
        </div>
        
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">{article.title}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                {article.keywords?.map((keyword, index) => (
                  <span key={index} className="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full text-xs">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            <ArticleActions 
              onShare={handleShare}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isDeleting={isDeleting}
            />
          </div>
          
          <Card>
            <CardContent className="p-6">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {article.thumbnail_url && (
                  <img 
                    src={article.thumbnail_url} 
                    alt={article.title} 
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                )}
                <div dangerouslySetInnerHTML={{ __html: article.content?.replace(/\n/g, '<br/>') || 'No content available.' }} />
              </div>
            </CardContent>
          </Card>
          
          <ArticleMetadata 
            wordCount={article.word_count}
            score={article.score}
            status={article.status}
            updatedAt={article.updated_at}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ArticleDetail;
