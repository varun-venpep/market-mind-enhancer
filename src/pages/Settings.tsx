
import { useState } from "react";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  Bell, 
  CreditCard, 
  LifeBuoy, 
  Lock, 
  Mail, 
  User,
  Building,
  LogOut,
  Save,
  Trash2,
  Globe,
  Key,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const Settings = () => {
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: "John Doe",
    email: user?.email || "",
    company: "Acme Inc.",
    role: "Marketing Manager"
  });
  
  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailDigest: true,
    contentUpdates: true,
    productNews: false,
    securityAlerts: true
  });
  
  // API Key settings
  const [apiKey, setApiKey] = useState("sk_live_*****************************");
  const [showApiKey, setShowApiKey] = useState(false);
  
  // Integration settings
  const [integrations, setIntegrations] = useState({
    googleAnalytics: true,
    googleSearchConsole: true,
    ahrefs: false,
    semrush: false,
    wordpress: true
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    });
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      // Redirect handled by AuthProvider
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const generateNewApiKey = () => {
    const mockApiKey = "sk_live_" + Math.random().toString(36).substring(2, 30);
    setApiKey(mockApiKey);
    setShowApiKey(true);
    
    toast({
      title: "New API key generated",
      description: "Your new API key has been generated. Keep it secure!",
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto w-full">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="flex overflow-auto pb-2">
              <TabsList className="bg-transparent p-0 h-auto flex-wrap space-y-2 justify-start">
                <div className="flex flex-wrap gap-2">
                  <TabsTrigger
                    value="profile"
                    className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="account"
                    className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Building className="h-4 w-4" />
                    <span>Account</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="notifications"
                    className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Bell className="h-4 w-4" />
                    <span>Notifications</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="api"
                    className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Key className="h-4 w-4" />
                    <span>API</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="integrations"
                    className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Globe className="h-4 w-4" />
                    <span>Integrations</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="billing"
                    className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Billing</span>
                  </TabsTrigger>
                </div>
              </TabsList>
            </div>
            
            <TabsContent value="profile">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileSubmit}>
                      <div className="grid gap-6">
                        <div className="grid gap-3">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input 
                            id="fullName" 
                            value={profileForm.fullName}
                            onChange={(e) => setProfileForm({
                              ...profileForm,
                              fullName: e.target.value
                            })}
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm({
                              ...profileForm,
                              email: e.target.value
                            })}
                            disabled
                          />
                          <p className="text-sm text-muted-foreground">
                            To change your email address, please contact support.
                          </p>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="company">Company</Label>
                          <Input 
                            id="company" 
                            value={profileForm.company}
                            onChange={(e) => setProfileForm({
                              ...profileForm,
                              company: e.target.value
                            })}
                          />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="role">Role</Label>
                          <Input 
                            id="role" 
                            value={profileForm.role}
                            onChange={(e) => setProfileForm({
                              ...profileForm,
                              role: e.target.value
                            })}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end mt-6">
                        <Button type="submit">
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>
                      Change your password
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" />
                      </div>
                    </div>
                    <div className="flex justify-end mt-6">
                      <Button>
                        <Lock className="mr-2 h-4 w-4" />
                        Update Password
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
                    <CardDescription>
                      Destructive actions for your account
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border border-destructive/30 rounded-lg bg-destructive/10">
                      <div>
                        <h3 className="font-medium">Delete Account</h3>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete your account and all associated data
                        </p>
                      </div>
                      <Button variant="destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4">
                    <Button variant="outline" className="w-full" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log Out
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="account">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Account Plan</CardTitle>
                        <CardDescription>
                          Manage your subscription and usage
                        </CardDescription>
                      </div>
                      <Badge className="bg-green-500">Pro Plan</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">Plan</h3>
                            <p className="text-2xl font-bold">Pro</p>
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">Price</h3>
                            <p className="text-2xl font-bold">$29<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">Billing Period</h3>
                            <p className="text-base">Monthly</p>
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">Next Billing Date</h3>
                            <p className="text-base">June 15, 2023</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Features</h3>
                          <ul className="grid gap-2 text-sm">
                            <li className="flex items-center gap-2">
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 hover:text-green-700">Unlimited</Badge>
                              <span>Keyword searches</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 hover:text-green-700">Unlimited</Badge>
                              <span>Content briefs</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 hover:text-green-700">Included</Badge>
                              <span>AI content optimization</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 hover:text-green-700">Included</Badge>
                              <span>Advanced SERP analysis</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t px-6 py-4">
                    <Button variant="outline">Cancel Subscription</Button>
                    <Button>Upgrade Plan</Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Usage Statistics</CardTitle>
                    <CardDescription>
                      Track your current usage for this billing period
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "Keyword Searches", used: 87, total: "Unlimited", percentage: 0 },
                        { name: "Content Briefs", used: 24, total: "Unlimited", percentage: 0 },
                        { name: "API Calls", used: 3450, total: 10000, percentage: 34.5 },
                        { name: "Storage", used: 1.2, total: 5, percentage: 24, unit: "GB" }
                      ].map((item, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{item.name}</span>
                            <span className="text-sm">
                              {item.used}{item.unit && item.unit} / {item.total}{item.unit && item.unit}
                            </span>
                          </div>
                          {item.percentage > 0 ? (
                            <Progress value={item.percentage} className="h-2" />
                          ) : (
                            <Progress value={100} className="h-2 bg-muted" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how and when you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Email Notifications</h3>
                    
                    <div className="grid gap-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="emailDigest">Weekly Digest</Label>
                          <p className="text-muted-foreground text-sm">
                            Receive a weekly summary of your content performance
                          </p>
                        </div>
                        <Switch
                          id="emailDigest"
                          checked={notifications.emailDigest}
                          onCheckedChange={(checked) => setNotifications({
                            ...notifications,
                            emailDigest: checked
                          })}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="contentUpdates">Content Updates</Label>
                          <p className="text-muted-foreground text-sm">
                            Get notified when your content briefs are updated or completed
                          </p>
                        </div>
                        <Switch
                          id="contentUpdates"
                          checked={notifications.contentUpdates}
                          onCheckedChange={(checked) => setNotifications({
                            ...notifications,
                            contentUpdates: checked
                          })}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="productNews">Product News</Label>
                          <p className="text-muted-foreground text-sm">
                            Receive updates about new features and product improvements
                          </p>
                        </div>
                        <Switch
                          id="productNews"
                          checked={notifications.productNews}
                          onCheckedChange={(checked) => setNotifications({
                            ...notifications,
                            productNews: checked
                          })}
                        />
                      </div>
                      
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="securityAlerts">Security Alerts</Label>
                          <p className="text-muted-foreground text-sm">
                            Important notifications about your account security
                          </p>
                        </div>
                        <Switch
                          id="securityAlerts"
                          checked={notifications.securityAlerts}
                          onCheckedChange={(checked) => setNotifications({
                            ...notifications,
                            securityAlerts: checked
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t px-6 py-4">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Preferences
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="api">
              <Card>
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>
                    Manage your API keys for programmatic access
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 border rounded-lg bg-muted/30">
                    <div>
                      <h3 className="font-medium">Production API Key</h3>
                      <div className="flex items-center mt-1">
                        <Input 
                          value={apiKey} 
                          readOnly 
                          type={showApiKey ? "text" : "password"}
                          className="font-mono text-sm bg-background"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="ml-2"
                        >
                          {showApiKey ? "Hide" : "Show"}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        <AlertCircle className="inline h-3 w-3 mr-1" />
                        Keep your API key secure. Do not share it in public repositories or client-side code.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={generateNewApiKey}
                      className="flex-shrink-0"
                    >
                      <Key className="mr-2 h-4 w-4" />
                      Generate New Key
                    </Button>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-4">API Documentation</h3>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium">Quick Start Example</h4>
                        <pre className="mt-2 p-2 bg-muted rounded-md overflow-x-auto text-xs">
                          <code>
                            {`curl -X GET "https://api.marketmind.ai/v1/keywords/analysis" \\
-H "Authorization: Bearer ${apiKey}" \\
-H "Content-Type: application/json" \\
-d '{ "keyword": "content optimization" }'`}
                          </code>
                        </pre>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { title: "API Reference", description: "Full documentation for all endpoints", icon: FileText },
                          { title: "Authentication Guide", description: "Learn how to authenticate API requests", icon: Lock },
                          { title: "Rate Limits", description: "Understanding API usage limits", icon: AlertCircle }
                        ].map((item, i) => (
                          <Card key={i} className="bg-muted/20">
                            <CardContent className="p-4 flex flex-col items-center text-center">
                              <div className="bg-primary/10 p-2 rounded-full mb-2">
                                <item.icon className="h-5 w-5 text-primary" />
                              </div>
                              <h3 className="font-medium">{item.title}</h3>
                              <p className="text-sm text-muted-foreground mt-1 mb-3">{item.description}</p>
                              <Button variant="ghost" size="sm" className="mt-auto">View Guide</Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="integrations">
              <Card>
                <CardHeader>
                  <CardTitle>Connected Services</CardTitle>
                  <CardDescription>
                    Manage integrations with third-party services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      { 
                        name: "Google Analytics", 
                        description: "Track website traffic and user behavior", 
                        connected: integrations.googleAnalytics,
                        icon: "https://www.google.com/images/about/google-analytics-icon.svg"
                      },
                      { 
                        name: "Google Search Console", 
                        description: "Monitor search performance and issues", 
                        connected: integrations.googleSearchConsole,
                        icon: "https://ssl.gstatic.com/search-console/scfe/search_console-128.png"
                      },
                      { 
                        name: "Ahrefs", 
                        description: "Access SEO metrics and competitor data", 
                        connected: integrations.ahrefs,
                        icon: "https://cdn.ahrefs.com/favicon-32x32.png?v=2"
                      },
                      { 
                        name: "SEMrush", 
                        description: "Connect keyword and SEO research data", 
                        connected: integrations.semrush,
                        icon: "https://www.semrush.com/favicon.ico"
                      },
                      { 
                        name: "WordPress", 
                        description: "Publish content directly to your website", 
                        connected: integrations.wordpress,
                        icon: "https://s.w.org/style/images/about/WordPress-logotype-standard.png"
                      }
                    ].map((integration, i) => (
                      <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-md flex items-center justify-center bg-muted">
                            <img 
                              src={integration.icon} 
                              alt={`${integration.name} icon`} 
                              className="w-6 h-6 object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cline x1='2' y1='12' x2='22' y2='12'%3E%3C/line%3E%3Cpath d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'%3E%3C/path%3E%3C/svg%3E"
                              }}
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{integration.name}</h3>
                            <p className="text-sm text-muted-foreground">{integration.description}</p>
                          </div>
                        </div>
                        <div>
                          {integration.connected ? (
                            <Button variant="outline" size="sm">
                              Connected
                            </Button>
                          ) : (
                            <Button size="sm">
                              Connect
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="billing">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                    <CardDescription>
                      Manage your billing information and payment methods
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-8 rounded-md bg-background border flex items-center justify-center">
                            <CreditCard className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">Visa ending in 4242</h3>
                            <p className="text-sm text-muted-foreground">Expires 12/2025</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge>Default</Badge>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </div>
                      
                      <Button variant="outline">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Add Payment Method
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Billing History</CardTitle>
                    <CardDescription>
                      View and download your past invoices
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border rounded-lg overflow-hidden">
                      <div className="grid grid-cols-4 bg-muted px-4 py-2 text-sm font-medium">
                        <div>Date</div>
                        <div>Amount</div>
                        <div>Status</div>
                        <div></div>
                      </div>
                      <div className="divide-y">
                        {[
                          { date: "May 15, 2023", amount: "$29.00", status: "Paid" },
                          { date: "Apr 15, 2023", amount: "$29.00", status: "Paid" },
                          { date: "Mar 15, 2023", amount: "$29.00", status: "Paid" },
                          { date: "Feb 15, 2023", amount: "$29.00", status: "Paid" },
                          { date: "Jan 15, 2023", amount: "$29.00", status: "Paid" }
                        ].map((invoice, i) => (
                          <div key={i} className="grid grid-cols-4 px-4 py-3 text-sm">
                            <div>{invoice.date}</div>
                            <div>{invoice.amount}</div>
                            <div>
                              <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                                {invoice.status}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4 mr-1" />
                                PDF
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Billing Information</CardTitle>
                    <CardDescription>
                      Manage billing details for your invoices
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid gap-3">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input id="companyName" value="Acme Inc." />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="billingEmail">Billing Email</Label>
                        <Input id="billingEmail" type="email" value="billing@acme.com" />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="taxId">Tax ID</Label>
                        <Input id="taxId" value="US123456789" />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="address">Billing Address</Label>
                        <Input id="address" value="123 Main St, Suite 100" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-3">
                          <Label htmlFor="city">City</Label>
                          <Input id="city" value="San Francisco" />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="state">State/Province</Label>
                          <Input id="state" value="CA" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="grid gap-3">
                          <Label htmlFor="zip">ZIP/Postal Code</Label>
                          <Input id="zip" value="94103" />
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="country">Country</Label>
                          <Input id="country" value="United States" />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-6">
                      <Button>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};
