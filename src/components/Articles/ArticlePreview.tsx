
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Article } from '@/types';
import { Edit, Eye, Trash2, Calendar, Bookmark } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ArticlePreviewProps {
  article: Article;
  onDeleted?: () => void;
}

const ArticlePreview = ({ article, onDeleted }: ArticlePreviewProps) => {
  const navigate = useNavigate();
  
  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/dashboard/article/${article.id}`);
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/dashboard/article-editor/${article.id}`);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleted) {
      onDeleted();
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="line-clamp-2 cursor-pointer" onClick={handleView}>
          {article.title}
        </CardTitle>
        <div className="flex flex-wrap gap-1 mt-2">
          {article.keywords?.slice(0, 3).map((keyword, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {keyword}
            </Badge>
          ))}
          {article.keywords?.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{article.keywords.length - 3} more
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <Calendar className="h-4 w-4 mr-1" />
            <span>
              {formatDate(article.updated_at)}
            </span>
          </div>
          <Badge variant="outline" className={`
            ${article.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
            ${article.status === 'draft' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : ''}
            ${article.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' : ''}
          `}>
            {article.status === 'completed' ? 'Completed' : 
             article.status === 'in-progress' ? 'In Progress' : 'Draft'}
          </Badge>
        </div>
        
        {article.score && (
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            <Bookmark className="h-4 w-4 mr-1" />
            <span>SEO Score: {article.score}/100</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-1">
        <div className="flex gap-2 w-full">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1"
            onClick={handleView}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1"
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 text-destructive hover:text-destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ArticlePreview;
