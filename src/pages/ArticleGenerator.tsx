
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import ArticleForm from "@/components/ArticleGenerator/ArticleForm";
import ContentPreview from "@/components/ArticleGenerator/ContentPreview";
import { createArticle } from '@/services/articles';
import { fetchUserCampaigns } from '@/services/articles/campaigns';
import { generateImage } from '@/services/geminiApi'; 
import { Campaign } from '@/types';

const ArticleGenerator = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [keywords, setKeywords] = useState("");
  const [contentType, setContentType] = useState("blog");
  const [contentLength, setContentLength] = useState("medium");
  const [tone, setTone] = useState("professional");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [activeTab, setActiveTab] = useState("settings");
  const [keywordSuggestions, setKeywordSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [generateAIImage, setGenerateAIImage] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const campaignsData = await fetchUserCampaigns();
        setCampaigns(campaignsData);
        
        if (campaignsData.length > 0) {
          setSelectedCampaignId(campaignsData[0].id);
        }
      } catch (error) {
        console.error("Error loading campaigns:", error);
      }
    };
    
    loadCampaigns();
  }, []);

  const handleGenerate = () => {
    if (!title) {
      toast.error("Please enter a title before generating content");
      return;
    }
    
    if (generateAIImage) {
      generateFeaturedImage();
    }
    
    setActiveTab("preview");
    setEditedContent(generatedContent);
  };

  const generateFeaturedImage = async () => {
    if (!title) return;
    
    setIsGeneratingImage(true);
    
    try {
      const imagePrompt = `Create a professional featured image for a blog post titled: "${title}"`;
      const imageUrl = await generateImage(imagePrompt);
      setGeneratedImageUrl(imageUrl);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleKeywordInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      const newKeyword = e.currentTarget.value.trim();
      if (newKeyword && !keywords.includes(newKeyword)) {
        if (keywords) {
          setKeywords(prev => `${prev}, ${newKeyword}`);
        } else {
          setKeywords(newKeyword);
        }
        e.currentTarget.value = '';
      }
    }
  };

  const getSuggestions = async () => {
    if (!title) {
      toast.error("Please enter a title first");
      return;
    }
    
    setIsLoadingSuggestions(true);
    try {
      // This is a placeholder for the actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const suggestions = [
        "SEO optimization", 
        "content marketing", 
        "digital strategy", 
        "keyword research", 
        "online presence"
      ];
      setKeywordSuggestions(suggestions);
    } catch (error) {
      console.error("Error getting suggestions:", error);
      toast.error("Failed to get keyword suggestions");
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const addKeyword = (keyword: string) => {
    if (!keywords.includes(keyword)) {
      if (keywords) {
        setKeywords(prev => `${prev}, ${keyword}`);
      } else {
        setKeywords(keyword);
      }
    }
  };

  const handleSaveArticle = async () => {
    if (!title || !editedContent) {
      toast.error("Please provide a title and generate content before saving");
      return;
    }

    if (!selectedCampaignId) {
      toast.error("Please select a campaign before saving");
      return;
    }

    setIsSaving(true);
    
    try {
      const keywordsList = keywords.split(',').map(k => k.trim()).filter(Boolean);
      
      const newArticle = await createArticle({
        title,
        content: editedContent,
        keywords: keywordsList,
        campaign_id: selectedCampaignId,
        status: 'draft',
        thumbnail_url: generatedImageUrl || undefined
      });
      
      setIsSaving(false);
      toast.success("Article saved successfully");
      
      // Navigate to the article editor page
      navigate(`/dashboard/article-editor/${newArticle.id}`);
    } catch (error) {
      console.error("Error saving article:", error);
      setIsSaving(false);
      toast.error("Failed to save article");
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>AI Content Generator</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="preview">Content Preview</TabsTrigger>
              </TabsList>
              
              <TabsContent value="settings" className="space-y-4 mt-4">
                <ArticleForm
                  title={title}
                  setTitle={setTitle}
                  keywords={keywords}
                  setKeywords={setKeywords}
                  contentType={contentType}
                  setContentType={setContentType}
                  contentLength={contentLength}
                  setContentLength={setContentLength}
                  tone={tone}
                  setTone={setTone}
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                  setIsGenerating={setIsGenerating}
                  setGeneratedContent={setGeneratedContent}
                  handleKeywordInput={handleKeywordInput}
                  keywordSuggestions={keywordSuggestions}
                  addKeyword={addKeyword}
                  isLoadingSuggestions={isLoadingSuggestions}
                  getSuggestions={getSuggestions}
                  campaigns={campaigns}
                  selectedCampaignId={selectedCampaignId}
                  setSelectedCampaignId={setSelectedCampaignId}
                  generateAIImage={generateAIImage}
                  setGenerateAIImage={setGenerateAIImage}
                />
              </TabsContent>
              
              <TabsContent value="preview" className="space-y-4 mt-4">
                {isGeneratingImage && (
                  <div className="flex items-center justify-center p-4 bg-muted rounded-md mb-4">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm">Generating featured image...</span>
                  </div>
                )}
                {generatedImageUrl && (
                  <div className="mb-4 p-4 border rounded-md">
                    <h3 className="text-sm font-medium mb-2">Featured Image:</h3>
                    <div className="flex justify-center">
                      <img 
                        src={generatedImageUrl} 
                        alt="Featured" 
                        className="max-h-48 object-contain" 
                      />
                    </div>
                  </div>
                )}
                <ContentPreview 
                  isGenerating={isGenerating}
                  generatedContent={generatedContent}
                  onContentChange={setEditedContent}
                  onSaveArticle={handleSaveArticle}
                  isSaving={isSaving}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ArticleGenerator;
