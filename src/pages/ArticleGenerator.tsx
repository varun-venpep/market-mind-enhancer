
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { v4 as uuidv4 } from 'uuid';
import { Campaign, Article } from '@/types';

// Material Tailwind imports
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Input,
  Textarea,
} from "@material-tailwind/react";

// Icons
import { ArrowLeftIcon, DocumentTextIcon, ArrowsUpDownIcon, PlusCircleIcon } from "@heroicons/react/24/outline";

// Form schema for article generation
const formSchema = z.object({
  keywords: z.string().min(1, {
    message: "Please enter at least one keyword."
  }),
  title: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

const ArticleGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentWorkspace } = useWorkspace();
  const [activeTab, setActiveTab] = useState("manual");
  
  // Setup form with validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      keywords: "",
      title: ""
    }
  });

  const onSubmit = (values: FormValues) => {
    try {
      // Process the keywords
      const keywordArray = values.keywords.split(',').map(k => k.trim()).filter(k => k.length > 0);
      
      if (keywordArray.length === 0) {
        toast({
          title: "No keywords provided",
          description: "Please enter at least one keyword",
          variant: "destructive"
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
        workspaceId: currentWorkspace?.id || ""
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
        description: `Added ${keywordArray.length} keywords to Default Campaign`
      });
      
      // Navigate to the campaigns page
      navigate('/dashboard/campaigns');
    } catch (error) {
      console.error("Error creating article:", error);
      toast({
        title: "Error Adding Keywords",
        description: "There was a problem adding your keywords. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen bg-dark-950 text-white">
      <div className="container mx-auto py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
            <Button 
              variant="text" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-white"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <Typography variant="h2" color="white" className="text-3xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                Generate SEO Articles
              </Typography>
              <Typography variant="paragraph" color="blue-gray" className="mt-1">
                Create high-quality, SEO-optimized articles based on keywords
              </Typography>
            </div>
          </div>
          
          <Tabs value={activeTab} className="my-6">
            <TabsHeader
              className="bg-dark-800 border-none"
              indicatorProps={{
                className: "bg-primary-500/20 shadow-none",
              }}
            >
              <Tab 
                value="manual" 
                onClick={() => handleTabChange("manual")}
                className={`${activeTab === "manual" ? "text-primary-500" : "text-white"} flex items-center gap-2`}
              >
                <DocumentTextIcon className="h-4 w-4" />
                Manual
              </Tab>
              <Tab 
                value="import" 
                onClick={() => handleTabChange("import")}
                className={`${activeTab === "import" ? "text-primary-500" : "text-white"} flex items-center gap-2`}
              >
                <ArrowsUpDownIcon className="h-4 w-4" />
                Import
              </Tab>
            </TabsHeader>
            
            <TabsBody animate={{ initial: { opacity: 0 }, mount: { opacity: 1 }, unmount: { opacity: 0 } }}>
              <TabPanel value="manual">
                <Card className="bg-dark-800 border border-dark-700 shadow-lg">
                  <CardHeader 
                    color="transparent" 
                    floated={false} 
                    shadow={false}
                    className="px-6 pt-6 pb-0"
                  >
                    <Typography variant="h4" color="white" className="mb-1">
                      Create SEO Article
                    </Typography>
                    <Typography variant="small" color="blue-gray" className="mb-4">
                      Enter keywords for your article. You can add an optional title or we'll generate one for you.
                    </Typography>
                  </CardHeader>
                  
                  <CardBody className="px-6 pt-4">
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="mb-6">
                        <Textarea
                          label="Keywords"
                          color="primary"
                          {...form.register("keywords")}
                          placeholder="Enter keywords separated by commas (e.g., 'gardening for beginners, best tools for gardeners')"
                          className="border-dark-600 focus:border-primary-500 min-h-[100px]"
                        />
                        {form.formState.errors.keywords && (
                          <Typography color="red" variant="small" className="mt-1">
                            {form.formState.errors.keywords.message}
                          </Typography>
                        )}
                      </div>
                      
                      <div className="mb-6">
                        <Input
                          label="Title (Optional)"
                          color="primary"
                          {...form.register("title")}
                          placeholder="Leave blank to generate from keywords"
                          className="border-dark-600 focus:border-primary-500"
                        />
                        {form.formState.errors.title && (
                          <Typography color="red" variant="small" className="mt-1">
                            {form.formState.errors.title.message}
                          </Typography>
                        )}
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-500 hover:shadow-lg hover:shadow-primary-500/20 transition-all"
                        >
                          <PlusCircleIcon className="h-5 w-5" />
                          Add Keywords
                        </Button>
                      </div>
                    </form>
                  </CardBody>
                </Card>
              </TabPanel>
              
              <TabPanel value="import">
                <Card className="bg-dark-800 border border-dark-700 shadow-lg">
                  <CardHeader 
                    color="transparent" 
                    floated={false} 
                    shadow={false}
                    className="px-6 pt-6 pb-0"
                  >
                    <Typography variant="h4" color="white" className="mb-1">
                      Import Keywords
                    </Typography>
                    <Typography variant="small" color="blue-gray" className="mb-4">
                      Import keywords from CSV, Excel or other sources (coming soon)
                    </Typography>
                  </CardHeader>
                  
                  <CardBody className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center justify-center text-center">
                      <ArrowsUpDownIcon className="h-16 w-16 text-primary-500/30 mb-4" />
                      <Typography color="blue-gray" className="mb-2">
                        Import Feature Coming Soon
                      </Typography>
                      <Typography variant="small" color="blue-gray" className="max-w-xs">
                        This feature is under development and will be available soon.
                      </Typography>
                    </div>
                  </CardBody>
                </Card>
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ArticleGenerator;
