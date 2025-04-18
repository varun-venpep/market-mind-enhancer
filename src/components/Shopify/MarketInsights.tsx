
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart2, Share2, TrendingUp } from "lucide-react";

interface MarketInsightsProps {
  averageScore: number;
  productCount: number;
  serpLoading: boolean;
  serpData: any;
}

export function MarketInsights({ averageScore, productCount, serpLoading, serpData }: MarketInsightsProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Share2 className="h-5 w-5 text-primary" />
        Market Insights
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* SEO Performance Card */}
        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-muted/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-indigo-500" />
              Overall SEO Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-1">
              <div className="text-3xl font-bold">{averageScore}/100</div>
              <span className={`text-sm ${
                averageScore >= 80 ? 'text-green-600 dark:text-green-400' : 
                averageScore >= 60 ? 'text-amber-600 dark:text-amber-400' : 
                'text-red-600 dark:text-red-400'
              }`}>
                {averageScore >= 80 ? 'Good' : averageScore >= 60 ? 'Needs Improvement' : 'Poor'}
              </span>
            </div>
            <Progress 
              value={averageScore} 
              className={`h-2 ${
                averageScore >= 80 ? 'bg-green-100 dark:bg-green-950' : 
                averageScore >= 60 ? 'bg-amber-100 dark:bg-amber-950' : 
                'bg-red-100 dark:bg-red-950'
              }`} 
            />
            <p className="text-muted-foreground text-sm mt-2">
              Based on {productCount} product{productCount !== 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>
        
        {/* Keyword Competition Card */}
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-muted/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              Keyword Competition
            </CardTitle>
          </CardHeader>
          <CardContent>
            {serpLoading ? (
              <div className="h-12 animate-pulse bg-muted/30 rounded"></div>
            ) : serpData?.relatedKeywords ? (
              <div>
                <div className="text-3xl font-bold">
                  {Math.round(serpData.relatedKeywords.reduce((sum: number, kw: any) => sum + kw.difficulty, 0) / 
                  serpData.relatedKeywords.length)}/100
                </div>
                <p className="text-muted-foreground text-sm">Average difficulty for related keywords</p>
              </div>
            ) : (
              <div className="text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>
        
        {/* Traffic Card */}
        <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-muted/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Search Traffic Potential
            </CardTitle>
          </CardHeader>
          <CardContent>
            {serpLoading ? (
              <div className="h-12 animate-pulse bg-muted/30 rounded"></div>
            ) : serpData?.relatedKeywords ? (
              <div>
                <div className="text-3xl font-bold">
                  {serpData.relatedKeywords.reduce((sum: number, kw: any) => sum + kw.searchVolume, 0).toLocaleString()}
                </div>
                <p className="text-muted-foreground text-sm">Monthly searches for related keywords</p>
              </div>
            ) : (
              <div className="text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>

      {!serpLoading && serpData?.relatedKeywords && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Trending Keywords</CardTitle>
            <CardDescription>Popular keywords related to your store that could drive traffic</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {serpData.relatedKeywords.slice(0, 10).map((keyword: any, index: number) => (
                <div key={index} className="flex items-center bg-muted/30 rounded-full px-3 py-1 text-sm">
                  <span>{keyword.keyword}</span>
                  <span className="ml-2 bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                    {keyword.searchVolume.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
