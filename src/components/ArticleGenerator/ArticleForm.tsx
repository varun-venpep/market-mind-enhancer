
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

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

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label htmlFor="keywords">Target Keywords</Label>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 text-xs"
            onClick={getSuggestions}
            disabled={isLoadingSuggestions}
          >
            {isLoadingSuggestions ? 
              <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : 
              <Sparkles className="h-3 w-3 mr-1" />
            }
            Get suggestions
          </Button>
        </div>
        <Input 
          id="keywords" 
          placeholder="e.g., seo, e-commerce, shopify" 
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          onKeyDown={handleKeywordInput}
        />
        
        {keywordSuggestions.length > 0 && (
          <div className="mt-2">
            <Label className="text-xs">Suggestions:</Label>
            <div className="flex flex-wrap gap-1 mt-1">
              {keywordSuggestions.map((kw, i) => (
                <Button 
                  key={i} 
                  variant="outline" 
                  size="sm" 
                  className="h-6 text-xs py-0 px-2"
                  onClick={() => addKeyword(kw)}
                >
                  + {kw}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content-type">Content Type</Label>
        <Select value={contentType} onValueChange={setContentType}>
          <SelectTrigger>
            <SelectValue placeholder="Select content type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="blog-post">Blog Post</SelectItem>
            <SelectItem value="product-description">Product Description</SelectItem>
            <SelectItem value="article">Article</SelectItem>
            <SelectItem value="social-media">Social Media Post</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content-length">Content Length</Label>
        <Select value={contentLength} onValueChange={setContentLength}>
          <SelectTrigger>
            <SelectValue placeholder="Select length" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="short">Short (500-700 words)</SelectItem>
            <SelectItem value="medium">Medium (1000-1200 words)</SelectItem>
            <SelectItem value="long">Long (1500-2000 words)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tone">Tone</Label>
        <Select value={tone} onValueChange={setTone}>
          <SelectTrigger>
            <SelectValue placeholder="Select tone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="informational">Informational</SelectItem>
            <SelectItem value="conversational">Conversational</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="persuasive">Persuasive</SelectItem>
            <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        className="w-full gap-2" 
        onClick={onGenerate}
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
    </>
  );
};

export default ArticleForm;
