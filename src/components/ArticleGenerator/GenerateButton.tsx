
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { generateArticleContent } from "@/services/articles/ai";

interface GenerateButtonProps {
  onGenerate: () => void;
  isGenerating: boolean;
  title: string;
  keywords: string;
  contentType: string;
  contentLength: string;
  tone: string;
  setIsGenerating: (value: boolean) => void;
  setGeneratedContent: (content: string) => void;
}

const GenerateButton: React.FC<GenerateButtonProps> = ({
  onGenerate,
  isGenerating,
  title,
  keywords,
  contentType,
  contentLength,
  tone,
  setIsGenerating,
  setGeneratedContent
}) => {
  const handleGenerate = async () => {
    if (!title) {
      toast.error('Please enter a title');
      return;
    }

    setIsGenerating(true);
    
    try {
      const keywordsList = keywords.split(',').map(k => k.trim()).filter(Boolean);
      const { content } = await generateArticleContent(title, keywordsList);
      setGeneratedContent(content);
      onGenerate();
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      className="w-full gap-2" 
      onClick={handleGenerate}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          Generate Content
        </>
      )}
    </Button>
  );
};

export default GenerateButton;
