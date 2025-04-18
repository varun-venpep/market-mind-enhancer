import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertCircle, AlertTriangle, ArrowUpRight, Check, CheckCircle, Cog, ExternalLink, Info, Zap, FileText } from 'lucide-react';
import type { SEOIssue, SEOOptimization } from '@/types/shopify';

interface OptimizationProps {
  optimization: any;
  onApply: (optimization: any) => void;
  isApplied: boolean;
}

function OptimizationItem({ optimization, onApply, isApplied }: OptimizationProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const getEntityTypeLabel = (location: string) => {
    switch (location) {
      case 'store': return 'Store';
      case 'page': return 'Page';
      case 'blog': return 'Blog';
      case 'product': return 'Product';
      default: return location;
    }
  };
  
  const getFieldLabel = (field: string) => {
    switch (field) {
      case 'title': return 'Title';
      case 'meta_description': return 'Meta Description';
      case 'body_html': return 'Content';
      case 'handle': return 'URL';
      case 'name': return 'Name';
      case 'robots_txt': return 'Robots.txt';
      case 'sitemap': return 'Sitemap';
      default: return field;
    }
  };
  
  return (
    <div className="border rounded-md hover:shadow-sm transition-shadow p-4 mb-3 bg-card">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={optimization.type === 'title' ? 'default' : 
                          optimization.type === 'description' ? 'secondary' : 
                          optimization.type === 'technical' ? 'destructive' : 
                          'outline'}>
              {getFieldLabel(optimization.field)}
            </Badge>
            <Badge variant="outline">{getEntityTypeLabel(optimization.location)}</Badge>
          </div>
          <div className="text-sm font-medium mb-1">
            {optimization.entity_name || `${getEntityTypeLabel(optimization.location)} - ${getFieldLabel(optimization.field)}`}
          </div>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {optimization.original ? 
              optimization.original.length > 100 ? `${optimization.original.substring(0, 100)}...` : optimization.original : 
              'No content'}
          </p>
        </div>
        {isApplied ? (
          <div className="flex items-center text-green-600 dark:text-green-500 text-sm font-medium">
            <CheckCircle className="h-4 w-4 mr-1" />
            Applied
          </div>
        ) : (
          <Button 
            variant="outline" 
            size="sm"
            className="flex gap-1 items-center"
            onClick={() => setIsDialogOpen(true)}
          >
            <Zap className="h-3.5 w-3.5" />
            View
          </Button>
        )}
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Apply SEO Optimization</DialogTitle>
            <DialogDescription>
              Review and approve this suggested SEO change
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Location</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{getEntityTypeLabel(optimization.location)}</Badge>
                {optimization.entity_name && (
                  <Badge variant="secondary">{optimization.entity_name}</Badge>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Current {getFieldLabel(optimization.field)}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <div className="border rounded-md p-3 bg-muted/50 min-h-[100px] max-h-[200px] overflow-y-auto">
                    {optimization.original || <span className="text-muted-foreground italic">No content</span>}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-green-200 dark:border-green-800">
                <CardHeader className="pb-2 bg-green-50/50 dark:bg-green-900/20">
                  <CardTitle className="text-base text-green-700 dark:text-green-300">Suggested {getFieldLabel(optimization.field)}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <div className="border border-green-200 dark:border-green-800 rounded-md p-3 bg-green-50/30 dark:bg-green-900/10 min-h-[100px] max-h-[200px] overflow-y-auto">
                    {optimization.suggestion || <span className="text-muted-foreground italic">No suggestion</span>}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Alert variant="info" className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <Info className="h-4 w-4" />
            <AlertTitle>SEO Impact</AlertTitle>
            <AlertDescription className="text-sm">
              Applying this change can improve your store's search engine visibility and ranking.
            </AlertDescription>
          </Alert>
          
          <DialogFooter className="gap-2">
            <Button 
              variant="ghost" 
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                onApply(optimization);
                setIsDialogOpen(false);
              }}
              className="gap-2"
            >
              <Zap className="h-4 w-4" />
              Apply Optimization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface IssueItemProps {
  issue: any;
}

function IssueItem({ issue }: IssueItemProps) {
  return (
    <div className="border rounded-md p-4 mb-3">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          {issue.severity === 'high' ? (
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
          ) : issue.severity === 'medium' ? (
            <div className="p-2 bg-amber-100 dark:bg-amber-900/20 rounded-full">
              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          ) : (
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          )}
        </div>
        <div>
          <h4 className="font-medium">{issue.message}</h4>
          {issue.details && (
            <p className="text-sm text-muted-foreground mt-1">{issue.details}</p>
          )}
          {issue.entity_name && (
            <div className="mt-2">
              <Badge variant="outline">{issue.entity_name}</Badge>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface HistoryItemProps {
  item: any;
}

function HistoryItem({ item }: HistoryItemProps) {
  const date = new Date(item.applied_at);
  
  return (
    <div className="flex items-start gap-4 border-b pb-4 pt-2">
      <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-full flex-shrink-0 mt-0.5">
        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">
            {item.entity_type === 'store' ? 'Store' : 
             item.entity_type === 'product' ? 'Product' : 
             item.entity_type === 'page' ? 'Page' : 
             item.entity_type === 'blog' ? 'Blog' : 
             item.entity_type}
          </span>
          <span className="text-sm text-muted-foreground">
            {item.field === 'title' ? 'Title' : 
             item.field === 'meta_description' ? 'Meta Description' : 
             item.field === 'body_html' ? 'Content' : 
             item.field === 'handle' ? 'URL' : 
             item.field}
          </span>
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          Applied on {date.toLocaleDateString()} at {date.toLocaleTimeString()}
        </div>
        <div className="mt-2 grid grid-cols-1 gap-2 text-sm">
          <div className="rounded bg-muted/30 p-2">
            <div className="text-xs text-muted-foreground mb-1">From:</div>
            <div className="line-clamp-1">{item.original_value || <em>Empty</em>}</div>
          </div>
          <div className="rounded bg-green-50 dark:bg-green-900/20 p-2">
            <div className="text-xs text-muted-foreground mb-1">To:</div>
            <div className="line-clamp-1">{item.new_value}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  
  const optimizationsByType = (audit.optimizations || []).reduce((acc, opt) => {
    const type = opt.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(opt);
    return acc;
  }, {} as Record<string, SEOOptimization[]>);
  
  const issuesBySeverity = (audit.issues || []).reduce((acc, issue) => {
    const severity = issue.severity;
    if (!acc[severity]) {
      acc[severity] = [];
    }
    acc[severity].push(issue);
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
            Issues ({audit.issues.length})
          </TabsTrigger>
          <TabsTrigger value="optimizations">
            Recommendations ({audit.optimizations.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            History ({optimizationHistory.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="issues" className="space-y-4">
          {audit.issues.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border rounded-md bg-muted/5">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Issues Found</h3>
              <p className="text-center text-muted-foreground max-w-md">
                Your store looks great! No SEO issues were detected during the audit.
              </p>
            </div>
          ) : (
            <div>
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
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="optimizations">
          {audit.optimizations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border rounded-md bg-muted/5">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Optimizations Needed</h3>
              <p className="text-center text-muted-foreground max-w-md">
                Your store is already well optimized! No SEO optimizations were identified during the audit.
              </p>
            </div>
          ) : (
            <div>
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
            </div>
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
