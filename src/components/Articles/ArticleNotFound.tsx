
import React from 'react';
import { FileX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface ArticleNotFoundProps {
  message?: string; // Added optional message prop
}

export function ArticleNotFound({ message = "Article not found" }: ArticleNotFoundProps) {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
      <FileX className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold mb-2">{message}</h2>
      <p className="text-muted-foreground mb-6">The article you're looking for could not be found.</p>
      <Button onClick={() => navigate('/dashboard/campaigns')}>
        Return to Campaigns
      </Button>
    </div>
  );
}
