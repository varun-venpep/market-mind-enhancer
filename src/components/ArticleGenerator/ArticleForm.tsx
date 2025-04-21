
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
    <form
      className="w-full max-w-2xl mx-auto px-2 py-1 flex flex-col gap-5"
      autoComplete="off"
      onSubmit={(e) => { e.preventDefault(); onGenerate(); }}
    >
      <div className="flex flex-col gap-1">
        <Label htmlFor="topic" className="font-semibold">Topic or Title</Label>
        <Input 
          id="topic" 
          placeholder="e.g., 10 SEO Tips for E-commerce"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label htmlFor="campaign" className="font-semibold">Campaign</Label>
        <Select 
          value={selectedCampaignId || ""}
          onValueChange={setSelectedCampaignId}
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

      <div>
        <KeywordManager 
          keywords={keywords}
          setKeywords={setKeywords}
          handleKeywordInput={handleKeywordInput}
          keywordSuggestions={keywordSuggestions}
          addKeyword={addKeyword}
          isLoadingSuggestions={isLoadingSuggestions}
          getSuggestions={getSuggestions}
        />
      </div>

      <div>
        <ContentTypeSelector 
          contentType={contentType}
          setContentType={setContentType}
          contentLength={contentLength}
          setContentLength={setContentLength}
          tone={tone}
          setTone={setTone}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="generate-image" 
          checked={generateAIImage}
          onCheckedChange={handleCheckedChange}
        />
        <Label htmlFor="generate-image" className="text-sm font-medium">
          Generate featured image with AI
        </Label>
      </div>

      <div>
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
      </div>
    </form>
  );
};

export default ArticleForm;

