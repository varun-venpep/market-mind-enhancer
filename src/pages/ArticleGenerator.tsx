import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Editor } from '@tinymce/tinymce-react';
import { generateArticleContent, generateArticleThumbnail } from '@/services/articles/ai';
import { createArticle } from '@/services/articles';
import { ArticleCreationData } from '@/services/articles/types';
import { ArrowLeft, Loader2, Wand2, Image, Save } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { InfoIcon } from "lucide-react";
import { getTinyMceApiKey } from '@/services/tinyMceService';

const ArticleGenerator = () => {
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  const [campaignId, setCampaignId] = useState<string | null>(null);
  const [tinyMceKey, setTinyMceKey] = useState<string>('');
  
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('campaignId');
    if (id) {
      setCampaignId(id);
    }
    
    const fetchApiKey = async () => {
      try {
        const apiKey = await getTinyMceApiKey();
        setTinyMceKey(apiKey);
      } catch (error) {
        console.error('Error fetching TinyMCE API key:', error);
        toast.error('Failed to load rich text editor. Please refresh the page.');
      }
    };
    
    fetchApiKey();
  }, [location]);
  
  const handleGenerateContent = async () => {
    const trimmedTitle = title.trim();
    const keywordsArray = keywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);
    
    if (!trimmedTitle) {
      toast.error("Please enter a title before generating content.");
      return;
    }
    
    if (keywordsArray.length === 0) {
      toast.error("Please enter at least one keyword before generating content.");
      return;
    }
    
    setIsGeneratingContent(true);
    try {
      const { content: generatedContent, wordCount } = await generateArticleContent(trimmedTitle, keywordsArray);
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
    const trimmedTitle = title.trim();
    const keywordsArray = keywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k.length > 0);
    
    if (!trimmedTitle) {
      toast.error("Please enter a title before generating a thumbnail.");
      return;
    }
    
    if (keywordsArray.length === 0) {
      toast.error("Please enter at least one keyword before generating a thumbnail.");
      return;
    }
    
    setIsGeneratingThumbnail(true);
    try {
      const thumbnailUrl = await generateArticleThumbnail(trimmedTitle, keywordsArray);
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

  const addKeywordBadge = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      const newKeyword = e.currentTarget.value.trim();
      if (newKeyword) {
        const keywordsArray = keywords ? keywords.split(',').map(k => k.trim()) : [];
        if (!keywordsArray.includes(newKeyword)) {
          keywordsArray.push(newKeyword);
          setKeywords(keywordsArray.join(', '));
          e.currentTarget.value = '';
        }
      }
    }
  };

  const removeKeyword = (keywordToRemove: string) => {
    const keywordsArray = keywords.split(',').map(k => k.trim());
    const filteredKeywords = keywordsArray.filter(k => k !== keywordToRemove);
    setKeywords(filteredKeywords.join(', '));
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="keywords">Keywords</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <InfoIcon className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="space-y-2">
                          <h4 className="font-medium">Keyword Tips</h4>
                          <p className="text-sm text-muted-foreground">
                            Enter keywords separated by commas or press Enter after each keyword. 
                            Good keywords are specific and relevant to your article's topic.
                          </p>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <Input
                    id="keywords"
                    placeholder="Enter keywords and press Enter"
                    onKeyDown={addKeywordBadge}
                  />
                  {keywords && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {keywords.split(',').map((keyword, idx) => {
                        const trimmed = keyword.trim();
                        return trimmed ? (
                          <Badge key={idx} variant="secondary" className="cursor-pointer" onClick={() => removeKeyword(trimmed)}>
                            {trimmed} ×
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
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
                <CardDescription>
                  Write or generate your article content using the rich text editor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Editor
                  apiKey={tinyMceKey || 'no-api-key'}
                  init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                      'bold italic forecolor | alignleft aligncenter ' +
                      'alignright alignjustify | bullist numlist outdent indent | ' +
                      'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                  }}
                  value={content}
                  onEditorChange={(newContent) => setContent(newContent)}
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
