
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ExternalLink } from 'lucide-react';

interface SiteStatsSectionProps {
  audit: {
    score: number;
    store_url: string;
    store_name: string;
    theme: string;
    pages_count: number;
    blogs_count: number;
  };
}

export function SiteStatsSection({ audit }: SiteStatsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="col-span-1 md:col-span-2">
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <CardTitle className="text-lg">Overall SEO Score</CardTitle>
            <Badge 
              className="ml-2" 
              variant={audit.score >= 80 ? 'default' : audit.score >= 60 ? 'secondary' : 'destructive'}
            >
              {audit.score}/100
            </Badge>
          </div>
          <CardDescription>Last analyzed on {new Date().toLocaleString()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mt-2">
            <Progress 
              value={audit.score} 
              className="h-2.5" 
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Store Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="text-sm font-medium">Store URL</div>
              <div className="text-sm text-muted-foreground flex items-center">
                <a 
                  href={`https://${audit.store_url}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center"
                >
                  {audit.store_url}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Store Name</div>
              <div className="text-sm text-muted-foreground">{audit.store_name || "Not available"}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Theme</div>
              <div className="text-sm text-muted-foreground">{audit.theme || "Not available"}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Pages</div>
              <div className="text-sm text-muted-foreground">{audit.pages_count}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Blogs</div>
              <div className="text-sm text-muted-foreground">{audit.blogs_count}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
