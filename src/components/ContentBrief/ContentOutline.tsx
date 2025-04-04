
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, Edit, Grip, Plus, Trash2 } from "lucide-react";

interface OutlineItem {
  id: string;
  type: "h1" | "h2" | "h3" | "h4";
  text: string;
  score: number;
  children?: OutlineItem[];
}

interface ContentOutlineProps {
  outline: OutlineItem[] | any[];
  onUpdate?: (outline: OutlineItem[]) => void;
}

export const ContentOutline = ({ outline, onUpdate = () => {} }: ContentOutlineProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-amber-600";
    return "text-red-600";
  };

  const renderOutlineItem = (item: OutlineItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expanded[item.id] !== false; // default to expanded
    
    return (
      <li key={item.id} className="relative">
        <div className={`
          flex items-center gap-2 p-2 rounded-md hover:bg-muted/50 transition-colors
          ${level === 0 ? "bg-muted/30" : ""}
        `}>
          <div className="flex items-center gap-2 flex-1">
            <Grip className="h-4 w-4 text-muted-foreground cursor-move" />
            {hasChildren && (
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0"
                onClick={() => toggleExpand(item.id)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}
            <div className={`text-${item.type} flex-1 font-${item.type === 'h1' ? 'bold' : 'medium'}`}>
              {item.text}
            </div>
            <div className="flex items-center gap-1 ml-auto">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline" className={`${getScoreColor(item.score)}`}>
                      {item.score}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Content coverage score</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
              <ArrowUp className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
              <ArrowDown className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive/70 hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <ul className="pl-6 border-l border-border ml-4 mt-1 space-y-1">
            {item.children!.map(child => renderOutlineItem(child, level + 1))}
            <li>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground ml-2 mt-1"
              >
                <Plus className="h-3 w-3" />
                Add subsection
              </Button>
            </li>
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className="space-y-2">
      <ul className="space-y-2">
        {outline.map(item => renderOutlineItem(item))}
      </ul>
      <Button variant="ghost" size="sm" className="mt-2">
        <Plus className="h-4 w-4 mr-2" />
        Add Section
      </Button>
    </div>
  );
};
