
import { useState } from "react";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BlogPlatformIntegration } from "@/components/Articles/BlogPlatformIntegration";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, ClipboardCopy, Lightbulb, Monitor, Puzzle, Rss } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function BlogIntegrations() {
  const navigate = useNavigate();
  const [connectionsCount, setConnectionsCount] = useState(0);

  const handleConnect = () => {
    setConnectionsCount(prev => prev + 1);
    toast.success("Platform connected successfully");
  };

  const handleDisconnect = () => {
    setConnectionsCount(prev => prev - 1);
    toast.success("Platform disconnected successfully");
  };

  return (
    <DashboardLayout>
      <Helmet>
        <title>Blog Integrations | MarketMind</title>
        <meta name="description" content="Connect your Blogger and Medium accounts to publish content directly from MarketMind" />
      </Helmet>
      
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/dashboard/integrations')} 
                className="mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Integrations
              </Button>
            </div>
            <h1 className="text-3xl font-bold gradient-text">Blog Publishing Integrations</h1>
            <p className="text-muted-foreground mt-1">
              Connect your blogging platforms to publish and schedule content directly from MarketMind
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 border-muted/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Puzzle className="h-4 w-4 text-green-500" />
                Connected Platforms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{connectionsCount}</div>
              <p className="text-muted-foreground text-sm">Active publishing integrations</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-muted/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Rss className="h-4 w-4 text-blue-500" />
                Publishing Channels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">2</div>
              <p className="text-muted-foreground text-sm">Available publishing platforms</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-muted/40">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Monitor className="h-4 w-4 text-purple-500" />
                Content Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">Unlimited</div>
              <p className="text-muted-foreground text-sm">Schedule and publish content</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="platforms" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="platforms">Publishing Platforms</TabsTrigger>
            <TabsTrigger value="help">Setup Guide</TabsTrigger>
          </TabsList>
          
          <TabsContent value="platforms">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <BlogPlatformIntegration
                platform="blogger"
                title="Blogger"
                description="Publish articles directly to your Blogger blogs"
                authUrl="https://developers.google.com/blogger/docs/3.0/using#auth"
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
              />
              
              <BlogPlatformIntegration
                platform="medium"
                title="Medium"
                description="Share your content with the Medium community"
                authUrl="https://medium.com/developers/welcome-to-medium-api-3418f956552"
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="help">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  How to Connect Your Blogging Platforms
                </CardTitle>
                <CardDescription>
                  Follow these steps to connect your Blogger and Medium accounts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Connecting Blogger</h3>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer" className="text-primary hover:underline">Google Cloud Console</a> and create a new project.</li>
                    <li>Enable the Blogger API in the API Library.</li>
                    <li>Go to "Credentials" and create an OAuth client ID for a web application.</li>
                    <li>Add authorized redirect URIs (your app's domain).</li>
                    <li>Copy the Client ID and Client Secret.</li>
                    <li>Paste them into the Blogger integration form and click Connect.</li>
                  </ol>
                  
                  <div className="bg-muted/50 p-4 rounded-md mt-2">
                    <div className="flex justify-between items-center">
                      <code className="text-sm truncate">
                        https://www.googleapis.com/auth/blogger
                      </code>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText("https://www.googleapis.com/auth/blogger");
                          toast.success("Scope copied to clipboard");
                        }}
                      >
                        <ClipboardCopy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Use this scope when configuring your OAuth consent screen
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t space-y-4">
                  <h3 className="text-lg font-medium">Connecting Medium</h3>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Sign in to your Medium account.</li>
                    <li>Go to <a href="https://medium.com/me/settings" target="_blank" rel="noreferrer" className="text-primary hover:underline">Settings</a> and navigate to the "Integration tokens" section.</li>
                    <li>Create a new integration token.</li>
                    <li>Copy the token and paste it into the Medium integration form.</li>
                    <li>Click Connect to link your Medium account.</li>
                  </ol>
                </div>
                
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4 rounded-md flex gap-3 mt-2">
                  <CheckCircle2 className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Pro Tip</p>
                    <p className="text-sm text-muted-foreground">
                      Once connected, you'll be able to publish content to these platforms directly from your article editor or schedule them for future publishing.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
