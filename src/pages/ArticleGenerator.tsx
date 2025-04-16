
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { generateContent } from '@/services/geminiApi';
import ArticleForm from '@/components/ArticleGenerator/ArticleForm';
import ContentPreview from '@/components/ArticleGenerator/ContentPreview';
import ImageGenerator from '@/components/ArticleGenerator/ImageGenerator';

const ArticleGenerator = () => {
  const navigate = useNavigate();
  
  // Form state
  const [activeTab, setActiveTab] = useState('blog-post');
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [contentType, setContentType] = useState('blog-post');
  const [contentLength, setContentLength] = useState('medium');
  const [tone, setTone] = useState('informational');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  
  // Image generation state
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  // Keyword suggestions state
  const [keywordSuggestions, setKeywordSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    setIsGenerating(true);
    setGeneratedContent('');

    try {
      const result = await generateContent(`Create a ${contentType} about "${title}" with a ${tone} tone`);
      setGeneratedContent(result);
      toast.success('Content generated successfully!');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      toast.error('Please enter an image description');
      return;
    }

    setIsGeneratingImage(true);
    setGeneratedImageUrl('');

    try {
      // Your image generation logic here
      const imageUrl = 'https://example.com/placeholder.jpg'; // Replace with actual image generation
      setGeneratedImageUrl(imageUrl);
      toast.success('Image generated successfully!');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleKeywordInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.currentTarget.value.trim();
      if (input) {
        const keywordsList = keywords.split(',').map(k => k.trim());
        if (!keywordsList.includes(input)) {
          const newKeywords = [...keywordsList, input].filter(Boolean).join(', ');
          setKeywords(newKeywords);
        }
        e.currentTarget.value = '';
      }
    }
  };

  const addKeyword = (keyword: string) => {
    const keywordsList = keywords.split(',').map(k => k.trim());
    if (!keywordsList.includes(keyword)) {
      const newKeywords = [...keywordsList, keyword].filter(Boolean).join(', ');
      setKeywords(newKeywords);
      toast.success(`Added "${keyword}" to keywords`);
    }
  };

  const getSuggestions = async () => {
    if (!title.trim()) {
      toast.error('Please enter a topic first');
      return;
    }

    setIsLoadingSuggestions(true);
    setKeywordSuggestions([]);

    try {
      // Your keyword suggestions logic here
      const suggestions = ['example1', 'example2', 'example3'];
      setKeywordSuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching keyword suggestions:', error);
      toast.error('Failed to get keyword suggestions');
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

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
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Content Settings</CardTitle>
                  <CardDescription>
                    Configure your content generation preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                  />
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Generated Content</CardTitle>
                  <CardDescription>
                    Your AI-generated content will appear here
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ContentPreview 
                    isGenerating={isGenerating}
                    generatedContent={generatedContent}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="image-generator">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Image Generator</CardTitle>
                  <CardDescription>
                    Create AI-generated images for your content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageGenerator 
                    imagePrompt={imagePrompt}
                    setImagePrompt={setImagePrompt}
                    handleGenerateImage={handleGenerateImage}
                    isGeneratingImage={isGeneratingImage}
                    generatedImageUrl={generatedImageUrl}
                  />
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Generated Image</CardTitle>
                  <CardDescription>
                    Your AI-generated image will appear here
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default ArticleGenerator;
