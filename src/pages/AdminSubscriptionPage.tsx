
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminSubscriptionPage = () => {
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [planDuration, setPlanDuration] = useState("month");
  const [userFound, setUserFound] = useState<boolean | null>(null);
  
  const handleLookup = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }
    
    setIsLoading(true);
    setUserFound(null);
    
    try {
      // Look up user through edge function
      const { data, error } = await supabase.functions.invoke('lookup-user', {
        body: { email },
      });
      
      if (error || !data?.user) {
        toast.error("User not found");
        setUserFound(false);
        setUserId(null);
        setSubscriptionStatus(null);
        return;
      }
      
      setUserId(data.user.id);
      
      // Get user's current subscription status from edge function
      const { data: subData, error: subError } = await supabase.functions.invoke('check-user-subscription', {
        body: { userId: data.user.id },
      });
      
      if (subError) {
        console.error("Error checking subscription:", subError);
      }
      
      setSubscriptionStatus(subData?.isPro ? 'pro' : 'free');
      setUserFound(true);
    } catch (error) {
      console.error("Error looking up user:", error);
      toast.error("Error finding user");
      setUserFound(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSetPro = async () => {
    if (!userId) {
      toast.error("No user selected");
      return;
    }
    
    setIsUpdating(true);
    
    try {
      // Use edge function to set user to pro
      const { error } = await supabase.functions.invoke('admin-set-subscription', {
        body: { 
          userId,
          action: 'upgrade',
          duration: planDuration
        },
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("User successfully upgraded to Pro!");
      setSubscriptionStatus("pro");
    } catch (error) {
      console.error("Error upgrading user:", error);
      toast.error("Failed to upgrade user");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelPro = async () => {
    if (!userId) {
      toast.error("No user selected");
      return;
    }
    
    setIsUpdating(true);
    
    try {
      // Use edge function to cancel subscription
      const { error } = await supabase.functions.invoke('admin-set-subscription', {
        body: { 
          userId,
          action: 'cancel'
        },
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Pro subscription canceled successfully");
      setSubscriptionStatus("free");
    } catch (error) {
      console.error("Error canceling subscription:", error);
      toast.error("Failed to cancel subscription");
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Admin Subscription Management</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>User Lookup</CardTitle>
            <CardDescription>
              Find a user by email address to manage their subscription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1">
                <Label htmlFor="email">User Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleLookup} 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Looking up...</>
                  ) : (
                    'Find User'
                  )}
                </Button>
              </div>
            </div>
            
            {userFound === false && (
              <div className="mt-4 flex items-center text-red-500">
                <XCircle className="h-5 w-5 mr-2" />
                <span>User not found</span>
              </div>
            )}
            
            {userFound === true && (
              <div className="mt-4 flex items-center text-green-500">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>User found: ID {userId}</span>
              </div>
            )}
          </CardContent>
        </Card>
        
        {userFound && userId && (
          <Card>
            <CardHeader>
              <CardTitle>Subscription Management</CardTitle>
              <CardDescription>
                Manually manage this user's subscription status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-1">Current Status</h3>
                  <div className="flex items-center">
                    <Badge variant={subscriptionStatus === 'pro' ? 'default' : 'outline'}>
                      {subscriptionStatus === 'pro' ? 'Pro Subscription' : 'Free Plan'}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-3">Update Subscription</h3>
                  
                  {subscriptionStatus !== 'pro' ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="plan-duration">Plan Duration</Label>
                          <Select
                            value={planDuration}
                            onValueChange={setPlanDuration}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="month">Monthly</SelectItem>
                              <SelectItem value="year">Yearly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={handleSetPro} 
                        disabled={isUpdating}
                        className="w-full"
                      >
                        {isUpdating ? (
                          <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Upgrading...</>
                        ) : (
                          'Set User to Pro'
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      onClick={handleCancelPro} 
                      disabled={isUpdating}
                      variant="destructive"
                      className="w-full"
                    >
                      {isUpdating ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Canceling...</>
                      ) : (
                        'Cancel Pro Subscription'
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminSubscriptionPage;
