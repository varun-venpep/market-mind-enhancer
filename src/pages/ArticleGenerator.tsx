import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { generateArticleContent, generateArticleThumbnail } from '@/services/articles/ai';
import { createArticle } from '@/services/articles';
import { ArticleCreationData } from '@/services/articles/types';
import { Loader2 } from 'lucide-react';

const ArticleGenerator = () => {
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleGenerateContent = async () => {
    setIsLoading(true);
    try {
      const keywordsArray = keywords.split(',').map(k => k.trim());
      const { content: generatedContent, wordCount } = await generateArticleContent(title, keywordsArray);
      setContent(generatedContent);
      
      // Generate thumbnail
      try {
        const thumbnailUrl = await generateArticleThumbnail(title, keywordsArray);
        setThumbnailUrl(thumbnailUrl);
      } catch (thumbnailError) {
        console.error("Error generating thumbnail:", thumbnailError);
        toast.error("Failed to generate thumbnail, but content was generated.");
      }
      
      toast.success("Article content generated successfully!");
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Failed to generate article content.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveArticle = async () => {
    setIsLoading(true);
    try {
      const keywordsArray = keywords.split(',').map(k => k.trim());
      
      const articleData: ArticleCreationData = {
        title,
        keywords: keywordsArray,
        content,
        thumbnail_url: thumbnailUrl,
        word_count: content.split(/\s+/).filter(Boolean).length
      };
      
      const newArticle = await createArticle(articleData);
      toast.success("Article saved successfully!");
      navigate(`/dashboard/article/${newArticle.id}`);
    } catch (error) {
      console.error("Error saving article:", error);
      toast.error("Failed to save article.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4">AI Article Generator</h2>
            
            <div className="grid gap-4">
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
              
              <Button disabled={isLoading} onClick={handleGenerateContent}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Content"
                )}
              </Button>
              
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  className="min-h-[300px]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </div>
              
              {thumbnailUrl && (
                <div>
                  <Label>Thumbnail</Label>
                  <img src={thumbnailUrl} alt="Article Thumbnail" className="w-full rounded-md" />
                </div>
              )}
              
              <Button disabled={isLoading} onClick={handleSaveArticle}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Article"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ArticleGenerator;
