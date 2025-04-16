
import { FileText, Bookmark, Clock } from "lucide-react";
import { StatusIcon } from "./StatusIcon";

interface ArticleMetadataProps {
  wordCount?: number;
  score?: number;
  status: string;
  updatedAt: string;
}

export const ArticleMetadata = ({ wordCount, score, status, updatedAt }: ArticleMetadataProps) => {
  return (
    <div className="flex gap-4 flex-wrap text-sm text-muted-foreground">
      {wordCount && (
        <div className="flex items-center gap-1">
          <FileText className="h-4 w-4" />
          <span>{wordCount} words</span>
        </div>
      )}
      {score && (
        <div className="flex items-center gap-1">
          <Bookmark className="h-4 w-4" />
          <span>SEO Score: {score}/100</span>
        </div>
      )}
      <div className="flex items-center gap-1">
        <StatusIcon status={status} />
        <span>Status: {status}</span>
      </div>
      <div className="flex items-center gap-1">
        <Clock className="h-4 w-4" />
        <span>Last Updated: {new Date(updatedAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
};
