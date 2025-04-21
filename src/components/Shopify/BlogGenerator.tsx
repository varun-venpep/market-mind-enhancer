
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, FileText } from "lucide-react";
import RichTextEditor from "@/components/Articles/RichTextEditor";

interface BlogGeneratorProps {
  blogTitle: string;
  setBlogTitle: (v: string) => void;
  blogKeywords: string;
  setBlogKeywords: (v: string) => void;
  blogContent: string;
  setBlogContent: (v: string) => void;
  isGeneratingBlog: boolean;
  handleBlogGenerate: () => void;
  toast: any;
}

export default function BlogGenerator({
  blogTitle, setBlogTitle,
  blogKeywords, setBlogKeywords,
  blogContent, setBlogContent,
  isGeneratingBlog,
  handleBlogGenerate,
  toast,
}: BlogGeneratorProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
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
            onClick={handleBlogGenerate}
            disabled={isGeneratingBlog}
          >
            {isGeneratingBlog ? (
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
          <CardTitle>Blog Content</CardTitle>
          <CardDescription>
            Your AI-generated blog post will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isGeneratingBlog ? (
            <div className="flex flex-col items-center justify-center h-[500px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-muted-foreground">Creating your SEO-optimized blog post...</p>
            </div>
          ) : blogContent ? (
            <RichTextEditor 
              content={blogContent}
              onChange={setBlogContent}
            />
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
