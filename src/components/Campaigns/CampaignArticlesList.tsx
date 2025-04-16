
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Article } from "@/types";
import ArticlePreview from '@/components/Articles/ArticlePreview';

interface CampaignArticlesListProps {
  articles: Article[];
  onCreateArticle: () => void;
  onArticleDeleted: () => void;
}

const CampaignArticlesList: React.FC<CampaignArticlesListProps> = ({
  articles,
  onCreateArticle,
  onArticleDeleted,
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Articles</h2>
          <Button onClick={onCreateArticle} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Article
          </Button>
        </div>
        
        {articles.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No articles found for this campaign.
            </p>
            <Button onClick={onCreateArticle}>
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
                onDeleted={onArticleDeleted}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CampaignArticlesList;
