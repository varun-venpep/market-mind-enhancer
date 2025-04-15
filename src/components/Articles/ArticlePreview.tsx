
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Article } from '@/types';
import { Eye, Edit, Clock, Trash2 } from 'lucide-react';

interface ArticlePreviewProps {
  article: Article;
  onSelect?: (article: Article) => void;
  compact?: boolean;
  onDeleted?: () => void;
}

const ArticlePreview: React.FC<ArticlePreviewProps> = ({ 
  article, 
  onSelect,
  compact = false,
  onDeleted
}) => {
  const navigate = useNavigate();
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  const handleView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/dashboard/articles/${article.id}`);
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/dashboard/article-editor/${article.id}`);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onDeleted) {
      onDeleted();
    }
  };
  
  const handleCardClick = () => {
    if (onSelect) {
      onSelect(article);
    } else {
      navigate(`/dashboard/articles/${article.id}`);
    }
  };
  
  // Extract the first paragraph for the preview
  const getContentPreview = (content: string | undefined, maxLength = 150) => {
    if (!content) return 'No content available.';
    
    // Get the first paragraph or a snippet
    const firstParagraph = content.split('\n\n')[0]?.replace(/[#*]/g, '');
    
    if (firstParagraph.length <= maxLength) return firstParagraph;
    return firstParagraph.substring(0, maxLength) + '...';
  };
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'in-progress':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'draft':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      default:
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
    }
  };

  return (
    <Card 
      className={`hover:shadow-md transition-shadow cursor-pointer border overflow-hidden ${compact ? 'h-full' : ''}`}
      onClick={handleCardClick}
    >
      {article.thumbnail_url && (
        <div className="relative h-40 w-full overflow-hidden">
          <img 
            src={article.thumbnail_url} 
            alt={article.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
          <div className="absolute top-2 right-2">
            <Badge 
              variant="outline" 
              className={getStatusBadgeColor(article.status)}
            >
              {article.status}
            </Badge>
          </div>
        </div>
      )}
      
      <CardContent className={`pt-4 ${compact ? 'pb-2' : 'pb-4'}`}>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg line-clamp-2">{article.title}</h3>
          </div>
          
          {!compact && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {getContentPreview(article.content)}
            </p>
          )}
          
          <div className="flex flex-wrap gap-2 mt-1">
            {article.keywords?.slice(0, compact ? 2 : 3).map((keyword, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {keyword}
              </Badge>
            ))}
            {article.keywords && article.keywords.length > (compact ? 2 : 3) && (
              <Badge variant="outline" className="text-xs">
                +{article.keywords.length - (compact ? 2 : 3)}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <Clock className="h-3 w-3 mr-1" />
            <span>{formatDate(article.updated_at)}</span>
            {article.word_count && (
              <span className="ml-2">{article.word_count} words</span>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className={`${compact ? 'pt-0 pb-3' : 'pt-0'} flex gap-2`}>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={handleView}
          className="flex-1 h-8"
        >
          <Eye className="h-3.5 w-3.5 mr-1" />
          <span className="text-xs">View</span>
        </Button>
        <Button 
          size="sm" 
          variant="ghost"
          onClick={handleEdit}
          className="flex-1 h-8"
        >
          <Edit className="h-3.5 w-3.5 mr-1" />
          <span className="text-xs">Edit</span>
        </Button>
        {onDeleted && (
          <Button 
            size="sm" 
            variant="ghost"
            onClick={handleDelete}
            className="flex-1 h-8 text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            <span className="text-xs">Delete</span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ArticlePreview;
