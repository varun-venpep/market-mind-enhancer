
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Edit, Eye, FileText, Import, Loader2, Save, Sparkles, ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { fetchUserCampaigns, createArticle, generateArticleContent, generateArticleThumbnail, calculateSEOScore, updateArticle } from '@/services/articleService';
import { Article, Campaign } from '@/types';
import { supabase } from "@/integrations/supabase/client";
import ArticlePreview from "@/components/Articles/ArticlePreview";

// Form schema for article generation
const formSchema = z.object({
  campaignId: z.string().min(1, "Please select a campaign"),
  keywords: z.string().min(1, {
    message: "Please enter at least one keyword."
  }),
  title: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

const ArticleGenerator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("manual");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const initialCampaignId = location.state?.campaignId || "";
  const [generatedArticle, setGeneratedArticle] = useState<Article | null>(null);
  const [viewMode, setViewMode] = useState<'form' | 'preview' | 'edit'>('form');
  const [editableContent, setEditableContent] = useState("");
  const [editableTitle, setEditableTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  // Setup form with validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      campaignId: initialCampaignId,
      keywords: "",
      title: ""
    }
  });

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        setIsLoading(true);
        const data = await fetchUserCampaigns();
        setCampaigns(data);
        
        // If we don't have an initial campaign and there are campaigns available,
        // set the first one as default
        if (!initialCampaignId && data.length > 0 && !form.getValues().campaignId) {
          form.setValue('campaignId', data[0].id);
        }
      } catch (error) {
        console.error("Error loading campaigns:", error);
        toast.error("Failed to load campaigns");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCampaigns();
  }, [initialCampaignId, form]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (isGenerating) return; // Prevent multiple submissions
      
      setIsGenerating(true);
      setGenerationError(null);
      
      // Process the keywords
      const keywordArray = values.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
      
      if (keywordArray.length === 0) {
        toast.error("Please enter at least one keyword");
        setIsGenerating(false);
        return;
      }
      
      // Generate a title if not provided
      let title = values.title;
      if (!title) {
        // Use the first keyword as the title or generate one
        title = keywordArray[0].charAt(0).toUpperCase() + keywordArray[0].slice(1);
      }
      
      // Create a dismissible toast for the generation process
      const toastId = toast.loading("Initiating article generation...");
      
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.dismiss(toastId);
        toast.error("You must be logged in to create articles");
        setIsGenerating(false);
        return;
      }
      
      // Start with a basic article object
      const articleData = {
        title,
        keywords: keywordArray,
        campaign_id: values.campaignId,
        status: 'in-progress' as const,
      };
      
      // Create the article in the database
      let article;
      try {
        toast.loading("Creating article draft...", { id: toastId });
        article = await createArticle(articleData);
        console.log("Created article:", article);
      } catch (createError) {
        console.error("Error creating article:", createError);
        toast.dismiss(toastId);
        toast.error("Failed to create article. Please try again.");
        setIsGenerating(false);
        return;
      }
      
      try {
        // Generate content and thumbnail in parallel
        toast.loading("Generating SEO content and thumbnail...", { id: toastId });
        
        const contentPromise = generateArticleContent(title, keywordArray);
        const thumbnailPromise = generateArticleThumbnail(title, keywordArray);
        
        // Handle both promises
        const [contentResult, thumbnailUrl] = await Promise.all([contentPromise, thumbnailPromise]);
        
        const { content, wordCount } = contentResult;
        
        // Calculate the SEO score
        toast.loading("Calculating SEO score...", { id: toastId });
        const score = await calculateSEOScore(content, keywordArray);
        
        // Update the article with generated content
        toast.loading("Saving article...", { id: toastId });
        const updatedArticle = await updateArticle(article.id, {
          content,
          word_count: wordCount,
          thumbnail_url: thumbnailUrl,
          score,
          status: 'completed'
        });
        
        console.log("Updated article:", updatedArticle);
        
        // Set the generated article for preview
        setGeneratedArticle(updatedArticle);
        setEditableContent(content);
        setEditableTitle(updatedArticle.title);
        
        // Clear the loading toast and show success
        toast.dismiss(toastId);
        toast.success("Article generated successfully");
        
        // Switch to preview mode
        setViewMode('preview');
      } catch (error) {
        console.error("Error during content generation:", error);
        setGenerationError(error instanceof Error ? error.message : "Unknown error occurred");
        
        // Update the article status to 'draft' instead of 'failed'
        if (article) {
          await updateArticle(article.id, {
            status: 'draft'
          });
        }
        
        // Clear the loading toast and show error
        toast.dismiss(toastId);
        toast.error("Failed to generate article content. Please try again.");
      }
    } catch (error) {
      console.error("Error in article generation process:", error);
      toast.error("Failed to create article. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveEditedArticle = async () => {
    if (!generatedArticle) return;
    
    setIsSaving(true);
    const toastId = toast.loading("Saving article...");
    
    try {
      // Calculate word count
      const wordCount = editableContent.split(/\s+/).filter(Boolean).length;
      
      // Update the article with edited content
      const updatedArticle = await updateArticle(generatedArticle.id, {
        content: editableContent,
        title: editableTitle,
        word_count: wordCount,
        updated_at: new Date().toISOString()
      });
      
      console.log("Saved edited article:", updatedArticle);
      
      // Update the local state
      setGeneratedArticle(updatedArticle);
      
      toast.dismiss(toastId);
      toast.success("Article saved successfully");
      
      // Switch back to preview mode
      setViewMode('preview');
    } catch (error) {
      console.error("Error saving edited article:", error);
      toast.dismiss(toastId);
      toast.error("Failed to save article. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditMode = () => {
    if (generatedArticle) {
      setEditableContent(generatedArticle.content || '');
      setEditableTitle(generatedArticle.title);
      setViewMode('edit');
    }
  };

  const handleViewInCampaign = () => {
    if (generatedArticle && generatedArticle.campaign_id) {
      navigate(`/dashboard/campaigns/${generatedArticle.campaign_id}`);
    } else {
      navigate('/dashboard/campaigns');
    }
  };

  const handleNavigateToEditor = () => {
    if (generatedArticle) {
      navigate(`/dashboard/article-editor/${generatedArticle.id}`);
    }
  };

  const handleViewArticleDetails = () => {
    if (generatedArticle) {
      navigate(`/dashboard/articles/${generatedArticle.id}`);
    }
  };

  const handleBackToForm = () => {
    setViewMode('form');
  };

  // Form view for article generation
  if (viewMode === 'form') {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/dashboard/campaigns')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Campaigns
              </Button>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold gradient-text">AI Article Generator</h1>
                <p className="text-muted-foreground mt-1">
                  Create high-quality, SEO-optimized articles based on keywords
                </p>
              </div>
            </div>
            
            {generationError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Generation Error</h3>
                    <p className="text-sm text-red-700 mt-1">{generationError}</p>
                    <p className="text-sm text-red-600 mt-2">Please try again or adjust your keywords.</p>
                  </div>
                </div>
              </div>
            )}
            
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Create SEO Article</CardTitle>
                <CardDescription>
                  Enter keywords for your article. Our AI will generate SEO-optimized content based on your input.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="campaignId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Campaign</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            value={field.value}
                            disabled={isLoading || isGenerating}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a campaign" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {campaigns.map((campaign) => (
                                <SelectItem key={campaign.id} value={campaign.id}>
                                  {campaign.name}
                                </SelectItem>
                              ))}
                              {campaigns.length === 0 && (
                                <SelectItem value="none" disabled>
                                  No campaigns available
                                </SelectItem>
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="keywords"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Keywords</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter keywords separated by commas (e.g., 'gardening for beginners, best tools for gardeners')"
                              className="min-h-[100px]"
                              disabled={isGenerating}
                              {...field}
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground mt-1">
                            These keywords will be used to optimize your article for search engines.
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Leave blank to generate from keywords"
                              disabled={isGenerating}
                              {...field}
                            />
                          </FormControl>
                          <p className="text-xs text-muted-foreground mt-1">
                            If left blank, we'll generate a title based on your keywords.
                          </p>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={form.handleSubmit(onSubmit)} 
                  className="gradient-button"
                  disabled={isGenerating || isLoading}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Article...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Article
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Preview view for generated article
  if (viewMode === 'preview' && generatedArticle) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBackToForm}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Generator
              </Button>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold">{generatedArticle.title}</h1>
                  <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                    <CheckCircle className="h-3 w-3 mr-1" /> Generated
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                  {generatedArticle.keywords?.map((keyword, index) => (
                    <Badge key={index} variant="secondary">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-2 md:mt-0">
                <Button 
                  variant="outline"
                  onClick={handleEditMode}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="default"
                  onClick={handleViewArticleDetails}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Article
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Article Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="prose dark:prose-invert max-w-none">
                    {generatedArticle.thumbnail_url && (
                      <div className="mb-6">
                        <img 
                          src={generatedArticle.thumbnail_url} 
                          alt={generatedArticle.title} 
                          className="w-full rounded-md border object-cover max-h-[300px]" 
                        />
                      </div>
                    )}
                    <div dangerouslySetInnerHTML={{ __html: generatedArticle.content?.replace(/\n/g, '<br/>') || 'No content available.' }} />
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Article Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">SEO Score</p>
                      <div className="flex items-center mt-1">
                        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${generatedArticle.score || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm ml-2">{generatedArticle.score || 0}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Word Count</p>
                      <p className="text-sm">{generatedArticle.word_count || 0} words</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <Badge variant="outline" className="mt-1">
                        {generatedArticle.status}
                      </Badge>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Campaign</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {campaigns.find(c => c.id === generatedArticle.campaign_id)?.name || 'Unknown Campaign'}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    <Button 
                      className="w-full"
                      onClick={handleNavigateToEditor}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit in Full Editor
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full"
                      onClick={handleViewInCampaign}
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Go to Campaign
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Edit view for generated article
  if (viewMode === 'edit' && generatedArticle) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setViewMode('preview')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Preview
              </Button>
            </div>
            
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Edit Article</CardTitle>
                <CardDescription>Make changes to your generated article</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Article Title</Label>
                  <Input 
                    id="title"
                    value={editableTitle}
                    onChange={(e) => setEditableTitle(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="content">Article Content</Label>
                  <Textarea 
                    id="content"
                    value={editableContent}
                    onChange={(e) => setEditableContent(e.target.value)}
                    className="mt-1 min-h-[400px] font-mono text-sm"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setViewMode('preview')}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSaveEditedArticle}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Fallback view (shouldn't happen in normal flow)
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/dashboard/campaigns')}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Campaigns
          </Button>
        </div>
        
        <Card className="mt-8 text-center p-8">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-muted-foreground mb-6">
              We encountered an issue with the article generator.
            </p>
            <Button onClick={() => setViewMode('form')}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

// Missing Label component definition
const Label = ({ htmlFor, children, className = "" }: { htmlFor: string; children: React.ReactNode; className?: string }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium ${className}`}>
    {children}
  </label>
);

export default ArticleGenerator;
