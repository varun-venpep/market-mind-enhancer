
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Edit, Save, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { ContentBrief } from "@/types";

interface BriefHeaderProps {
  brief: ContentBrief;
  score: number;
}

export const BriefHeader = ({ brief, score }: BriefHeaderProps) => {
  const { title, status, createdAt, updatedAt } = brief;
  
  const getStatusColor = () => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-amber-500";
      case "draft":
        return "bg-muted";
      default:
        return "bg-muted";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "draft":
        return "Draft";
      default:
        return "Unknown";
    }
  };

  const getScoreColor = () => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-amber-600";
    return "text-red-600";
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="sm" asChild className="group">
          <Link to="/dashboard/briefs">
            <ArrowLeft className="h-4 w-4 mr-1 transition-transform group-hover:-translate-x-1" />
            Back to Briefs
          </Link>
        </Button>
        <div className="flex-1"></div>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Button variant="outline" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button size="sm" className="gradient-button">
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className={`${getStatusColor()} hover:${getStatusColor()}`}>
              {getStatusText()}
            </Badge>
            <div className="text-sm text-muted-foreground">
              Score: <span className={`font-medium ${getScoreColor()}`}>{score}/100</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Created: {formatDate(createdAt)}</span>
            <span className="mx-1">•</span>
            <span>Updated: {formatDate(updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
