
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Article } from '@/types';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteArticle } from '@/services/articleService';

interface ArticlePreviewProps {
  article: Article;
  onDeleted?: () => void;
  showActions?: boolean;
}

export default function ArticlePreview({ 
  article, 
  onDeleted,
  showActions = true 
}: ArticlePreviewProps) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Calculate truncated content
  const truncatedContent = article.content 
    ? article.content.substring(0, 200) + (article.content.length > 200 ? '...' : '')
    : 'No content available';
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    navigate(`/dashboard/article-editor/${article.id}`);
  };
  
  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    navigate(`/dashboard/articles/${article.id}`);
  };
  
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    
    if (window.confirm('Are you sure you want to delete this article?')) {
      setIsDeleting(true);
      try {
        await deleteArticle(article.id);
        toast.success('Article deleted successfully');
        if (onDeleted) onDeleted();
      } catch (error) {
        console.error('Error deleting article:', error);
        toast.error('Failed to delete article');
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  const handleCardClick = () => {
    navigate(`/dashboard/articles/${article.id}`);
  };
  
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-all cursor-pointer" onClick={handleCardClick}>
      <CardContent className="p-4 flex flex-col h-full">
        {article.thumbnail_url && (
          <div className="aspect-video mb-4 overflow-hidden rounded-md">
            <img 
              src={article.thumbnail_url} 
              alt={article.title} 
              className="w-full h-full object-cover transition-transform hover:scale-105"
              onClick={(e) => {
                e.stopPropagation();
                handleView(e);
              }}
            />
          </div>
        )}
        
        <h3 className="text-xl font-semibold mb-2 line-clamp-2 hover:text-primary">
          {article.title}
        </h3>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {article.keywords?.slice(0, 3).map((keyword, index) => (
            <span key={index} className="text-xs bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
              {keyword}
            </span>
          ))}
          {article.keywords && article.keywords.length > 3 && (
            <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
              +{article.keywords.length - 3} more
            </span>
          )}
        </div>
        
        <div className="text-sm text-muted-foreground mb-3 flex-grow">
          <div dangerouslySetInnerHTML={{ 
            __html: truncatedContent.replace(/\n/g, '<br/>').replace(/#+ /g, '') 
          }} />
        </div>
        
        <div className="mt-auto pt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex gap-3">
            {article.word_count && (
              <span>{article.word_count} words</span>
            )}
            {article.score && (
              <span>Score: {article.score}/100</span>
            )}
          </div>
          
          {showActions && (
            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" onClick={handleView} title="View">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleEdit} title="Edit">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isDeleting} title="Delete">
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin text-destructive" />
                ) : (
                  <Trash className="h-4 w-4 text-destructive" />
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
