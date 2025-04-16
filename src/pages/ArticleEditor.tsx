
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Article } from '@/types';
import { generateArticleContent } from '@/services/articles/ai';
import { fetchArticle } from '@/services/articles';
import { useArticleEditor } from '@/hooks/useArticleEditor';
import RichTextEditor from '@/components/Articles/RichTextEditor';
import ArticleHeader from '@/components/Articles/ArticleHeader';
import ArticleGenerationControls from '@/components/Articles/ArticleGenerationControls';
import ErrorDisplay from '@/components/Articles/ErrorDisplay';

const ArticleEditor = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const {
    title,
    setTitle,
    content,
    setContent,
    keywords,
    setKeywords,
    addKeyword,
    removeKeyword,
    isSaving,
    isDirty,
    saveChanges,
    forceSave,
    saveError,
    lastSavedAt,
    autoSaveEnabled,
    toggleAutoSave
  } = useArticleEditor(article);

  useEffect(() => {
    const loadArticle = async () => {
      if (!articleId) return;
      try {
        setIsLoading(true);
        const data = await fetchArticle(articleId);
        setArticle(data);
      } catch (error) {
        console.error("Error loading article:", error);
        toast.error("Failed to load article");
        navigate('/dashboard/articles');
      } finally {
        setIsLoading(false);
      }
    };
    loadArticle();
  }, [articleId, navigate]);

  const handleGenerateContent = async () => {
    if (!title || keywords.length === 0) {
      toast.error("Please enter a title and at least one keyword before generating content.");
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const { content: generatedContent } = await generateArticleContent(title, keywords);
      setContent(generatedContent);
      toast.success("Article content generated successfully!");
    } catch (error) {
      console.error("Error generating content:", error);
      setGenerationError("Failed to generate article content. Please try again.");
      toast.error("Failed to generate article content.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGoBack = () => {
    if (article?.campaign_id) {
      navigate(`/dashboard/campaign/${article.campaign_id}`);
    } else {
      navigate('/dashboard/campaigns');
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8 flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!article) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The article you are looking for does not exist or has been deleted.
            </p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <ArticleHeader
          onBack={handleGoBack}
          onSave={forceSave}
          onToggleAutoSave={toggleAutoSave}
          isSaving={isSaving}
          isDirty={isDirty}
          autoSaveEnabled={autoSaveEnabled}
        />

        <Card>
          <CardContent className="p-6">
            <ArticleGenerationControls
              title={title}
              onTitleChange={setTitle}
              keywords={keywords}
              onAddKeyword={addKeyword}
              onRemoveKeyword={removeKeyword}
              onGenerate={handleGenerateContent}
              isGenerating={isGenerating}
            />

            <div className="mt-4">
              <Label htmlFor="content">Content</Label>
              <RichTextEditor
                content={content}
                onChange={setContent}
              />
            </div>

            <ErrorDisplay
              saveError={saveError}
              generationError={generationError}
              lastSavedAt={lastSavedAt}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ArticleEditor;
