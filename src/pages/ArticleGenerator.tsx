
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, FileText, Import, List, ListChecks, PlusCircle } from "lucide-react";
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { v4 as uuidv4 } from 'uuid';
import { Article, Campaign } from '@/types';

// Form schema for article generation
const formSchema = z.object({
  keywords: z.string().min(1, {
    message: "Please enter at least one keyword.",
  }),
  title: z.string().optional(),
});

const ArticleGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentWorkspace } = useWorkspace();
  const [activeTab, setActiveTab] = useState("manual");
  
  // Setup form with validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keywords: "",
      title: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    try {
      // Process the keywords
      const keywordArray = values.keywords
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);
      
      if (keywordArray.length === 0) {
        toast({
          title: "No keywords provided",
          description: "Please enter at least one keyword",
          variant: "destructive",
        });
        return;
      }
      
      // Create a default campaign if none exists
      // In a real app, this would interact with Supabase
      const defaultCampaign: Campaign = {
        id: uuidv4(),
        name: "Default Campaign",
        description: "Automatically created campaign for keyword articles",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        workspaceId: currentWorkspace?.id || "",
      };
      
      // Create the article
      const newArticle: Article = {
        id: uuidv4(),
        title: values.title || keywordArray[0],
        keywords: keywordArray,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        workspaceId: currentWorkspace?.id || "",
        campaignId: defaultCampaign.id,
        status: 'draft'
      };
      
      // In a real app, this would save to Supabase
      console.log("Created campaign:", defaultCampaign);
      console.log("Created article:", newArticle);
      
      // Show success message
      toast({
        title: "Keywords Added",
        description: `Added ${keywordArray.length} keywords to Default Campaign`,
      });
      
      // Navigate to the campaigns page
      navigate('/dashboard/campaigns');
      
    } catch (error) {
      console.error("Error creating article:", error);
      toast({
        title: "Error Adding Keywords",
        description: "There was a problem adding your keywords. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Dashboard
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
          
          <Tabs defaultValue="manual" value={activeTab} onValueChange={setActiveTab} className="mb-8">
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
                        name="keywords"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Keywords</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter keywords separated by commas (e.g., 'gardening for beginners, best tools for gardeners')"
                                className="min-h-[100px]"
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
                        >
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Add Keywords
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
                    Import keywords from CSV, Excel or other sources (coming soon)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Import className="h-16 w-16 text-blue-500/30 mb-4" />
                    <p className="text-muted-foreground">Import Feature Coming Soon</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                      This feature is under development and will be available soon.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ArticleGenerator;
