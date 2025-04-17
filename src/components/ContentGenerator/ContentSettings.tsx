
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ContentSettingsProps {
  prompt: string;
  setPrompt: (value: string) => void;
  keywords: string;
  setKeywords: (value: string) => void;
  contentType: string;
  setContentType: (value: string) => void;
  contentLength: string;
  setContentLength: (value: string) => void;
  tone: string;
  setTone: (value: string) => void;
  generateAIImage: boolean;
  setGenerateAIImage: (value: boolean) => void;
  keywordSuggestions: string[];
  isLoadingSuggestions: boolean;
  getSuggestions: () => void;
  addKeyword: (keyword: string) => void;
  handleGenerate: () => void;
  isGenerating: boolean;
}

const ContentSettings: React.FC<ContentSettingsProps> = ({
  prompt,
  setPrompt,
  keywords,
  setKeywords,
  contentType,
  setContentType,
  contentLength,
  setContentLength,
  tone,
  setTone,
  generateAIImage,
  setGenerateAIImage,
  keywordSuggestions,
  isLoadingSuggestions,
  getSuggestions,
  addKeyword,
  handleGenerate,
  isGenerating
}) => {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Content Settings</CardTitle>
        <CardDescription>
          Configure your content generation preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic">Topic or Title</Label>
          <Input 
            id="topic" 
            placeholder="e.g., 10 SEO Tips for E-commerce" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
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

        <div className="flex items-center space-x-2 py-2">
          <Checkbox 
            id="generate-image" 
            checked={generateAIImage}
            onCheckedChange={(checked) => {
              setGenerateAIImage(checked === true);
            }}
          />
          <Label htmlFor="generate-image" className="text-sm font-medium">
            Generate featured image with AI
          </Label>
        </div>
      </CardContent>
      <CardFooter>
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
      </CardFooter>
    </Card>
  );
};

export default ContentSettings;
