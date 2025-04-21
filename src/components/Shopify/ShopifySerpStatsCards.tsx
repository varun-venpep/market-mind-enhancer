
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart2, Activity } from "lucide-react";

export interface ShopifySerpStatsCardsProps {
  isLoading: boolean;
  serpStats: {
    topKeywords: string[];
    avgDifficulty: number;
    totalOrganicResults: number;
  };
}

export default function ShopifySerpStatsCards({ isLoading, serpStats }: ShopifySerpStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-muted/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-indigo-500" />
            E-commerce SEO Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mt-2">
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <div key={i} className="h-8 w-20 animate-pulse bg-muted/30 rounded"></div>
              ))
            ) : (
              serpStats.topKeywords.map((keyword, i) => (
                <span key={i} className="bg-indigo-100/80 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300 px-3 py-1 rounded-full text-xs">
                  {keyword}
                </span>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-muted/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-500" />
            Keyword Difficulty
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-12 animate-pulse bg-muted/30 rounded"></div>
          ) : (
            <div className="text-3xl font-bold">{serpStats.avgDifficulty}/100</div>
          )}
          <p className="text-muted-foreground text-sm">Average difficulty for e-commerce keywords</p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-muted/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-500" />
            Organic Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-12 animate-pulse bg-muted/30 rounded"></div>
          ) : (
            <div className="text-3xl font-bold">{serpStats.totalOrganicResults}</div>
          )}
          <p className="text-muted-foreground text-sm">Top organic results analyzed</p>
        </CardContent>
      </Card>
    </div>
  );
}
