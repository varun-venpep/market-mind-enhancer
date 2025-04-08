
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUpRight, FileText, Award, BarChart2 } from "lucide-react";

interface ResultItem {
  id: string;
  title: string;
  url: string;
  snippet: string;
  position: number;
  wordCount: number;
}

interface KeywordAnalysisResultsProps {
  keyword: string;
  results: ResultItem[];
}

export function KeywordAnalysisResults({ keyword, results }: KeywordAnalysisResultsProps) {
  if (!results || results.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Results Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No search results found for "{keyword}". Try another keyword.</p>
        </CardContent>
      </Card>
    );
  }

  // Sort results by position
  const sortedResults = [...results].sort((a, b) => a.position - b.position);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold flex items-center">
          <FileText className="h-5 w-5 mr-2 text-primary" />
          SERP Analysis for "{keyword}"
        </h3>
        <Badge variant="outline" className="px-3 py-1 text-sm">
          {results.length} results
        </Badge>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center">
            <Award className="h-4 w-4 mr-2 text-amber-500" />
            Content Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-4">
            <div className="bg-primary/10 rounded-lg p-3 flex-1 min-w-[150px]">
              <p className="text-sm text-muted-foreground">Avg. Word Count</p>
              <p className="text-xl font-semibold">
                {Math.round(results.reduce((sum, item) => sum + item.wordCount, 0) / results.length)} words
              </p>
            </div>
            <div className="bg-primary/10 rounded-lg p-3 flex-1 min-w-[150px]">
              <p className="text-sm text-muted-foreground">Top Position Words</p>
              <p className="text-xl font-semibold">
                {results[0]?.wordCount || 0} words
              </p>
            </div>
            <div className="bg-primary/10 rounded-lg p-3 flex-1 min-w-[150px]">
              <p className="text-sm text-muted-foreground">Content Quality</p>
              <p className="text-xl font-semibold flex items-center">
                <BarChart2 className="h-4 w-4 mr-1 text-green-500" />
                {results.length > 5 ? "High" : "Medium"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <ScrollArea className="max-h-[600px]">
        <div className="space-y-4 pr-4">
          {sortedResults.map((result, index) => (
            <Card key={result.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6 pb-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 text-primary font-medium rounded-full h-8 w-8 flex items-center justify-center shrink-0">
                    {result.position}
                  </div>
                  <div className="space-y-2 w-full">
                    <div className="space-y-1">
                      <h4 className="font-medium line-clamp-2 hover:line-clamp-none transition-all">
                        {result.title}
                      </h4>
                      <a 
                        href={result.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-muted-foreground hover:underline line-clamp-1"
                      >
                        {result.url}
                      </a>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3 hover:line-clamp-none transition-all">
                      {result.snippet}
                    </p>
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {result.wordCount} words
                        </Badge>
                        {index === 0 && (
                          <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">
                            Top Result
                          </Badge>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-xs gap-1" 
                        asChild
                      >
                        <a href={result.url} target="_blank" rel="noopener noreferrer">
                          Visit
                          <ArrowUpRight className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
