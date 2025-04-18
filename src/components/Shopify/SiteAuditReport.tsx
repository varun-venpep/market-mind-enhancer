
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  ExternalLink, 
  Cog,
  FileText,
  ArrowUpRight
} from 'lucide-react';
import { OptimizationItem } from './AuditReportComponents/OptimizationItem';
import { IssueItem } from './AuditReportComponents/IssueItem';
import { HistoryItem } from './AuditReportComponents/HistoryItem';
import { SiteStatsSection } from './AuditReportComponents/SiteStatsSection';
import type { SEOIssue, SEOOptimization } from '@/types/shopify';

interface SiteAuditReportProps {
  audit: any;
  onApplyOptimization: (optimization: any) => Promise<void>;
  optimizationHistory: any[];
}

export function SiteAuditReport({ audit, onApplyOptimization, optimizationHistory }: SiteAuditReportProps) {
  const [activeTab, setActiveTab] = React.useState("issues");
  
  if (!audit) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
        <h3 className="text-lg font-medium mb-2">No Audit Data Available</h3>
      </div>
    );
  }
  
  const optimizationsByType = (audit.optimizations || []).reduce((acc: Record<string, SEOOptimization[]>, opt: SEOOptimization) => {
    if (!acc[opt.type]) {
      acc[opt.type] = [];
    }
    acc[opt.type].push(opt);
    return acc;
  }, {});
  
  const issuesBySeverity = (audit.issues || []).reduce((acc: Record<string, SEOIssue[]>, issue: SEOIssue) => {
    if (!acc[issue.severity]) {
      acc[issue.severity] = [];
    }
    acc[issue.severity].push(issue);
    return acc;
  }, {});
  
  return (
    <div className="space-y-6">
      <SiteStatsSection audit={audit} />
      
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
