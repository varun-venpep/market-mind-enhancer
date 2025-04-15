
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BlogPlatformIntegration } from "@/components/Articles/BlogPlatformIntegration";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const BlogIntegrations = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("blogger");
  
  const handleConnect = () => {
    // Refresh the component when a connection is made
    setActiveTab(activeTab);
  };
  
  const handleDisconnect = () => {
    // Refresh the component when a connection is removed
    setActiveTab(activeTab);
  };

  return (
    <DashboardLayout>
      <Helmet>
        <title>Blog Integrations | MarketMind</title>
        <meta name="description" content="Connect your blog platforms to MarketMind for automated content publishing" />
      </Helmet>
      
      <div className="container mx-auto py-8">
        <div className="flex items-center mb-6">
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
        
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Blog Integrations</h1>
            <p className="text-muted-foreground mt-1">
              Connect your blog platforms to publish and schedule your articles
            </p>
          </div>
          
          <Tabs defaultValue="blogger" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="blogger">Blogger</TabsTrigger>
              <TabsTrigger value="medium">Medium</TabsTrigger>
            </TabsList>
            
            <TabsContent value="blogger">
              <BlogPlatformIntegration
                platform="blogger"
                title="Blogger"
                description="Publish your articles directly to your Blogger blogs"
                authUrl="https://www.blogger.com/blog/connect"
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
              />
              
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>How to connect with Blogger</CardTitle>
                  <CardDescription>
                    Follow these steps to connect your Blogger account:
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Cloud Console</a></li>
                    <li>Create a new project or select an existing one</li>
                    <li>Enable the Blogger API for your project</li>
                    <li>Create an OAuth 2.0 Client ID</li>
                    <li>Add the redirect URI: <code className="bg-muted p-1 rounded">{window.location.origin}/auth/blogger/callback</code></li>
                    <li>Copy the generated OAuth access token</li>
                    <li>Paste the token in the form above</li>
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="medium">
              <BlogPlatformIntegration
                platform="medium"
                title="Medium"
                description="Share your content on Medium to reach a wider audience"
                authUrl="https://medium.com/me/applications"
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
              />
              
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>How to connect with Medium</CardTitle>
                  <CardDescription>
                    Follow these steps to connect your Medium account:
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Go to <a href="https://medium.com/me/applications" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Medium Developer Applications</a></li>
                    <li>Click on "New application"</li>
                    <li>Fill in the required details for your application</li>
                    <li>Add the redirect URI: <code className="bg-muted p-1 rounded">{window.location.origin}/auth/medium/callback</code></li>
                    <li>Once created, generate an integration token</li>
                    <li>Copy the generated token</li>
                    <li>Paste the token in the form above</li>
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BlogIntegrations;
