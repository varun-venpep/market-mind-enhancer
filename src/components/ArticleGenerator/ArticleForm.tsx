
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import KeywordManager from './KeywordManager';
import ContentTypeSelector from './ContentTypeSelector';
import GenerateButton from './GenerateButton';

interface ArticleFormProps {
  title: string;
  setTitle: (title: string) => void;
  keywords: string;
  setKeywords: (keywords: string) => void;
  contentType: string;
  setContentType: (type: string) => void;
  contentLength: string;
  setContentLength: (length: string) => void;
  tone: string;
  setTone: (tone: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
  setGeneratedContent: (content: string) => void;
  handleKeywordInput: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  keywordSuggestions: string[];
  addKeyword: (keyword: string) => void;
  isLoadingSuggestions: boolean;
  getSuggestions: () => void;
}

const ArticleForm: React.FC<ArticleFormProps> = ({
  title,
  setTitle,
  keywords,
  setKeywords,
  contentType,
  setContentType,
  contentLength,
  setContentLength,
  tone,
  setTone,
  onGenerate,
  isGenerating,
  setIsGenerating,
  setGeneratedContent,
  handleKeywordInput,
  keywordSuggestions,
  addKeyword,
  isLoadingSuggestions,
  getSuggestions
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="topic">Topic or Title</Label>
        <Input 
          id="topic" 
          placeholder="e.g., 10 SEO Tips for E-commerce" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <KeywordManager 
        keywords={keywords}
        setKeywords={setKeywords}
        handleKeywordInput={handleKeywordInput}
        keywordSuggestions={keywordSuggestions}
        addKeyword={addKeyword}
        isLoadingSuggestions={isLoadingSuggestions}
        getSuggestions={getSuggestions}
      />

      <ContentTypeSelector 
        contentType={contentType}
        setContentType={setContentType}
        contentLength={contentLength}
        setContentLength={setContentLength}
        tone={tone}
        setTone={setTone}
      />

      <GenerateButton 
        onGenerate={onGenerate}
        isGenerating={isGenerating}
        title={title}
        keywords={keywords}
        contentType={contentType}
        contentLength={contentLength}
        tone={tone}
        setIsGenerating={setIsGenerating}
        setGeneratedContent={setGeneratedContent}
      />
    </>
  );
};

export default ArticleForm;
