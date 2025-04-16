
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, FileText, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface ContentPreviewProps {
  isGenerating: boolean;
  generatedContent: string;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({ 
  isGenerating, 
  generatedContent 
}) => {
  return (
    <>
      {isGenerating ? (
        <div className="flex flex-col items-center justify-center h-[500px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-muted-foreground">Generating high-quality content...</p>
        </div>
      ) : generatedContent ? (
        <div className="prose prose-sm dark:prose-invert max-w-none h-[500px] overflow-y-auto border rounded-md p-4">
          <div dangerouslySetInnerHTML={{ __html: generatedContent.replace(/\n/g, '<br/>') }} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[500px] border border-dashed rounded-md">
          <FileText className="h-12 w-12 text-muted-foreground mb-2 opacity-20" />
          <p className="text-muted-foreground">Your content will appear here</p>
          <p className="text-xs text-muted-foreground mt-1">Fill in the settings and click Generate</p>
        </div>
      )}

      {generatedContent && (
        <div className="flex justify-end gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={() => {
              navigator.clipboard.writeText(generatedContent);
              toast.success('Content copied to clipboard');
            }}
          >
            Copy Content
          </Button>
          <Button disabled>
            Save as Draft
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </>
  );
};

export default ContentPreview;
