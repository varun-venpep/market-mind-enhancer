
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Edit, Trash2, Eye, ArrowRightIcon } from "lucide-react";
import { Article } from "@/types";
import { formatDate } from "@/lib/utils";

interface ArticlePreviewProps {
  article: Article;
  onDeleted?: () => void;
}

const ArticlePreview = ({ article, onDeleted }: ArticlePreviewProps) => {
  const navigate = useNavigate();

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/dashboard/article-editor/${article.id}`);
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`/dashboard/article-preview/${article.id}`, "_blank");
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeleted) onDeleted();
  };

  const handleCardClick = () => {
    navigate(`/dashboard/article-editor/${article.id}`);
  };

  // Define status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
          <Badge className={`${getStatusColor(article.status)} capitalize ml-2`}>
            {article.status?.replace("-", " ")}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pb-4 flex-grow">
        {article.thumbnail_url ? (
          <div className="mb-4 aspect-video overflow-hidden rounded-md border">
            <img
              src={article.thumbnail_url}
              alt={article.title}
              className="h-full w-full object-cover transition-all hover:scale-105"
            />
          </div>
        ) : (
          <div className="mb-4 aspect-video overflow-hidden rounded-md border bg-muted flex items-center justify-center">
            <span className="text-sm text-muted-foreground">No thumbnail</span>
          </div>
        )}

        <div className="flex items-center text-sm text-muted-foreground space-x-4">
          <div className="flex items-center">
            <Calendar className="mr-1 h-3.5 w-3.5" />
            <span>{formatDate(article.created_at)}</span>
          </div>
          {article.word_count && (
            <div>
              <span>{article.word_count} words</span>
            </div>
          )}
        </div>

        <div className="mt-2 flex flex-wrap gap-1">
          {article.keywords?.slice(0, 3).map((keyword, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {keyword}
            </Badge>
          ))}
          {article.keywords && article.keywords.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{article.keywords.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0 border-t justify-between">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleEdit}
            title="Edit article"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={handleView}
            title="Preview article"
          >
            <Eye className="h-4 w-4" />
          </Button>
          {onDeleted && (
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-destructive hover:bg-destructive/10"
              onClick={handleDelete}
              title="Delete article"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center">
          {article.score ? (
            <Badge
              variant="outline"
              className={`text-xs ${
                article.score >= 80
                  ? "bg-green-50 text-green-600 border-green-200"
                  : article.score >= 60
                  ? "bg-yellow-50 text-yellow-600 border-yellow-200"
                  : "bg-red-50 text-red-600 border-red-200"
              }`}
            >
              SEO Score: {article.score}
            </Badge>
          ) : null}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ArticlePreview;
