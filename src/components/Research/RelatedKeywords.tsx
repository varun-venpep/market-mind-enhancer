
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  ArrowRight, 
  Lightbulb, 
  ArrowUpRight,
  Copy,
  BarChart3,
  Download
} from "lucide-react";
import { toast } from "sonner";

interface KeywordItem {
  id: string;
  keyword: string;
  searchVolume: number;
  difficulty: number;
  cpc: number | string; // Can be a number or a string
  aiPotential: number;
}

interface RelatedKeywordsProps {
  mainKeyword: string;
  keywords: KeywordItem[];
}

export function RelatedKeywords({ mainKeyword, keywords = [] }: RelatedKeywordsProps) {
  const [activeTab, setActiveTab] = React.useState('all');

  if (!keywords || keywords.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Related Keywords</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No related keywords found for "{mainKeyword}". Try another keyword.</p>
        </CardContent>
      </Card>
    );
  }

  // Fix cpc values to ensure they're numbers
  const processedKeywords = keywords.map(kw => ({
    ...kw,
    cpc: typeof kw.cpc === 'number' ? kw.cpc : parseFloat(kw.cpc) || 0
  }));

  // Sort and filter keywords
  const sortedKeywords = React.useMemo(() => {
    if (activeTab === 'volume') {
      return [...processedKeywords].sort((a, b) => b.searchVolume - a.searchVolume);
    } else if (activeTab === 'difficulty') {
      return [...processedKeywords].sort((a, b) => a.difficulty - b.difficulty);
    } else if (activeTab === 'potential') {
      return [...processedKeywords].sort((a, b) => b.aiPotential - a.aiPotential);
    }
    return processedKeywords;
  }, [processedKeywords, activeTab]);

  const handleCopyKeyword = (keyword: string) => {
    navigator.clipboard.writeText(keyword);
    toast.success(`Copied "${keyword}" to clipboard`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-primary" />
          Related Keywords for "{mainKeyword}"
        </h3>
        <Badge variant="outline" className="px-3 py-1 text-sm">
          {keywords.length} keywords
        </Badge>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Keywords</TabsTrigger>
          <TabsTrigger value="volume">By Volume</TabsTrigger>
          <TabsTrigger value="difficulty">By Difficulty</TabsTrigger>
          <TabsTrigger value="potential">By AI Potential</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <ScrollArea className="max-h-[600px]">
        <div className="space-y-4 pr-4">
          <div className="grid grid-cols-1 gap-4">
            {sortedKeywords.map((keyword) => (
              <Card key={keyword.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                    <div className="flex-1">
                      <h4 className="font-medium text-lg">{keyword.keyword}</h4>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 hover:bg-blue-200">
                          <BarChart3 className="h-3 w-3 mr-1" />
                          {keyword.searchVolume.toLocaleString()} searches
                        </Badge>
                        <Badge className={`
                          ${keyword.difficulty < 30 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                            keyword.difficulty < 70 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}
                          hover:opacity-80
                        `}>
                          Difficulty: {keyword.difficulty}%
                        </Badge>
                        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 hover:bg-purple-200">
                          CPC: ${typeof keyword.cpc === 'number' ? keyword.cpc.toFixed(2) : parseFloat(keyword.cpc as string).toFixed(2) || '0.00'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-row md:flex-col items-center gap-2 md:items-end md:min-w-28">
                      <div className="flex-1 w-full md:w-auto">
                        <div className="text-xs text-muted-foreground mb-1 text-center">AI Potential</div>
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-full h-4 w-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              keyword.aiPotential > 80 ? 'bg-green-500' : 
                              keyword.aiPotential > 60 ? 'bg-yellow-500' : 
                              'bg-red-500'
                            }`}
                            style={{ width: `${keyword.aiPotential}%` }}
                          />
                        </div>
                        <div className="text-xs text-center mt-1">{keyword.aiPotential}%</div>
                      </div>
                      <div className="flex gap-1">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          onClick={() => handleCopyKeyword(keyword.keyword)}
                          className="h-8 w-8"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="h-8"
                        >
                          Explore
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ScrollArea>
      
      <div className="flex justify-end">
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Keywords
        </Button>
      </div>
    </div>
  );
}
