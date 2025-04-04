
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, FileText, Image as ImageIcon, Check, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { generateContent, generateImage } from '@/services/geminiApi';
import { fetchSerpResults } from '@/services/serpApi';

export default function ContentGenerator() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('blog-post');
  const [prompt, setPrompt] = useState('');
  const [keywords, setKeywords] = useState('');
  const [contentType, setContentType] = useState('blog-post');
  const [contentLength, setContentLength] = useState('medium');
  const [tone, setTone] = useState('informational');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [keywordSuggestions, setKeywordSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) {
      toast.error('Please enter a topic or prompt');
      return;
    }

    setIsGenerating(true);
    setGeneratedContent('');

    try {
      // Get length in words
      const lengthMap = {
        short: '500-700',
        medium: '1000-1200',
        long: '1500-2000',
      };

      const contentPrompt = `
        Create a ${contentType === 'blog-post' ? 'blog post' : contentType} about "${prompt}" 
        with a ${tone} tone. 
        Length: approximately ${lengthMap[contentLength]} words.
        ${keywords ? `Target keywords: ${keywords}` : ''}
        Use SEO best practices, include a compelling headline, and format with markdown.
      `;

      const result = await generateContent(contentPrompt);
      setGeneratedContent(result);
      toast.success('Content generated successfully!');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!imagePrompt) {
      toast.error('Please enter an image description');
      return;
    }

    setIsGeneratingImage(true);
    setGeneratedImageUrl('');

    try {
      const imageUrl = await generateImage(imagePrompt);
      setGeneratedImageUrl(imageUrl);
      toast.success('Image generated successfully!');
    } catch (error) {
      console.error('Error generating image:', error);
      toast.error('Failed to generate image. Please try again.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const getSuggestions = async () => {
    if (!prompt) {
      toast.error('Please enter a topic first');
      return;
    }

    setIsLoadingSuggestions(true);
    setKeywordSuggestions([]);

    try {
      const result = await fetchSerpResults(prompt);
      const data = result.related_searches || [];
      const suggestions = data.map(item => item.query).slice(0, 5);
      setKeywordSuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching keyword suggestions:', error);
      toast.error('Failed to get keyword suggestions');
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const addKeyword = (keyword) => {
    const currentKeywords = keywords ? keywords.split(',').map(k => k.trim()) : [];
    if (!currentKeywords.includes(keyword)) {
      const newKeywords = [...currentKeywords, keyword].join(', ');
      setKeywords(newKeywords);
      toast.success(`Added "${keyword}" to keywords`);
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
                  <div className="space-y-2">
                    <Label htmlFor="topic">Topic or Title</Label>
                    <Input 
                      id="topic" 
                      placeholder="e.g., 10 SEO Tips for E-commerce" 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="keywords">Target Keywords</Label>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 text-xs"
                        onClick={getSuggestions}
                        disabled={isLoadingSuggestions}
                      >
                        {isLoadingSuggestions ? 
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : 
                          <Sparkles className="h-3 w-3 mr-1" />
                        }
                        Get suggestions
                      </Button>
                    </div>
                    <Input 
                      id="keywords" 
                      placeholder="e.g., seo, e-commerce, shopify" 
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                    />
                    
                    {keywordSuggestions.length > 0 && (
                      <div className="mt-2">
                        <Label className="text-xs">Suggestions:</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {keywordSuggestions.map((kw, i) => (
                            <Button 
                              key={i} 
                              variant="outline" 
                              size="sm" 
                              className="h-6 text-xs py-0 px-2"
                              onClick={() => addKeyword(kw)}
                            >
                              + {kw}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content-type">Content Type</Label>
                    <Select value={contentType} onValueChange={setContentType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select content type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="blog-post">Blog Post</SelectItem>
                        <SelectItem value="product-description">Product Description</SelectItem>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="social-media">Social Media Post</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content-length">Content Length</Label>
                    <Select value={contentLength} onValueChange={setContentLength}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">Short (500-700 words)</SelectItem>
                        <SelectItem value="medium">Medium (1000-1200 words)</SelectItem>
                        <SelectItem value="long">Long (1500-2000 words)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tone">Tone</Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="informational">Informational</SelectItem>
                        <SelectItem value="conversational">Conversational</SelectItem>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="persuasive">Persuasive</SelectItem>
                        <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full gap-2" 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Generate Content
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Generated Content</CardTitle>
                  <CardDescription>
                    Your AI-generated content will appear here
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isGenerating ? (
                    <div className="flex flex-col items-center justify-center h-[500px]">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                      <p className="text-muted-foreground">Generating high-quality content...</p>
                    </div>
                  ) : generatedContent ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none h-[500px] overflow-y-auto border rounded-md p-4">
                      <div dangerouslySetInnerHTML={{ __html: generatedContent.replace(/\n/g, '<br/>') }} />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[500px] border border-dashed rounded-md">
                      <FileText className="h-12 w-12 text-muted-foreground mb-2 opacity-20" />
                      <p className="text-muted-foreground">Your content will appear here</p>
                      <p className="text-xs text-muted-foreground mt-1">Fill in the settings and click Generate</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  {generatedContent && (
                    <>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          navigator.clipboard.writeText(generatedContent);
                          toast.success('Content copied to clipboard');
                        }}
                      >
                        Copy Content
                      </Button>
                      <Button disabled>
                        Save as Draft
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </>
                  )}
                </CardFooter>
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
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image-prompt">Image Description</Label>
                    <Textarea 
                      id="image-prompt" 
                      placeholder="Describe the image you want to generate in detail" 
                      rows={6}
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Be specific about style, colors, mood, and subjects for best results
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full gap-2" 
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImage}
                  >
                    {isGeneratingImage ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-4 w-4" />
                        Generate Image
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Generated Image</CardTitle>
                  <CardDescription>
                    Your AI-generated image will appear here
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isGeneratingImage ? (
                    <div className="flex flex-col items-center justify-center h-[400px] border rounded-md">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                      <p className="text-muted-foreground">Creating your image...</p>
                    </div>
                  ) : generatedImageUrl ? (
                    <div className="flex justify-center h-[400px] border rounded-md p-4">
                      <img 
                        src={generatedImageUrl} 
                        alt="AI generated" 
                        className="max-h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[400px] border border-dashed rounded-md">
                      <ImageIcon className="h-12 w-12 text-muted-foreground mb-2 opacity-20" />
                      <p className="text-muted-foreground">Your image will appear here</p>
                      <p className="text-xs text-muted-foreground mt-1">Describe the image and click Generate</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                  {generatedImageUrl && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        window.open(generatedImageUrl, '_blank');
                      }}
                    >
                      Download Image
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
