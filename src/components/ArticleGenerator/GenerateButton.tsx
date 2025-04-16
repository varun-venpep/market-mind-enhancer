
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { generateArticleContent } from "@/services/articles/ai";
import { toast } from "sonner";

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
      
      toast.info('Generating AI content with Gemini...', {
        duration: 3000,
      });
      
      const { content } = await generateArticleContent(
        title, 
        keywordsList, 
        contentType, 
        contentLength, 
        tone
      );
      
      setGeneratedContent(content);
      onGenerate();
      
      toast.success('Content generated successfully!');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content. Please try again.');
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
          Generating with Gemini AI...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          Generate SEO Content
        </>
      )}
    </Button>
  );
};

export default GenerateButton;
