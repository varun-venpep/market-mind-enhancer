
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import KeywordsManager from './KeywordsManager';

interface ArticleGenerationControlsProps {
  title: string;
  onTitleChange: (title: string) => void;
  keywords: string[];
  onAddKeyword: (keyword: string) => void;
  onRemoveKeyword: (keyword: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

const ArticleGenerationControls = ({
  title,
  onTitleChange,
  keywords,
  onAddKeyword,
  onRemoveKeyword,
  onGenerate,
  isGenerating
}: ArticleGenerationControlsProps) => {
  return (
    <div className="grid gap-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          type="text"
          id="title"
          placeholder="Article Title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </div>

      <KeywordsManager
        keywords={keywords}
        onAddKeyword={onAddKeyword}
        onRemoveKeyword={onRemoveKeyword}
      />

      <Button
        variant="secondary"
        onClick={onGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          'Generate Content'
        )}
      </Button>
    </div>
  );
};

export default ArticleGenerationControls;
