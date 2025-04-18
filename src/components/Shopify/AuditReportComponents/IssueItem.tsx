
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface IssueItemProps {
  issue: any;
}

export function IssueItem({ issue }: IssueItemProps) {
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
