
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, FileText, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface ContentPreviewProps {
  isGenerating: boolean;
  generatedContent: string;
  generatedImageUrl: string;
  handleSaveArticle: () => void;
  isSaving: boolean;
}

const ContentPreview: React.FC<ContentPreviewProps> = ({
  isGenerating,
  generatedContent,
  generatedImageUrl,
  handleSaveArticle,
  isSaving
}) => {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Generated Content</CardTitle>
        <CardDescription>
          Your AI-generated content will appear here
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center h-[500px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
            <p className="text-muted-foreground">Generating high-quality content...</p>
          </div>
        ) : generatedContent ? (
          <div className="flex flex-col h-[500px]">
            <div className="prose prose-sm dark:prose-invert max-w-none flex-grow overflow-y-auto border rounded-md p-4">
              <div dangerouslySetInnerHTML={{ __html: generatedContent.replace(/\n/g, '<br/>') }} />
            </div>
            
            {generatedImageUrl && (
              <div className="mt-4 border rounded-md p-4">
                <h3 className="text-sm font-medium mb-2">Generated Featured Image:</h3>
                <div className="flex justify-center">
                  <img 
                    src={generatedImageUrl} 
                    alt="AI Generated" 
                    className="max-h-48 object-contain"
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[500px] border border-dashed rounded-md">
            <FileText className="h-12 w-12 text-muted-foreground mb-2 opacity-20" />
            <p className="text-muted-foreground">Your content will appear here</p>
            <p className="text-xs text-muted-foreground mt-1">Fill in the settings and click Generate</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {generatedContent && (
          <>
            <Button 
              variant="outline" 
              onClick={() => {
                navigator.clipboard.writeText(generatedContent);
                toast.success('Content copied to clipboard');
              }}
            >
              Copy Content
            </Button>
            <Button 
              onClick={handleSaveArticle}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  Save as Draft
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default ContentPreview;
