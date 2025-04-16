
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Edit, Trash2, Eye, Loader2 } from "lucide-react";
import { Article } from "@/types";
import { formatDate } from "@/lib/utils";
import { deleteArticle } from "@/services/articles";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface ArticlePreviewProps {
  article: Article;
  onDeleted?: () => void;
}

const ArticlePreview = ({ article, onDeleted }: ArticlePreviewProps) => {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/dashboard/article-editor/${article.id}`);
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/dashboard/article/${article.id}`);
  };

  const handleDelete = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    try {
      setIsDeleting(true);
      await deleteArticle(article.id);
      toast.success("Article deleted successfully");
      if (onDeleted) onDeleted();
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Failed to delete article");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCardClick = () => {
    navigate(`/dashboard/article/${article.id}`);
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
      case "published":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "scheduled":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
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
        ) : null}

        <div className="space-y-1">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-4 w-4" />
            {formatDate(article.updated_at)}
          </div>
          
          {article.keywords && article.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {article.keywords.slice(0, 3).map((keyword, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
              {article.keywords.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{article.keywords.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0 border-t mt-auto">
        <div className="flex justify-between w-full">
          <Button size="sm" variant="ghost" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button size="sm" variant="ghost" onClick={handleView}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="sm" variant="ghost" onClick={(e) => e.stopPropagation()}>
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  article.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ArticlePreview;
