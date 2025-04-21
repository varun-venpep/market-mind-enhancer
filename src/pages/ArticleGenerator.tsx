
import React from "react";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import ArticleForm from "@/components/ArticleGenerator/ArticleForm";
import ContentPreview from "@/components/ArticleGenerator/ContentPreview";
import { useArticleGenerator } from "@/hooks/useArticleGenerator";

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
    handleSaveArticle,
    isDirty,
    showLeaveConfirm,
    setShowLeaveConfirm,
    handleSaveAndNavigate,
    handleDiscardAndNavigate
  } = useArticleGenerator();

  // Responsive grid: form left, preview/editor right
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
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
          </div>
          <div>
            <ContentPreview
              isGenerating={isGenerating}
              generatedContent={editedContent || generatedContent}
              generatedImageUrl={generatedImageUrl}
              onContentChange={setEditedContent}
              handleSaveArticle={handleSaveArticle}
              isSaving={isSaving}
            />
          </div>
        </div>
        {/* Leave confirmation dialogue */}
        {showLeaveConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white dark:bg-background rounded-lg p-6 shadow-xl w-full max-w-md">
              <div className="font-bold text-lg mb-1">Unsaved Changes Detected</div>
              <div className="mb-4 text-sm text-muted-foreground">
                You have unsaved changes in your article. What would you like to do?
              </div>
              <div className="flex justify-end gap-2">
                <button
                  className="px-4 py-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50 hover:bg-gray-200"
                  onClick={() => setShowLeaveConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                  onClick={handleDiscardAndNavigate}
                >
                  Discard
                </button>
                <button
                  className="px-4 py-2 rounded bg-primary text-white hover:bg-primary/80"
                  onClick={handleSaveAndNavigate}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save & Leave"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ArticleGenerator;
