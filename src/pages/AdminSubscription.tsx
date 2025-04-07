
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
      // Find user by email
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id, plan")
        .eq("email", email)
        .single();
      
      if (userError) {
        // Try to find user in auth.users through a function
        const { data: authData, error: authError } = await supabase.functions.invoke('lookup-user', {
          body: { email },
        });
        
        if (authError || !authData?.user) {
          toast.error("User not found");
          setUserFound(false);
          setUserId(null);
          setSubscriptionStatus(null);
          return;
        }
        
        setUserId(authData.user.id);
        setUserFound(true);
        setSubscriptionStatus('free');
        return;
      }
      
      setUserId(userData.id);
      setSubscriptionStatus(userData.plan || 'free');
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
      // Calculate current period end date based on plan duration
      const currentDate = new Date();
      const endDate = new Date();
      if (planDuration === "month") {
        endDate.setMonth(currentDate.getMonth() + 1);
      } else if (planDuration === "year") {
        endDate.setFullYear(currentDate.getFullYear() + 1);
      }
      
      // Update profile to pro
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          plan: "pro",
          trial_ends_at: endDate.toISOString()
        })
        .eq("id", userId);
      
      if (updateError) {
        throw updateError;
      }
      
      // Create a fake subscription record
      const { error: subError } = await supabase
        .from("subscriptions")
        .upsert({
          id: `manual_${userId}_${Date.now()}`,
          user_id: userId,
          status: "active",
          price_id: planDuration === "month" ? "price_monthly_manual" : "price_yearly_manual",
          product_id: "prod_manual",
          current_period_start: currentDate.toISOString(),
          current_period_end: endDate.toISOString(),
          created_at: currentDate.toISOString(),
          updated_at: currentDate.toISOString()
        });
      
      if (subError) {
        throw subError;
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
      // Update profile to free
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          plan: "free",
          trial_ends_at: null
        })
        .eq("id", userId);
      
      if (updateError) {
        throw updateError;
      }
      
      // Update all subscriptions to canceled
      const { error: subError } = await supabase
        .from("subscriptions")
        .update({
          status: "canceled",
          updated_at: new Date().toISOString()
        })
        .eq("user_id", userId);
      
      if (subError) {
        throw subError;
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
