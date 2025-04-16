import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { Editor } from '@tinymce/tinymce-react';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Plus, X, Loader2, RefreshCw, Wand2 } from "lucide-react";
import { useArticleEditor } from "@/hooks/useArticleEditor";
import { Article } from '@/types';
import { fetchArticle } from '@/services/articles';
import { generateArticleContent, generateArticleThumbnail, optimizeArticleContent, calculateSEOScore } from '@/services/articles/ai';

const ArticleEditor = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isCalculatingScore, setIsCalculatingScore] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [optimizationError, setOptimizationError] = useState<string | null>(null);
  const [scoreCalculationError, setScoreCalculationError] = useState<string | null>(null);
  
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
  
  const handleGoBack = () => {
    if (article && article.campaign_id) {
      navigate(`/dashboard/campaign/${article.campaign_id}`);
    } else {
      navigate('/dashboard/campaigns');
    }
  };
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };
  
  const handleContentChange = (value: string, editor: any) => {
    setContent(value);
  };
  
  const handleKeywordInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      addKeyword(input.value);
      input.value = '';
    }
  };
  
  const handleGenerateContent = async () => {
    if (!title || keywords.length === 0) {
      toast.error("Please enter a title and at least one keyword before generating content.");
      return;
    }
    
    setIsGenerating(true);
    setGenerationError(null);
    
    try {
      const { content: generatedContent, wordCount } = await generateArticleContent(title, keywords);
      setContent(generatedContent);
      
      // Optimistically update the article data with the new word count
      setArticle(prevArticle => {
        if (prevArticle) {
          return { ...prevArticle, word_count: wordCount };
        }
        return prevArticle;
      });
      
      toast.success("Article content generated successfully!");
    } catch (error) {
      console.error("Error generating content:", error);
      setGenerationError("Failed to generate article content. Please try again.");
      toast.error("Failed to generate article content.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleGenerateThumbnail = async () => {
    if (!title || keywords.length === 0) {
      toast.error("Please enter a title and at least one keyword before generating a thumbnail.");
      return;
    }
    
    setIsGenerating(true);
    setGenerationError(null);
    
    try {
      const thumbnailUrl = await generateArticleThumbnail(title, keywords);
      
      // Optimistically update the article data with the new thumbnail URL
      setArticle(prevArticle => {
        if (prevArticle) {
          return { ...prevArticle, thumbnail_url: thumbnailUrl };
        }
        return prevArticle;
      });
      
      // Save the changes to the article
      if (article) {
        await forceSave();
      }
      
      toast.success("Article thumbnail generated successfully!");
    } catch (error) {
      console.error("Error generating thumbnail:", error);
      setGenerationError("Failed to generate article thumbnail. Please try again.");
      toast.error("Failed to generate article thumbnail.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleOptimizeContent = async () => {
    if (!content || keywords.length === 0) {
      toast.error("Please enter article content and at least one keyword before optimizing.");
      return;
    }
    
    setIsOptimizing(true);
    setOptimizationError(null);
    
    try {
      const optimizedContent = await optimizeArticleContent(content, keywords);
      setContent(optimizedContent);
      toast.success("Article content optimized successfully!");
    } catch (error) {
      console.error("Error optimizing content:", error);
      setOptimizationError("Failed to optimize article content. Please try again.");
      toast.error("Failed to optimize article content.");
    } finally {
      setIsOptimizing(false);
    }
  };
  
  const handleCalculateSEOScore = async () => {
    if (!content || keywords.length === 0) {
      toast.error("Please enter article content and at least one keyword before calculating SEO score.");
      return;
    }
    
    setIsCalculatingScore(true);
    setScoreCalculationError(null);
    
    try {
      const score = await calculateSEOScore(content, keywords);
      
      // Optimistically update the article data with the new SEO score
      setArticle(prevArticle => {
        if (prevArticle) {
          return { ...prevArticle, score: score };
        }
        return prevArticle;
      });
      
      // Save the changes to the article
      if (article) {
        await forceSave();
      }
      
      toast.success(`SEO score calculated successfully: ${score}`);
    } catch (error) {
      console.error("Error calculating SEO score:", error);
      setScoreCalculationError("Failed to calculate SEO score. Please try again.");
      toast.error("Failed to calculate SEO score.");
    } finally {
      setIsCalculatingScore(false);
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
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Article
                </>
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
                  onChange={handleTitleChange}
                />
              </div>
              <div>
                <Label htmlFor="keywords">Keywords</Label>
                <div className="flex items-center">
                  <Input
                    type="text"
                    id="keywords"
                    placeholder="Enter keywords and press Enter"
                    onKeyDown={handleKeywordInput}
                    className="mr-2"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleGenerateContent}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate Content
                      </>
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleGenerateThumbnail}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Generate Thumbnail
                      </>
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleOptimizeContent}
                    disabled={isOptimizing}
                  >
                    {isOptimizing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Optimize Content
                      </>
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCalculateSEOScore}
                    disabled={isCalculatingScore}
                  >
                    {isCalculatingScore ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Calculating...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Calculate SEO Score
                      </>
                    )}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {keywords.map((keyword) => (
                    <div
                      key={keyword}
                      className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full px-3 py-1 text-sm flex items-center"
                    >
                      {keyword}
                      <button
                        onClick={() => removeKeyword(keyword)}
                        className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                  value={content}
                  onEditorChange={handleContentChange}
                  init={{
                    height: '70vh',
                    menubar: true,
                    plugins: [
                      'advlist autolink lists link image charmap print preview anchor',
                      'searchreplace visualblocks code fullscreen',
                      'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar: 'undo redo | formatselect | ' +
                      'bold italic backcolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                  }}
                />
              </div>
              {saveError && (
                <div className="text-red-500">Error: {saveError}</div>
              )}
              {generationError && (
                <div className="text-red-500">Error: {generationError}</div>
              )}
              {optimizationError && (
                <div className="text-red-500">Error: {optimizationError}</div>
              )}
              {scoreCalculationError && (
                <div className="text-red-500">Error: {scoreCalculationError}</div>
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
