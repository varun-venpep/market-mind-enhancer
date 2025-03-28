
import { useState } from "react";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AlertTriangle, Check, Copy, Download as DownloadIcon, FileText as FileTextIcon, Info, Mail, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function Settings() {
  const [activeTab, setActiveTab] = useState("account");
  const { toast } = useToast();
  
  const handleCopyApiKey = () => {
    navigator.clipboard.writeText("sk_test_your_api_key_here");
    toast({
      title: "API Key Copied",
      description: "Your API key has been copied to the clipboard",
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs 
          defaultValue="account" 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-muted/50 p-1">
            <TabsTrigger value="account" className="relative">
              Account
            </TabsTrigger>
            <TabsTrigger value="plan" className="relative">
              Plan & Billing
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-[10px] text-primary-foreground">
                3
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your profile details and personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-6">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue="Alex Johnson" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" defaultValue="alex@example.com" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input id="bio" defaultValue="Content creator and SEO specialist" />
                    <p className="text-xs text-muted-foreground">
                      This will be displayed on your profile
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Profile Photo</Label>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        <User className="h-8 w-8 text-gray-500" />
                      </div>
                      <div className="space-x-2">
                        <Button size="sm" variant="outline">
                          Change
                        </Button>
                        <Button size="sm" variant="outline">
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Connected Accounts</CardTitle>
                <CardDescription>
                  Connect your accounts to enable additional features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-500"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Facebook</p>
                      <p className="text-sm text-muted-foreground">Not connected</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-500"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Twitter</p>
                      <p className="text-sm text-muted-foreground">Connected</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Disconnect
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-500"
                      >
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                        <path d="M9 18c-4.51 2-5-2-7-2" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">GitHub</p>
                      <p className="text-sm text-muted-foreground">Not connected</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-blue-500"
                      >
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                        <rect width="4" height="12" x="2" y="9" />
                        <circle cx="4" cy="4" r="2" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">LinkedIn</p>
                      <p className="text-sm text-muted-foreground">Connected</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Disconnect
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>
                  Change your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Password Requirements:</div>
                  <ul className="text-xs text-muted-foreground space-y-1.5">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      At least 8 characters
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      At least one uppercase letter
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      At least one number
                    </li>
                    <li className="flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                      At least one special character
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button>Update Password</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Delete Account</CardTitle>
                <CardDescription>
                  Permanently delete your account and all of your content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Once you delete your account, there is no going back. All of your data will be permanently removed
                  from our servers. Please be certain before proceeding.
                </p>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button variant="destructive">Delete Account</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="plan" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>
                  You are currently on the Pro plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border bg-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold">Pro Plan</h3>
                      <p className="text-sm text-muted-foreground">$29/month</p>
                    </div>
                    <Badge>Current Plan</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="font-medium">Your trial ends in 23 days</div>
                    <Progress value={25} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Your free trial started on August 1, 2023 and will end on August 30, 2023
                    </p>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <h4 className="font-medium">Plan Includes:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        Unlimited content briefs
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        Advanced keyword research
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        Competitor analysis
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        Export to PDF and Word
                      </li>
                      <li className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        Priority support
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button size="lg" className="gradient-button flex-1">
                    Upgrade to Annual (Save 20%)
                  </Button>
                  <Button variant="outline" size="lg" className="flex-1">
                    Cancel Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>
                  Manage your payment methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center space-x-4">
                    <div className="rounded-md bg-gray-100 p-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-900"
                      >
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <line x1="2" x2="22" y1="10" y2="10" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Visa ending in 4242</p>
                      <p className="text-sm text-muted-foreground">Expires 04/2024</p>
                    </div>
                  </div>
                  <div>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full">
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
                <CardDescription>
                  View your past invoices and download receipts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg border">
                    <div className="grid grid-cols-4 p-4 text-sm font-medium">
                      <div>Date</div>
                      <div>Amount</div>
                      <div>Status</div>
                      <div className="text-right">Receipt</div>
                    </div>
                    <div className="divide-y">
                      <div className="grid grid-cols-4 items-center p-4">
                        <div className="text-sm">Aug 1, 2023</div>
                        <div className="text-sm">$29.00</div>
                        <div>
                          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                            Paid
                          </Badge>
                        </div>
                        <div className="flex justify-end">
                          <Button variant="ghost" size="sm">
                            <DownloadIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center p-4">
                        <div className="text-sm">Jul 1, 2023</div>
                        <div className="text-sm">$29.00</div>
                        <div>
                          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                            Paid
                          </Badge>
                        </div>
                        <div className="flex justify-end">
                          <Button variant="ghost" size="sm">
                            <DownloadIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center p-4">
                        <div className="text-sm">Jun 1, 2023</div>
                        <div className="text-sm">$29.00</div>
                        <div>
                          <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                            Paid
                          </Badge>
                        </div>
                        <div className="flex justify-end">
                          <Button variant="ghost" size="sm">
                            <DownloadIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Button variant="link">
                      View all invoices
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Brief Completions</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive emails when your content briefs are completed
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Keyword Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified about significant changes in your tracked keywords
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Product Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Learn about new features and improvements
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Marketing Emails</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive tips, offers, and promotional content
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-medium">In-App Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Collaboration Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when someone comments on your briefs
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Task Reminders</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive reminders about upcoming deadlines
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
                <CardDescription>
                  Manage your API keys for programmatic access
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Live API Key</h3>
                        <p className="text-sm text-muted-foreground">
                          Use this key for production environments
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleCopyApiKey}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                    </div>
                    <div className="flex items-center rounded-md bg-muted px-4 py-2 font-mono text-sm">
                      sk_test_***************************
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Test API Key</h3>
                        <p className="text-sm text-muted-foreground">
                          Use this key for testing and development
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleCopyApiKey}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                    </div>
                    <div className="flex items-center rounded-md bg-muted px-4 py-2 font-mono text-sm">
                      sk_test_***************************
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <Button>Regenerate Keys</Button>
                  <Button variant="outline">Create API Key</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
                <CardDescription>
                  Access resources to help integrate with our API
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <FileTextIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">API Reference</h3>
                        <p className="text-sm text-muted-foreground">
                          Complete documentation for all API endpoints
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      View Documentation
                    </Button>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Info className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Getting Started Guide</h3>
                        <p className="text-sm text-muted-foreground">
                          Learn how to use our API with step-by-step tutorials
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Read Guide
                    </Button>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-primary/10 p-2">
                        <FileTextIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Code Examples</h3>
                        <p className="text-sm text-muted-foreground">
                          Sample code in various programming languages
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      View Examples
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Export</CardTitle>
                <CardDescription>
                  Export your data for backup or migration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Export All Data</h3>
                        <p className="text-sm text-muted-foreground">
                          Download all your data as a JSON file
                        </p>
                      </div>
                      <Button variant="outline">
                        <DownloadIcon className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Export Content Briefs</h3>
                        <p className="text-sm text-muted-foreground">
                          Download all your content briefs as a CSV file
                        </p>
                      </div>
                      <Button variant="outline">
                        <DownloadIcon className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Export Keyword Research</h3>
                        <p className="text-sm text-muted-foreground">
                          Download all your keyword research as a CSV file
                        </p>
                      </div>
                      <Button variant="outline">
                        <DownloadIcon className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Account Management</CardTitle>
                <CardDescription>
                  Advanced account settings and options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Collapsible className="w-full">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Transfer Account Ownership</h3>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Show Details
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="mt-4 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Transfer your account and all its data to another user.
                      This action cannot be undone.
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="transfer-email">New Owner's Email</Label>
                      <Input id="transfer-email" placeholder="email@example.com" />
                    </div>
                    <Button variant="destructive">Transfer Ownership</Button>
                  </CollapsibleContent>
                </Collapsible>
                
                <Separator />
                
                <Collapsible className="w-full">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Download Personal Data</h3>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Show Details
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="mt-4 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Download all of your personal data in compliance with data protection
                      regulations.
                    </p>
                    <Button>Request Data Download</Button>
                  </CollapsibleContent>
                </Collapsible>
                
                <Separator />
                
                <Collapsible className="w-full">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Change Account Email</h3>
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Show Details
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <CollapsibleContent className="mt-4 space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Change the primary email address associated with your account.
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="new-email">New Email Address</Label>
                      <Input id="new-email" placeholder="newemail@example.com" />
                    </div>
                    <Button>Update Email</Button>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
