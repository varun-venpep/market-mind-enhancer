
import React from 'react';
import { Loader2 } from 'lucide-react';

interface ArticleLoadingStateProps {
  message?: string; // Added optional message prop
}

export function ArticleLoadingState({ message = "Loading article..." }: ArticleLoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground text-lg">{message}</p>
    </div>
  );
}
