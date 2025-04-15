
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Edit, Eye, FileText, Import, Loader2, Save, Sparkles } from "lucide-react";
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
      const toastId = toast.loading("Generating article...");
      
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
        const [contentResult, thumbnailUrl] = await Promise.all([
          generateArticleContent(title, keywordArray),
          generateArticleThumbnail(title, keywordArray)
        ]);
        
        const { content, wordCount } = contentResult;
        
        // Calculate the SEO score
        const score = await calculateSEOScore(content, keywordArray);
        
        // Update the article with generated content
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
        
        // Update the article status to 'failed'
        if (article) {
          await updateArticle(article.id, {
            status: 'failed'
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
      // Update the article with edited content
      const updatedArticle = await updateArticle(generatedArticle.id, {
        content: editableContent,
        title: editableTitle,
        word_count: editableContent.split(/\s+/).length,
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
                <h1 className="text-3xl font-bold gradient-text">Generate SEO Articles</h1>
                <p className="text-muted-foreground mt-1">
                  Create high-quality, SEO-optimized articles based on keywords
                </p>
              </div>
            </div>
            
            <Tabs 
              defaultValue="manual" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="mb-8"
            >
              <TabsList className="mb-6">
                <TabsTrigger value="manual" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>Manual</span>
                </TabsTrigger>
                <TabsTrigger value="import" className="flex items-center gap-1">
                  <Import className="h-4 w-4" />
                  <span>Import</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual">
                <Card>
                  <CardHeader>
                    <CardTitle>Create SEO Article</CardTitle>
                    <CardDescription>
                      Enter keywords for your article. You can add an optional title or we'll generate one for you.
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
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end">
                          <Button 
                            type="submit" 
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
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="import">
                <Card>
                  <CardHeader>
                    <CardTitle>Import Keywords</CardTitle>
                    <CardDescription>
                      Import keywords from CSV, Excel or other sources
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <Import className="h-16 w-16 text-blue-500/30 mb-4" />
                      <p className="text-muted-foreground font-medium">Import Feature Coming Soon</p>
                      <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                        This feature is under development and will be available soon.
                        For now, please use the manual entry method.
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-center">
                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab("manual")}
                    >
                      Switch to Manual Entry
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
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
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold">{generatedArticle.title}</h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  {generatedArticle.keywords?.map((keyword, index) => (
                    <span key={index} className="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full text-xs">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <Button 
                  variant="outline" 
                  onClick={handleViewInCampaign}
                >
                  View in Campaign
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleEditMode}
                  className="flex gap-1"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleNavigateToEditor}
                  className="flex gap-1"
                >
                  <FileText className="h-4 w-4" />
                  Open in Editor
                </Button>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {generatedArticle.thumbnail_url && (
                    <img 
                      src={generatedArticle.thumbnail_url} 
                      alt={generatedArticle.title} 
                      className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                  )}
                  <div dangerouslySetInnerHTML={{ __html: generatedArticle.content?.replace(/\n/g, '<br/>') || '' }} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Edit view for the article
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
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div className="w-full">
                <Input
                  value={editableTitle}
                  onChange={(e) => setEditableTitle(e.target.value)}
                  className="text-2xl font-bold border-none shadow-none focus-visible:ring-0 px-0 text-3xl"
                  placeholder="Article Title"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {generatedArticle.keywords?.map((keyword, index) => (
                    <span key={index} className="bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full text-xs">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <Button 
                  variant="outline" 
                  onClick={() => setViewMode('preview')}
                  className="flex gap-1"
                >
                  <Eye className="h-4 w-4" />
                  Preview
                </Button>
                <Button 
                  className="gradient-button flex gap-1"
                  onClick={handleSaveEditedArticle}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {generatedArticle.thumbnail_url && (
                    <img 
                      src={generatedArticle.thumbnail_url} 
                      alt={editableTitle} 
                      className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                  )}
                  <Textarea
                    value={editableContent}
                    onChange={(e) => setEditableContent(e.target.value)}
                    className="min-h-[500px] font-mono"
                    placeholder="Article content..."
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  className="gradient-button"
                  onClick={handleSaveEditedArticle}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
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

  // Fallback view
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ArticleGenerator;
