
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { generateArticleContent, generateArticleThumbnail } from '@/services/articles/ai';
import { createArticle } from '@/services/articles';
import { ArticleCreationData } from '@/services/articles/types';
import { ArrowLeft, Loader2, Wand2, Image, Save } from 'lucide-react';

const ArticleGenerator = () => {
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Extract campaignId from URL search params
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('campaignId');
    if (id) {
      setCampaignId(id);
    }
  }, [location]);
  
  const handleGenerateContent = async () => {
    if (!title || !keywords) {
      toast.error("Please enter a title and keywords before generating content.");
      return;
    }
    
    setIsGeneratingContent(true);
    try {
      const keywordsArray = keywords.split(',').map(k => k.trim());
      const { content: generatedContent, wordCount } = await generateArticleContent(title, keywordsArray);
      setContent(generatedContent);
      
      toast.success("Article content generated successfully!");
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Failed to generate article content.");
    } finally {
      setIsGeneratingContent(false);
    }
  };
  
  const handleGenerateThumbnail = async () => {
    if (!title || !keywords) {
      toast.error("Please enter a title and keywords before generating a thumbnail.");
      return;
    }
    
    setIsGeneratingThumbnail(true);
    try {
      const keywordsArray = keywords.split(',').map(k => k.trim());
      const thumbnailUrl = await generateArticleThumbnail(title, keywordsArray);
      setThumbnailUrl(thumbnailUrl);
      
      toast.success("Article thumbnail generated successfully!");
    } catch (error) {
      console.error("Error generating thumbnail:", error);
      toast.error("Failed to generate article thumbnail.");
    } finally {
      setIsGeneratingThumbnail(false);
    }
  };
  
  const handleSaveArticle = async () => {
    if (!title || !content) {
      toast.error("Please make sure title and content are not empty before saving.");
      return;
    }
    
    setIsLoading(true);
    try {
      const keywordsArray = keywords.split(',').map(k => k.trim()).filter(Boolean);
      
      const articleData: ArticleCreationData = {
        title,
        keywords: keywordsArray,
        content,
        thumbnail_url: thumbnailUrl,
        word_count: content.split(/\s+/).filter(Boolean).length,
        campaign_id: campaignId
      };
      
      const newArticle = await createArticle(articleData);
      toast.success("Article saved successfully!");
      
      if (campaignId) {
        navigate(`/dashboard/campaign/${campaignId}`);
      } else {
        navigate(`/dashboard/article/${newArticle.id}`);
      }
    } catch (error) {
      console.error("Error saving article:", error);
      toast.error("Failed to save article.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoBack = () => {
    if (campaignId) {
      navigate(`/dashboard/campaign/${campaignId}`);
    } else {
      navigate('/dashboard/campaigns');
    }
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleGoBack}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Create New Article</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Article Details</CardTitle>
                <CardDescription>Enter basic information about your article</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter article title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="keywords">Keywords (comma separated)</Label>
                  <Input
                    id="keywords"
                    placeholder="Enter keywords"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleGenerateContent}
                    disabled={isGeneratingContent}
                    className="w-full"
                  >
                    {isGeneratingContent ? (
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
                    variant="outline" 
                    onClick={handleGenerateThumbnail}
                    disabled={isGeneratingThumbnail}
                    className="w-full"
                  >
                    {isGeneratingThumbnail ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Image className="mr-2 h-4 w-4" />
                        Generate Thumbnail
                      </>
                    )}
                  </Button>
                </div>
                
                {thumbnailUrl && (
                  <div>
                    <Label>Thumbnail</Label>
                    <div className="mt-2 rounded-md overflow-hidden border">
                      <img src={thumbnailUrl} alt="Article Thumbnail" className="w-full h-auto" />
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleSaveArticle}
                  disabled={isLoading}
                >
                  {isLoading ? (
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
              </CardFooter>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
                <CardDescription>Write or generate your article content</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  id="content"
                  className="min-h-[500px]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start writing your article content here, or generate content using the button on the left panel."
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ArticleGenerator;
