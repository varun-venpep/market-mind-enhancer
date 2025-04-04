
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Target, Layers, Edit } from "lucide-react";
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
        return "bg-green-500 hover:bg-green-600";
      case "in-progress":
        return "bg-amber-500 hover:bg-amber-600";
      case "draft":
        return "bg-muted hover:bg-muted/80";
      default:
        return "bg-muted hover:bg-muted/80";
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

  const getAIPotentialColor = () => {
    if (!brief.aiPotential) return "bg-gray-100 dark:bg-gray-800";
    
    if (brief.aiPotential >= 80) return "bg-green-100 dark:bg-green-900/30";
    if (brief.aiPotential >= 60) return "bg-amber-100 dark:bg-amber-900/30";
    return "bg-red-100 dark:bg-red-900/30";
  };

  const updatedAt = formatDistanceToNow(new Date(brief.updatedAt), { addSuffix: true });

  return (
    <Card 
      className="overflow-hidden transition-all hover:shadow-md cursor-pointer h-full flex flex-col hover:border-brand-200 relative group"
      onClick={onClick}
    >
      {brief.thumbnailUrl && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-black/60 p-2 rounded-full">
              <Edit className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      )}
      
      {brief.thumbnailUrl ? (
        <div 
          className="h-40 bg-cover bg-center border-b" 
          style={{ backgroundImage: `url(${brief.thumbnailUrl})` }}
        />
      ) : (
        <div className="h-24 bg-gradient-to-r from-brand-50 to-blue-50 dark:from-brand-950/40 dark:to-blue-950/40 flex items-center justify-center border-b">
          <div className="text-6xl font-bold text-brand-200 dark:text-brand-800 opacity-30">
            {brief.title.charAt(0)}
          </div>
        </div>
      )}
      
      <CardHeader className="p-4 pb-0 flex justify-between">
        <Badge className={`${getStatusColor()}`}>{getStatusText()}</Badge>
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
        
        {brief.aiPotential !== undefined && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-muted-foreground">AI Potential</span>
              <span className="text-xs font-medium">{brief.aiPotential}%</span>
            </div>
            <div className={`h-1.5 rounded-full ${getAIPotentialColor()}`}>
              <div 
                className="h-full bg-brand-500 rounded-full" 
                style={{width: `${brief.aiPotential}%`}}
              />
            </div>
          </div>
        )}
        
        {brief.searchVolume !== undefined && (
          <div className="text-xs text-muted-foreground flex items-center mb-1">
            <Target className="h-3 w-3 mr-1" />
            <span>{brief.searchVolume.toLocaleString()} monthly searches</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 text-xs text-muted-foreground border-t bg-muted/10">
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
