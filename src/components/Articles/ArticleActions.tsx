
import { Button } from "@/components/ui/button";
import { Share, Edit, Trash, Loader2 } from "lucide-react";

interface ArticleActionsProps {
  onShare: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export const ArticleActions = ({ onShare, onEdit, onDelete, isDeleting }: ArticleActionsProps) => {
  return (
    <div className="flex gap-2 mt-4 md:mt-0">
      <Button 
        variant="outline" 
        onClick={onShare}
        className="flex items-center gap-1"
      >
        <Share className="h-4 w-4" />
        Share
      </Button>
      <Button 
        variant="outline"
        onClick={onEdit}
        className="flex items-center gap-1"
      >
        <Edit className="h-4 w-4" />
        Edit
      </Button>
      <Button 
        variant="destructive"
        onClick={onDelete}
        disabled={isDeleting}
        className="flex items-center gap-1"
      >
        {isDeleting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash className="h-4 w-4" />
        )}
        Delete
      </Button>
    </div>
  );
};
