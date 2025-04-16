
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Article } from '@/types';
import { generateArticleContent, generateArticleThumbnail } from '@/services/articles/ai';
import { fetchArticle } from '@/services/articles';
import { useArticleEditor } from '@/hooks/useArticleEditor';
import RichTextEditor from '@/components/Articles/RichTextEditor';
import KeywordsManager from '@/components/Articles/KeywordsManager';
import { ArticleMetadata } from '@/components/Articles/ArticleMetadata';
import { ArticleActions } from '@/components/Articles/ArticleActions';

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
            <Button onClick={() => navigate("/dashboard/campaigns")}>
              Go to Campaigns
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={handleGoBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => toggleAutoSave(!autoSaveEnabled)}
            >
              {autoSaveEnabled ? 'Disable Auto-Save' : 'Enable Auto-Save'}
            </Button>
            <Button
              variant="default"
              onClick={forceSave}
              disabled={isSaving || !isDirty}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Article'
              )}
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  type="text"
                  id="title"
                  placeholder="Article Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <KeywordsManager
                keywords={keywords}
                onAddKeyword={addKeyword}
                onRemoveKeyword={removeKeyword}
              />

              <Button
                variant="secondary"
                onClick={handleGenerateContent}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Content'
                )}
              </Button>

              <div>
                <Label htmlFor="content">Content</Label>
                <RichTextEditor
                  content={content}
                  onChange={setContent}
                />
              </div>

              {saveError && (
                <div className="text-red-500">Error: {saveError}</div>
              )}
              {generationError && (
                <div className="text-red-500">Error: {generationError}</div>
              )}
              {lastSavedAt && (
                <div className="text-sm text-gray-500">
                  Last saved: {lastSavedAt.toLocaleTimeString()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ArticleEditor;
