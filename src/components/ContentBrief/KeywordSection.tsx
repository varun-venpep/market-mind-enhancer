
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Search, ArrowUpRight, BarChart2, TrendingUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface KeywordSectionProps {
  keywords: string[];
  mainKeyword: string;
  searchVolume: number;
  difficulty: number;
  aiPotential: number;
}

export const KeywordSection = ({
  keywords,
  mainKeyword,
  searchVolume,
  difficulty,
  aiPotential
}: KeywordSectionProps) => {
  const getDifficultyLabel = (score: number) => {
    if (score < 40) return { label: "Easy", color: "text-green-600" };
    if (score < 60) return { label: "Medium", color: "text-amber-600" };
    return { label: "Hard", color: "text-red-600" };
  };

  const difficultyInfo = getDifficultyLabel(difficulty);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, i) => (
          <Badge 
            key={i} 
            variant={keyword === mainKeyword ? "default" : "secondary"}
            className={keyword === mainKeyword ? "bg-brand-500" : ""}
          >
            {keyword}
            {keyword === mainKeyword && (
              <span className="ml-1 text-xs bg-white/20 rounded px-1">Primary</span>
            )}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm font-medium mb-1">
            <Search className="h-4 w-4 text-muted-foreground" />
            Search Volume
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <TrendingUp className="h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Monthly search volume for this keyword</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="text-xl font-bold">{searchVolume.toLocaleString()}</div>
        </div>

        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm font-medium mb-1">
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
            Difficulty
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <TrendingUp className="h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">How hard it is to rank for this keyword</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center justify-between mb-1">
            <div className="text-xl font-bold">{difficulty}/100</div>
            <span className={`text-sm ${difficultyInfo.color}`}>{difficultyInfo.label}</span>
          </div>
          <Progress value={difficulty} className="h-1" />
        </div>

        <div className="bg-muted/30 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm font-medium mb-1">
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            AI Potential
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <TrendingUp className="h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Likelihood of ranking well in AI search engines</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center justify-between mb-1">
            <div className="text-xl font-bold">{aiPotential}/100</div>
            <span className="text-sm text-brand-600 font-medium">
              {aiPotential >= 85 ? "High" : aiPotential >= 70 ? "Medium" : "Low"}
            </span>
          </div>
          <Progress value={aiPotential} className="h-1 bg-muted" />
        </div>
      </div>
    </div>
  );
};
