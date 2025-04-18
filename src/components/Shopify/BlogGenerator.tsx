
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { generateContent } from '@/services/geminiApi';
import { ArrowRight, FileText, Loader2, Pencil } from 'lucide-react';

interface BlogGeneratorProps {
  storeName: string;
}

export function BlogGenerator({ storeName }: BlogGeneratorProps) {
  const [blogTitle, setBlogTitle] = useState("");
  const [blogKeywords, setBlogKeywords] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!blogTitle) {
      toast({
        title: "Missing Title",
        description: "Please enter a blog post title",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    setBlogContent("");

    try {
      const storeContext = storeName || "e-commerce store";
      const prompt = `
        Write an SEO-optimized blog post for a Shopify store called "${storeContext}" with the title: "${blogTitle}".
        ${blogKeywords ? `Focus on these keywords: ${blogKeywords}` : ''}
        The blog post should be informative, engaging, and follow best practices for SEO content.
        Include a compelling introduction, 3-5 main sections with subheadings, and a conclusion.
        Format the content using markdown with proper headings, lists, and emphasis where appropriate.
        The blog post should be around 800-1000 words.
      `;

      const content = await generateContent(prompt);
      setBlogContent(content);

      toast({
        title: "Blog Post Generated",
        description: "Your SEO-optimized blog post has been created"
      });
    } catch (error) {
      console.error("Error generating blog post:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate blog post content",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            Blog Post Generator
          </CardTitle>
          <CardDescription>
            Create SEO-optimized blog content for your Shopify store
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="blog-title">Blog Post Title</Label>
            <Input
              id="blog-title"
              placeholder="e.g., 5 Ways to Improve Your Online Store"
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="blog-keywords">Target Keywords (optional)</Label>
            <Input
              id="blog-keywords"
              placeholder="e.g., e-commerce tips, shopify store"
              value={blogKeywords}
              onChange={(e) => setBlogKeywords(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Separate keywords with commas
            </p>
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
                Generate Blog Post
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Generated Blog Content</CardTitle>
          <CardDescription>
            Your AI-generated blog post will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center h-[500px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-muted-foreground">Creating your SEO-optimized blog post...</p>
            </div>
          ) : blogContent ? (
            <div className="prose prose-sm dark:prose-invert max-w-none h-[500px] overflow-y-auto border rounded-md p-4">
              <div dangerouslySetInnerHTML={{ __html: blogContent.replace(/\n/g, '<br/>') }} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[500px] border border-dashed rounded-md">
              <FileText className="h-12 w-12 text-muted-foreground mb-2 opacity-20" />
              <p className="text-muted-foreground">Your blog post will appear here</p>
              <p className="text-xs text-muted-foreground mt-1">
                Enter a title and click Generate to create content
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {blogContent && (
            <>
              <Button 
                variant="outline" 
                onClick={() => {
                  navigator.clipboard.writeText(blogContent);
                  toast({
                    title: "Content Copied",
                    description: "Blog post copied to clipboard"
                  });
                }}
              >
                Copy Content
              </Button>
              <Button>
                Publish to Store
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
