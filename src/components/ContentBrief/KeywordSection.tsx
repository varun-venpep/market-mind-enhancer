
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, PlusCircle, Star, Target, TrendingUp } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface KeywordSectionProps {
  keywords: string[];
  mainKeyword?: string;
  searchVolume?: number;
  difficulty?: number;
  aiPotential?: number;
  questions?: string[];
}

export const KeywordSection = ({ 
  keywords, 
  mainKeyword, 
  searchVolume, 
  difficulty, 
  aiPotential = 75,
  questions = [] 
}: KeywordSectionProps) => {
  const [activeTab, setActiveTab] = useState("keywords");

  return (
    <div className="space-y-4">
      <Tabs defaultValue="keywords" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="questions">User Questions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="keywords" className="space-y-4">
          <div className="flex flex-wrap gap-2 mt-2">
            {keywords.map((keyword, index) => (
              <Badge 
                key={index} 
                variant={index === 0 ? "default" : "secondary"}
                className="px-3 py-1.5 text-sm"
              >
                {keyword}
                {index === 0 && <Star className="ml-1 h-3 w-3" />}
              </Badge>
            ))}
            <Button variant="outline" size="sm" className="rounded-full px-3 h-8">
              <PlusCircle className="mr-1 h-3 w-3" /> Add
            </Button>
          </div>

          {mainKeyword && searchVolume && difficulty && (
            <Card className="mt-4">
              <CardContent className="p-4 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1 flex items-center">
                      Search Volume
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-3 w-3 ml-1" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-60 text-xs">
                              Monthly searches for this keyword
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="text-sm font-medium flex items-center">
                      <TrendingUp className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                      {searchVolume.toLocaleString()} monthly searches
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1 flex items-center">
                      Difficulty
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-3 w-3 ml-1" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-60 text-xs">
                              How difficult it is to rank for this keyword (0-100)
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div>
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span>{difficulty < 40 ? "Easy" : difficulty < 70 ? "Moderate" : "Difficult"}</span>
                        <span className="font-medium">{difficulty}/100</span>
                      </div>
                      <Progress value={difficulty} className="h-2" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1 flex items-center">
                      AI Ranking Potential
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <HelpCircle className="h-3 w-3 ml-1" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="w-60 text-xs">
                              Likelihood of ranking well with AI-optimized content
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div>
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span>{aiPotential < 40 ? "Low" : aiPotential < 70 ? "Medium" : "High"}</span>
                        <span className="font-medium">{aiPotential}/100</span>
                      </div>
                      <Progress value={aiPotential} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="questions" className="space-y-2 pt-2">
          {questions.length > 0 ? (
            <ul className="space-y-2">
              {questions.map((question, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="rounded-full bg-primary/10 p-1 mt-0.5 flex-shrink-0">
                    <Target className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm">{question}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              <p>No questions added yet</p>
            </div>
          )}
          <Button variant="outline" size="sm" className="w-full mt-2">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Question
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};
