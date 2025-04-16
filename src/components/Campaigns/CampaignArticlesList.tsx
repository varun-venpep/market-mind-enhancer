
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Article } from '@/types';
import { ChevronRight } from "lucide-react";
import ArticlePreview from '@/components/Articles/ArticlePreview';

interface CampaignArticlesListProps {
  articles: Article[];
  onArticleDeleted: (articleId: string) => void;
}

const CampaignArticlesList: React.FC<CampaignArticlesListProps> = ({ articles, onArticleDeleted }) => {
  if (articles.length === 0) {
    return (
      <Card className="p-8 text-center mt-6">
        <h2 className="text-xl font-semibold mb-4">No Articles Yet</h2>
        <p className="text-muted-foreground mb-6">
          Get started by creating your first article in this campaign.
        </p>
      </Card>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Articles ({articles.length})</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticlePreview 
            key={article.id} 
            article={article}
            onDeleted={() => onArticleDeleted(article.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default CampaignArticlesList;
