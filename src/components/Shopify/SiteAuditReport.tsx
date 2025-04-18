import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Lightbulb, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from 'date-fns';
import type { SEOOptimization, SEOIssue } from '@/types/shopify';

interface SiteAuditReportProps {
  audit: {
    optimizations: SEOOptimization[];
    issues: SEOIssue[];
    store_url: string;
    store_name: string;
    theme: string;
    pages_count: number;
    blogs_count: number;
    score: number;
    created_at: string;
  };
  onApplyOptimization: (optimization: any) => void;
  optimizationHistory: any[];
}

export function SiteAuditReport({ audit, onApplyOptimization, optimizationHistory }: SiteAuditReportProps) {
  const appliedOptimizations = optimizationHistory.map(opt => opt.entity_id);
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Audit Summary</CardTitle>
          <CardDescription>
            Overview of the SEO audit results for your store.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium leading-none">Store URL</p>
              <p className="text-sm text-muted-foreground">{audit.store_url}</p>
            </div>
            <div>
              <p className="text-sm font-medium leading-none">Store Name</p>
              <p className="text-sm text-muted-foreground">{audit.store_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium leading-none">Theme</p>
              <p className="text-sm text-muted-foreground">{audit.theme}</p>
            </div>
            <div>
              <p className="text-sm font-medium leading-none">Pages Count</p>
              <p className="text-sm text-muted-foreground">{audit.pages_count}</p>
            </div>
            <div>
              <p className="text-sm font-medium leading-none">Blogs Count</p>
              <p className="text-sm text-muted-foreground">{audit.blogs_count}</p>
            </div>
            <div>
              <p className="text-sm font-medium leading-none">Audit Date</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(audit.created_at), 'PPP')}
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium leading-none">SEO Score</p>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">{audit.score}</div>
              <Badge variant="secondary">
                {audit.score >= 70 ? "Good" : audit.score >= 50 ? "Moderate" : "Poor"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO Issues</CardTitle>
          <CardDescription>
            Identified SEO issues that need attention.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {audit.issues.length === 0 ? (
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <p className="text-sm text-muted-foreground">No issues found.</p>
            </div>
          ) : (
            <ScrollArea className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {audit.issues.map((issue, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{issue.type}</TableCell>
                      <TableCell>{issue.message}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            issue.severity === "high"
                              ? "destructive"
                              : issue.severity === "medium"
                              ? "warning"
                              : "secondary"
                          }
                        >
                          {issue.severity}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO Optimizations</CardTitle>
          <CardDescription>
            Recommended optimizations to improve your store's SEO.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {audit.optimizations.length === 0 ? (
            <div className="flex items-center justify-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <p className="text-sm text-muted-foreground">No optimizations available.</p>
            </div>
          ) : (
            <ScrollArea className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Field</TableHead>
                    <TableHead>Original</TableHead>
                    <TableHead>Suggestion</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {audit.optimizations.map((optimization, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{optimization.type}</TableCell>
                      <TableCell>{optimization.field}</TableCell>
                      <TableCell>{optimization.original}</TableCell>
                      <TableCell>{optimization.suggestion}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onApplyOptimization(optimization)}
                          disabled={appliedOptimizations.includes(optimization.entity_id)}
                        >
                          {appliedOptimizations.includes(optimization.entity_id) ? (
                            <>
                              <RotateCcw className="mr-2 h-4 w-4 animate-spin" />
                              Applying...
                            </>
                          ) : (
                            <>
                              <Lightbulb className="mr-2 h-4 w-4" />
                              Apply
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
