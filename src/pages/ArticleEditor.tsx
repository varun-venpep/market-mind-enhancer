
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  ArrowLeft,
  Check,
  Edit,
  Eye,
  FileText,
  Image,
  Loader2,
  Save,
  Sparkles,
  Undo2,
  X,
  AlertCircle,
  HelpCircle
} from "lucide-react";

import { Article } from "@/types";
import { fetchArticle, updateArticle, optimizeArticleContent, optimizeArticleSection, calculateSEOScore, generateArticleThumbnail } from '@/services/articleService';

const ArticleEditor = () => {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizingSection, setOptimizingSection] = useState("");
  const [isRegeneratingImage, setIsRegeneratingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (!articleId) return;
    
    const loadArticle = async () => {
      try {
        setLoading(true);
        const fetchedArticle = await fetchArticle(articleId);
        
        if (!fetchedArticle) {
          toast.error("Article not found");
          navigate("/dashboard/campaigns");
          return;
        }
        
        setArticle(fetchedArticle);
        setTitle(fetchedArticle.title);
        setContent(fetchedArticle.content || "");
        setOriginalContent(fetchedArticle.content || "");
        setKeywords(fetchedArticle.keywords || []);
      } catch (error) {
        console.error("Error loading article:", error);
        toast.error("Failed to load article");
      } finally {
        setLoading(false);
      }
    };
    
    loadArticle();
  }, [articleId, navigate]);

  const getSections = () => {
    if (!content) return [];
    
    // Extract headings from markdown content
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const matches = [...content.matchAll(headingRegex)];
    
    return matches.map(match => ({
      level: match[1].length,
      title: match[2].trim(),
      position: match.index,
    }));
  };

  const handleOptimizeFullArticle = async () => {
    try {
      setIsOptimizing(true);
      toast.loading("Optimizing article...");
      
      const optimizedContent = await optimizeArticleContent(content, keywords);
      setContent(optimizedContent);
      
      // Calculate new SEO score
      const newScore = await calculateSEOScore(optimizedContent, keywords);
      
      // Update the article in the database
      const updatedArticle = await updateArticle(articleId!, {
        content: optimizedContent,
        score: newScore,
        updated_at: new Date().toISOString()
      });
      
      setArticle(updatedArticle);
      
      toast.success("Article optimized successfully");
    } catch (error) {
      console.error("Error optimizing article:", error);
      toast.error("Failed to optimize article");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleOptimizeSection = async (section: string) => {
    try {
      setOptimizingSection(section);
      toast.loading(`Optimizing section: ${section}...`);
      
      const optimizedContent = await optimizeArticleSection(content, section, keywords);
      setContent(optimizedContent);
      
      // Calculate new SEO score
      const newScore = await calculateSEOScore(optimizedContent, keywords);
      
      // Update the article in the database
      const updatedArticle = await updateArticle(articleId!, {
        content: optimizedContent,
        score: newScore,
        updated_at: new Date().toISOString()
      });
      
      setArticle(updatedArticle);
      
      toast.success(`Section "${section}" optimized successfully`);
    } catch (error) {
      console.error(`Error optimizing section ${section}:`, error);
      toast.error("Failed to optimize section");
    } finally {
      setOptimizingSection("");
    }
  };

  const handleRegenerateImage = async () => {
    try {
      setIsRegeneratingImage(true);
      toast.loading("Generating new thumbnail...");
      
      const thumbnailUrl = await generateArticleThumbnail(title, keywords);
      
      // Update the article in the database
      const updatedArticle = await updateArticle(articleId!, {
        thumbnail_url: thumbnailUrl,
        updated_at: new Date().toISOString()
      });
      
      setArticle(updatedArticle);
      
      toast.success("Thumbnail regenerated successfully");
    } catch (error) {
      console.error("Error regenerating thumbnail:", error);
      toast.error("Failed to regenerate thumbnail");
    } finally {
      setIsRegeneratingImage(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      toast.loading("Saving article...");
      
      const wordCount = content.split(/\s+/).filter(Boolean).length;
      const newScore = await calculateSEOScore(content, keywords);
      
      // Update the article in the database
      const updatedArticle = await updateArticle(articleId!, {
        title,
        content,
        word_count: wordCount,
        score: newScore,
        updated_at: new Date().toISOString()
      });
      
      setArticle(updatedArticle);
      setOriginalContent(content);
      setEditMode(false);
      
      toast.success("Article saved successfully");
    } catch (error) {
      console.error("Error saving article:", error);
      toast.error("Failed to save article");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setContent(originalContent);
    setTitle(article?.title || "");
    setEditMode(false);
  };

  const handleUpdateKeywords = async (newKeywords: string[]) => {
    if (!article) return;
    
    try {
      toast.loading("Updating keywords...");
      
      // Update the article in the database
      const updatedArticle = await updateArticle(articleId!, {
        keywords: newKeywords,
        updated_at: new Date().toISOString()
      });
      
      setArticle(updatedArticle);
      setKeywords(newKeywords);
      
      toast.success("Keywords updated successfully");
    } catch (error) {
      console.error("Error updating keywords:", error);
      toast.error("Failed to update keywords");
    }
  };

  // Format markdown content to render as HTML
  const renderContent = (markdown: string) => {
    if (!markdown) return "";
    
    const formatted = markdown
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold mt-5 mb-2">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n- (.*)/g, '<ul class="list-disc pl-6 mb-4"><li>$1</li></ul>')
      .replace(/\n(\d+)\. (.*)/g, '<ol class="list-decimal pl-6 mb-4"><li>$2</li></ol>')
      .replace(/\n\n/g, '<p class="mb-4"></p>');
    
    return formatted;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
                className="gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
            </div>
            
            <div className="flex flex-col gap-4">
              <Skeleton className="h-12 w-3/4 mb-2" />
              <Skeleton className="h-6 w-1/2" />
              
              <Card className="mt-6">
                <CardHeader>
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-4 w-72" />
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-6">
                    <Skeleton className="h-64 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!article) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              The article could not be found. It may have been deleted.
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-center mt-8">
            <Button onClick={() => navigate('/dashboard/campaigns')}>
              Go Back to Campaigns
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const sections = getSections();

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex-1">
              {editMode ? (
                <div className="mb-4">
                  <Label htmlFor="title">Article Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-xl font-bold"
                  />
                </div>
              ) : (
                <h1 className="text-2xl md:text-3xl font-bold gradient-text">{title}</h1>
              )}
              
              <div className="mt-2 flex flex-wrap gap-2">
                {keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              {editMode ? (
                <>
                  <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                    <X className="mr-2 h-4 w-4" /> Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" /> Save
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setEditMode(true)}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <Button 
                    onClick={handleOptimizeFullArticle} 
                    className="gradient-button"
                    disabled={isOptimizing}
                  >
                    {isOptimizing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Optimizing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" /> Optimize
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <div>Article Content</div>
                    <div className="flex gap-2">
                      {editMode ? (
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                          Editing
                        </Badge>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditMode(true)}
                          className="h-8 px-2"
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          <span className="text-xs">Edit</span>
                        </Button>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {editMode ? (
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[60vh] font-mono text-sm"
                    />
                  ) : (
                    <div className="prose max-w-none">
                      {article.thumbnail_url && (
                        <div className="mb-6">
                          <img 
                            src={article.thumbnail_url} 
                            alt={article.title} 
                            className="w-full rounded-md border object-cover max-h-[300px]" 
                          />
                        </div>
                      )}
                      <div dangerouslySetInnerHTML={{ __html: renderContent(content) }} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Article Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">SEO Score</span>
                      <span className="text-sm font-medium">{article.score || 0}/100</span>
                    </div>
                    <Progress value={article.score || 0} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm">Word Count</span>
                      <span className="text-sm font-medium">{article.word_count || 0}</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="status" className="text-sm">Status</Label>
                    <Select 
                      value={article.status} 
                      onValueChange={async (value) => {
                        try {
                          const updatedArticle = await updateArticle(articleId!, {
                            status: value,
                            updated_at: new Date().toISOString()
                          });
                          setArticle(updatedArticle);
                          toast.success("Status updated");
                        } catch (error) {
                          console.error("Error updating status:", error);
                          toast.error("Failed to update status");
                        }
                      }}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-sm">Last Updated</Label>
                    <div className="text-sm text-muted-foreground">
                      {new Date(article.updated_at).toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Featured Image</CardTitle>
                </CardHeader>
                <CardContent>
                  {article.thumbnail_url ? (
                    <div className="space-y-4">
                      <img 
                        src={article.thumbnail_url} 
                        alt={article.title} 
                        className="w-full rounded-md border" 
                      />
                      <Button 
                        onClick={handleRegenerateImage} 
                        variant="outline"
                        className="w-full"
                        disabled={isRegeneratingImage}
                      >
                        {isRegeneratingImage ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                          </>
                        ) : (
                          <>
                            <Image className="mr-2 h-4 w-4" /> Regenerate Image
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Image className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-sm text-muted-foreground">No featured image available</p>
                      <Button 
                        onClick={handleRegenerateImage} 
                        variant="outline"
                        className="mt-4"
                        disabled={isRegeneratingImage}
                      >
                        {isRegeneratingImage ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                          </>
                        ) : (
                          <>
                            <Image className="mr-2 h-4 w-4" /> Generate Image
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {!editMode && sections.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Optimize Sections</CardTitle>
                    <CardDescription>
                      Optimize specific sections of your article.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {sections.map((section, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                          <span className="text-sm font-medium">{section.title}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8"
                            onClick={() => handleOptimizeSection(section.title)}
                            disabled={optimizingSection === section.title}
                          >
                            {optimizingSection === section.title ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Sparkles className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              <Card>
                <CardHeader>
                  <CardTitle>Keywords</CardTitle>
                  <CardDescription>
                    Update keywords to improve SEO.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={keywords.join(', ')}
                    onChange={(e) => {
                      const newKeywords = e.target.value
                        .split(',')
                        .map(k => k.trim())
                        .filter(Boolean);
                      setKeywords(newKeywords);
                    }}
                    placeholder="Enter keywords separated by commas"
                    className="mb-4"
                  />
                  <Button 
                    onClick={() => handleUpdateKeywords(keywords)}
                    className="w-full"
                  >
                    <Check className="mr-2 h-4 w-4" /> Update Keywords
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ArticleEditor;
