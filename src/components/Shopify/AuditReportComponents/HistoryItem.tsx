
import React from 'react';
import { Check } from 'lucide-react';

interface HistoryItemProps {
  item: any;
}

export function HistoryItem({ item }: HistoryItemProps) {
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
