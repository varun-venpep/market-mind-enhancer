
import React from 'react';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArticleForm from "@/components/ArticleGenerator/ArticleForm";
import ContentPreview from "@/components/ArticleGenerator/ContentPreview";
import ImagePreview from "@/components/ArticleGenerator/ImagePreview";
import ArticlePreviewDialog from "@/components/ArticleGenerator/ArticlePreviewDialog";
import { useArticleGenerator } from '@/hooks/useArticleGenerator';

const ArticleGenerator = () => {
  const {
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
    isGenerating,
    setIsGenerating,
    generatedContent,
    setGeneratedContent,
    editedContent,
    setEditedContent,
    activeTab,
    setActiveTab,
    previewDialogOpen,
    setPreviewDialogOpen,
    keywordSuggestions,
    isLoadingSuggestions,
    campaigns,
    selectedCampaignId,
    setSelectedCampaignId,
    generateAIImage,
    setGenerateAIImage,
    generatedImageUrl,
    isGeneratingImage,
    isSaving,
    handleGenerate,
    handleKeywordInput,
    getSuggestions,
    addKeyword,
    handleSaveArticle
  } = useArticleGenerator();

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
                <ImagePreview 
                  isGeneratingImage={isGeneratingImage}
                  generatedImageUrl={generatedImageUrl}
                />
                <ContentPreview 
                  isGenerating={isGenerating}
                  generatedContent={generatedContent}
                  generatedImageUrl={generatedImageUrl}
                  handleSaveArticle={handleSaveArticle}
                  isSaving={isSaving}
                />
              </TabsContent>
            </Tabs>
            
            {/* Article Preview Dialog */}
            <ArticlePreviewDialog
              isOpen={previewDialogOpen}
              onOpenChange={setPreviewDialogOpen}
              title={title}
              content={generatedContent}
              imageUrl={generatedImageUrl}
              isSaving={isSaving}
              onSave={handleSaveArticle}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ArticleGenerator;
