
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, Globe, Code, FileJson, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Form schema validation
const formSchema = z.object({
  siteUrl: z.string().url({ message: "Please enter a valid URL" }),
  apiKey: z.string().min(4, { message: "API key must be at least 4 characters" }),
  apiEndpoint: z.string().url({ message: "Please enter a valid API endpoint URL" }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// API test schema
const testApiSchema = z.object({
  endpoint: z.string().url({ message: "Please enter a valid API endpoint URL" }),
  method: z.enum(["GET", "POST", "PUT", "DELETE"]),
  headers: z.string().optional(),
  body: z.string().optional(),
});

type TestApiValues = z.infer<typeof testApiSchema>;

const CustomSiteIntegration = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("connect");
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      siteUrl: '',
      apiKey: '',
      apiEndpoint: '',
      description: '',
    }
  });

  const { register: registerTest, handleSubmit: handleSubmitTest, formState: { errors: testErrors } } = useForm<TestApiValues>({
    resolver: zodResolver(testApiSchema),
    defaultValues: {
      endpoint: '',
      method: 'GET',
      headers: '{\n  "Content-Type": "application/json"\n}',
      body: '{\n  "query": "example"\n}',
    }
  });

  const onSubmit = async (data: FormValues) => {
    setIsConnecting(true);
    
    try {
      // Mock API call - in a real app, this would connect to your backend
      console.log("Connecting custom site with data:", data);
      
      // Simulate a network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store the integration data in localStorage for demo purposes
      const customSites = JSON.parse(localStorage.getItem('customSites') || '[]');
      customSites.push({
        id: Date.now().toString(),
        ...data,
        connectedAt: new Date().toISOString()
      });
      localStorage.setItem('customSites', JSON.stringify(customSites));
      
      toast.success("Custom website successfully connected!");
      setActiveTab("test");
    } catch (error) {
      console.error("Error connecting custom site:", error);
      toast.error("Failed to connect custom website. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  const onTestApi = async (data: TestApiValues) => {
    setIsTestingApi(true);
    setApiResponse(null);
    
    try {
      console.log("Testing API with data:", data);
      
      // Parse the headers and body
      let headersObj = {};
      let bodyObj = undefined;
      
      try {
        if (data.headers) {
          headersObj = JSON.parse(data.headers);
        }
        if (data.body && data.method !== 'GET') {
          bodyObj = JSON.parse(data.body);
        }
      } catch (e) {
        throw new Error("Invalid JSON in headers or body");
      }
      
      // Make the actual API request with the CORS proxy
      const response = await fetch(data.endpoint, {
        method: data.method,
        headers: headersObj,
        body: data.method !== 'GET' ? JSON.stringify(bodyObj) : undefined,
      });
      
      const responseText = await response.text();
      let formattedResponse;
      
      try {
        // Try to parse as JSON for nice formatting
        const jsonResponse = JSON.parse(responseText);
        formattedResponse = JSON.stringify(jsonResponse, null, 2);
      } catch {
        // If not JSON, just use the text
        formattedResponse = responseText;
      }
      
      setApiResponse(formattedResponse);
      toast.success("API request completed");
    } catch (error) {
      console.error("Error testing API:", error);
      setApiResponse(`Error: ${error.message}`);
      toast.error(`API test failed: ${error.message}`);
    } finally {
      setIsTestingApi(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Custom Website Integration</h1>
            <p className="text-muted-foreground mt-1">
              Connect your custom website or web app to use MarketMind's SEO tools
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard/integrations')}
            className="mt-4 md:mt-0"
          >
            Back to Integrations
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-3xl mx-auto">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="connect">Connect Website</TabsTrigger>
            <TabsTrigger value="test">Test API</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connect">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Connect Custom Website
                </CardTitle>
                <CardDescription>
                  Integrate your custom-built website with our SEO optimization platform
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteUrl">Website URL</Label>
                    <Input 
                      id="siteUrl"
                      placeholder="https://example.com"
                      {...register("siteUrl")}
                    />
                    {errors.siteUrl && (
                      <p className="text-destructive text-sm">{errors.siteUrl.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input 
                      id="apiKey"
                      type="password"
                      placeholder="Your site's API key"
                      {...register("apiKey")}
                    />
                    {errors.apiKey && (
                      <p className="text-destructive text-sm">{errors.apiKey.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      This is the API key generated from your website's admin dashboard
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="apiEndpoint">API Endpoint</Label>
                    <Input 
                      id="apiEndpoint"
                      placeholder="https://example.com/api/seo"
                      {...register("apiEndpoint")}
                    />
                    {errors.apiEndpoint && (
                      <p className="text-destructive text-sm">{errors.apiEndpoint.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea 
                      id="description"
                      placeholder="Add notes about this website integration"
                      {...register("description")}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isConnecting}
                  >
                    {isConnecting ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Connecting...</span>
                      </div>
                    ) : (
                      <span>Connect Website</span>
                    )}
                  </Button>
                </form>
              </CardContent>
              
              <CardFooter className="flex justify-between border-t p-4 bg-muted/10">
                <p className="text-sm text-muted-foreground">
                  Need help? Check our <a href="#" className="text-primary hover:underline">integration guide</a>
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="test">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  Test API Integration
                </CardTitle>
                <CardDescription>
                  Verify your website's API connection with MarketMind
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmitTest(onTestApi)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="endpoint">API Endpoint URL</Label>
                    <Input 
                      id="endpoint"
                      placeholder="https://example.com/api/endpoint"
                      {...registerTest("endpoint")}
                    />
                    {testErrors.endpoint && (
                      <p className="text-destructive text-sm">{testErrors.endpoint.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="method">HTTP Method</Label>
                    <select 
                      id="method" 
                      className="w-full border rounded px-3 py-2 bg-background"
                      {...registerTest("method")}
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="headers">Headers (JSON format)</Label>
                    <Textarea 
                      id="headers"
                      rows={4}
                      className="font-mono text-sm"
                      {...registerTest("headers")}
                    />
                    {testErrors.headers && (
                      <p className="text-destructive text-sm">{testErrors.headers.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="body">Request Body (JSON format, for POST/PUT)</Label>
                    <Textarea 
                      id="body"
                      rows={4}
                      className="font-mono text-sm"
                      {...registerTest("body")}
                    />
                    {testErrors.body && (
                      <p className="text-destructive text-sm">{testErrors.body.message}</p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isTestingApi}
                  >
                    {isTestingApi ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span>Testing API...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        <span>Send Request</span>
                      </div>
                    )}
                  </Button>
                </form>
                
                {apiResponse && (
                  <div className="mt-6">
                    <Label>API Response</Label>
                    <div className="mt-2 p-4 bg-muted/20 rounded-md border max-h-80 overflow-auto">
                      <pre className="text-xs font-mono whitespace-pre-wrap">{apiResponse}</pre>
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between border-t p-4 bg-muted/10">
                <p className="text-sm text-muted-foreground">
                  Having issues? Check our <a href="#" className="text-primary hover:underline">API troubleshooting guide</a>
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CustomSiteIntegration;
