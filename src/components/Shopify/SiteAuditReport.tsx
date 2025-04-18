import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import type { SEOIssue, SEOOptimization } from '@/types/shopify';
import { OptimizationItem } from './AuditReportComponents/OptimizationItem';
import { IssueItem } from './AuditReportComponents/IssueItem';
import { HistoryItem } from './AuditReportComponents/HistoryItem';

interface SiteAuditReportProps {
  audit: any;
  onApplyOptimization: (optimization: any) => Promise<void>;
  optimizationHistory: any[];
}

export function SiteAuditReport({ audit, onApplyOptimization, optimizationHistory }: SiteAuditReportProps) {
  const [activeTab, setActiveTab] = useState("issues");
  
  if (!audit) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
        <h3 className="text-lg font-medium mb-2">No Audit Data Available</h3>
      </div>
    );
  }
  
  const optimizationsByType = ((audit.optimizations || []) as SEOOptimization[]).reduce((acc, opt) => {
    if (!acc[opt.type]) {
      acc[opt.type] = [];
    }
    acc[opt.type].push(opt);
    return acc;
  }, {} as Record<string, SEOOptimization[]>);
  
  const issuesBySeverity = ((audit.issues || []) as SEOIssue[]).reduce((acc, issue) => {
    if (!acc[issue.severity]) {
      acc[issue.severity] = [];
    }
    acc[issue.severity].push(issue);
    return acc;
  }, {} as Record<string, SEOIssue[]>);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle className="text-lg">Overall SEO Score</CardTitle>
              <Badge className="ml-2" variant={audit.score >= 80 ? 'default' : audit.score >= 60 ? 'secondary' : 'destructive'}>
                {audit.score}/100
              </Badge>
            </div>
            <CardDescription>Last analyzed on {new Date(audit.created_at).toLocaleString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-2">
              <Progress 
                value={audit.score} 
                className="h-2.5" 
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{audit.issues.length}</div>
                <div className="text-xs text-muted-foreground mt-1">Issues Found</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{audit.optimizations.length}</div>
                <div className="text-xs text-muted-foreground mt-1">Optimizations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{optimizationHistory.length}</div>
                <div className="text-xs text-muted-foreground mt-1">Applied Changes</div>
              </div>
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
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="issues">
            Issues ({(audit.issues || []).length})
          </TabsTrigger>
          <TabsTrigger value="optimizations">
            Recommendations ({(audit.optimizations || []).length})
          </TabsTrigger>
          <TabsTrigger value="history">
            History ({optimizationHistory.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="issues" className="space-y-4">
          {(audit.issues || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border rounded-md bg-muted/5">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Issues Found</h3>
              <p className="text-center text-muted-foreground max-w-md">
                Your store looks great! No SEO issues were detected during the audit.
              </p>
            </div>
          ) : (
            <Accordion type="multiple" defaultValue={['high']} className="space-y-4">
              {issuesBySeverity.high && issuesBySeverity.high.length > 0 && (
                <AccordionItem value="high">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-red-100 dark:bg-red-900/20 rounded-full">
                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <span>High Priority Issues ({issuesBySeverity.high.length})</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-8 pt-2">
                      {issuesBySeverity.high.map((issue, index) => (
                        <IssueItem key={index} issue={issue} />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
              
              {issuesBySeverity.medium && issuesBySeverity.medium.length > 0 && (
                <AccordionItem value="medium">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-amber-100 dark:bg-amber-900/20 rounded-full">
                        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      </div>
                      <span>Medium Priority Issues ({issuesBySeverity.medium.length})</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-8 pt-2">
                      {issuesBySeverity.medium.map((issue, index) => (
                        <IssueItem key={index} issue={issue} />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
              
              {issuesBySeverity.low && issuesBySeverity.low.length > 0 && (
                <AccordionItem value="low">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span>Low Priority Issues ({issuesBySeverity.low.length})</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-8 pt-2">
                      {issuesBySeverity.low.map((issue, index) => (
                        <IssueItem key={index} issue={issue} />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          )}
        </TabsContent>
        
        <TabsContent value="optimizations">
          {(audit.optimizations || []).length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border rounded-md bg-muted/5">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Optimizations Needed</h3>
              <p className="text-center text-muted-foreground max-w-md">
                Your store is already well optimized! No SEO optimizations were identified during the audit.
              </p>
            </div>
          ) : (
            <Accordion type="multiple" defaultValue={Object.keys(optimizationsByType)} className="space-y-4">
              {Object.entries(optimizationsByType).map(([type, optimizations]) => (
                <AccordionItem key={type} value={type}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                        {type === 'title' ? (
                          <Cog className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        ) : type === 'description' ? (
                          <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        ) : type === 'content' ? (
                          <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                      <span>{type.charAt(0).toUpperCase() + type.slice(1)} Optimizations ({optimizations.length})</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-8 pt-2">
                      {optimizations.map((optimization, index) => (
                        <OptimizationItem
                          key={index}
                          optimization={optimization}
                          onApply={onApplyOptimization}
                          isApplied={optimization.applied}
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </TabsContent>
        
        <TabsContent value="history">
          {optimizationHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border rounded-md bg-muted/5">
              <Info className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
              <h3 className="text-lg font-medium mb-2">No Optimization History</h3>
              <p className="text-center text-muted-foreground max-w-md">
                You haven't applied any SEO optimizations yet. Go to the Recommendations tab to improve your store's SEO.
              </p>
              <Button 
                className="mt-6"
                onClick={() => setActiveTab("optimizations")}
              >
                View Recommendations
              </Button>
            </div>
          ) : (
            <div className="border rounded-md p-6 space-y-2">
              {optimizationHistory.map((item, index) => (
                <HistoryItem key={index} item={item} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
