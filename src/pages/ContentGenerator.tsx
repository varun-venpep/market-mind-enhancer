
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Image as ImageIcon } from 'lucide-react';
import { useContentGenerator } from '@/hooks/useContentGenerator';
import ContentSettings from '@/components/ContentGenerator/ContentSettings';
import ContentPreview from '@/components/ContentGenerator/ContentPreview';
import ImageGenerator from '@/components/ContentGenerator/ImageGenerator';

export default function ContentGenerator() {
  const navigate = useNavigate();
  const {
    activeTab,
    setActiveTab,
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
    isGenerating,
    generatedContent,
    imagePrompt,
    setImagePrompt,
    generateAIImage,
    setGenerateAIImage,
    generatedImageUrl,
    isGeneratingImage,
    keywordSuggestions,
    isLoadingSuggestions,
    isSaving,
    handleGenerate,
    handleGenerateImage,
    getSuggestions,
    addKeyword,
    handleSaveArticle
  } = useContentGenerator();

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard/integrations')} 
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Integrations
          </Button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold gradient-text">AI Content Generator</h1>
            <p className="text-muted-foreground mt-1">
              Generate SEO-optimized content and images powered by Google's Gemini AI
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="blog-post" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Content Creator</span>
            </TabsTrigger>
            <TabsTrigger value="image-generator" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              <span>Image Generator</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="blog-post">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <ContentSettings 
                prompt={prompt}
                setPrompt={setPrompt}
                keywords={keywords}
                setKeywords={setKeywords}
                contentType={contentType}
                setContentType={setContentType}
                contentLength={contentLength}
                setContentLength={setContentLength}
                tone={tone}
                setTone={setTone}
                generateAIImage={generateAIImage}
                setGenerateAIImage={setGenerateAIImage}
                keywordSuggestions={keywordSuggestions}
                isLoadingSuggestions={isLoadingSuggestions}
                getSuggestions={getSuggestions}
                addKeyword={addKeyword}
                handleGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
              
              <ContentPreview 
                isGenerating={isGenerating}
                generatedContent={generatedContent}
                generatedImageUrl={generatedImageUrl}
                handleSaveArticle={handleSaveArticle}
                isSaving={isSaving}
              />
            </div>
          </TabsContent>

          <TabsContent value="image-generator">
            <ImageGenerator 
              imagePrompt={imagePrompt}
              setImagePrompt={setImagePrompt}
              handleGenerateImage={() => handleGenerateImage()}
              isGeneratingImage={isGeneratingImage}
              generatedImageUrl={generatedImageUrl}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
