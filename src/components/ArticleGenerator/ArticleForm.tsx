
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import KeywordManager from './KeywordManager';
import ContentTypeSelector from './ContentTypeSelector';
import GenerateButton from './GenerateButton';
import { Campaign } from "@/types";

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
  campaigns: Campaign[];
  selectedCampaignId: string | null;
  setSelectedCampaignId: (id: string) => void;
  generateAIImage: boolean;
  setGenerateAIImage: (value: boolean) => void;
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
  getSuggestions,
  campaigns,
  selectedCampaignId,
  setSelectedCampaignId,
  generateAIImage,
  setGenerateAIImage
}) => {
  const handleCheckedChange = (checked: CheckedState) => {
    setGenerateAIImage(checked === true);
  };

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

      <div className="space-y-2 mt-4">
        <Label htmlFor="campaign">Campaign</Label>
        <Select 
          value={selectedCampaignId || ""} 
          onValueChange={(value) => setSelectedCampaignId(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a campaign" />
          </SelectTrigger>
          <SelectContent>
            {campaigns.map((campaign) => (
              <SelectItem key={campaign.id} value={campaign.id}>
                {campaign.name}
              </SelectItem>
            ))}
            {campaigns.length === 0 && (
              <SelectItem value="no-campaigns" disabled>
                No campaigns available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
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

      <div className="flex items-center space-x-2 mt-4">
        <Checkbox 
          id="generate-image" 
          checked={generateAIImage}
          onCheckedChange={handleCheckedChange}
        />
        <Label htmlFor="generate-image" className="text-sm font-medium">
          Generate featured image with AI
        </Label>
      </div>

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
