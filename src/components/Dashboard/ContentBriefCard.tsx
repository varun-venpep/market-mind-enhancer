
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Target, Layers } from "lucide-react";
import { ContentBrief } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface ContentBriefCardProps {
  brief: ContentBrief;
  onClick: () => void;
}

export const ContentBriefCard = ({ brief, onClick }: ContentBriefCardProps) => {
  const getStatusColor = () => {
    switch (brief.status) {
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
    switch (brief.status) {
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

  const updatedAt = formatDistanceToNow(new Date(brief.updatedAt), { addSuffix: true });

  return (
    <Card 
      className="overflow-hidden transition-all hover:shadow-md cursor-pointer h-full flex flex-col hover:border-brand-200"
      onClick={onClick}
    >
      <CardHeader className="p-4 pb-0 flex justify-between">
        <Badge className={`${getStatusColor()} hover:${getStatusColor()}`}>{getStatusText()}</Badge>
      </CardHeader>
      <CardContent className="p-4 pt-2 flex-1">
        <h3 className="text-lg font-semibold line-clamp-2 mb-2">{brief.title}</h3>
        <div className="flex flex-wrap gap-1 mb-3">
          {brief.keywords.slice(0, 3).map((keyword, index) => (
            <Badge key={index} variant="outline" className="text-xs font-normal">
              {keyword}
            </Badge>
          ))}
          {brief.keywords.length > 3 && (
            <Badge variant="outline" className="text-xs font-normal">
              +{brief.keywords.length - 3} more
            </Badge>
          )}
        </div>

        {brief.score !== undefined && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-muted-foreground">Content Score</span>
              <span className="text-xs font-medium">{brief.score}/100</span>
            </div>
            <Progress value={brief.score} className="h-1.5" />
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 text-xs text-muted-foreground border-t">
        <div className="flex justify-between w-full">
          <div className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>{updatedAt}</span>
          </div>
          {brief.wordCount && (
            <div className="flex items-center">
              <Layers className="h-3 w-3 mr-1" />
              <span>{brief.wordCount} words</span>
            </div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
