
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { fetchArticles } from '@/services/articles';
import { Article } from '@/types';
import ArticlePreview from '@/components/Articles/ArticlePreview';

const Articles = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadArticles = async () => {
      try {
        setIsLoading(true);
        const data = await fetchArticles();
        setArticles(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
        toast.error("Failed to load articles");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadArticles();
  }, []);
  
  const handleCreateArticle = () => {
    navigate('/dashboard/article-generator');
  };
  
  const handleArticleDeleted = () => {
    // Refresh the article list
    fetchArticles()
      .then(data => setArticles(data))
      .catch(error => {
        console.error("Error refreshing articles:", error);
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

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Articles</h1>
          <Button onClick={handleCreateArticle}>
            <Plus className="h-4 w-4 mr-2" />
            Create Article
          </Button>
        </div>
        
        {articles.length === 0 ? (
          <Card className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">No Articles Yet</h2>
            <p className="text-muted-foreground mb-6">
              Get started by creating your first article.
            </p>
            <Button onClick={handleCreateArticle}>
              Create Your First Article
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticlePreview 
                key={article.id} 
                article={article} 
                onDeleted={handleArticleDeleted}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Articles;
