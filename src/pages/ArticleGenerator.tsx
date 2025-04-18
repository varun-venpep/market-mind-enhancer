
import React from 'react';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ArticleForm from '@/components/ArticleGenerator/ArticleForm';
import ArticlePreviewDialog from '@/components/ArticleGenerator/ArticlePreviewDialog';
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
            
            {/* Article Preview Dialog */}
            <ArticlePreviewDialog
              isOpen={previewDialogOpen}
              onOpenChange={setPreviewDialogOpen}
              title={title}
              content={editedContent || generatedContent}
              imageUrl={generatedImageUrl}
              isSaving={isSaving}
              onSave={handleSaveArticle}
              onContentChange={(content) => setEditedContent(content)}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ArticleGenerator;
