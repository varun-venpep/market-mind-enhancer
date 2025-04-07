import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

const AdminSubscription = () => {
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('free');
  const [subscriptionStatus, setSubscriptionStatus] = useState('inactive');
  const [trialEndsAt, setTrialEndsAt] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', 'YOUR_ADMIN_USER_ID') // Replace with your admin user ID
          .single();

        if (error) {
          console.error('Error fetching admin data:', error);
          toast.error('Failed to fetch admin data');
        }

        if (data) {
          setEmail(data.email || '');
          setPlan(data.plan || 'free');
          setSubscriptionStatus(data.subscription_status || 'inactive');
          setTrialEndsAt(data.trial_ends_at || '');
          setCustomerId(data.stripe_customer_id || '');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          plan: plan,
          subscription_status: subscriptionStatus,
          trial_ends_at: trialEndsAt,
          stripe_customer_id: customerId,
        })
        .eq('id', 'YOUR_ADMIN_USER_ID'); // Replace with your admin user ID

      if (error) {
        console.error('Error updating admin data:', error);
        toast.error('Failed to update admin data');
      } else {
        toast.success('Admin data updated successfully');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Admin Subscription Management</CardTitle>
          <CardDescription>
            Manage subscription details for the admin user.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} disabled />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="plan">Plan</Label>
            <Input
              id="plan"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="subscriptionStatus">Subscription Status</Label>
            <Input
              id="subscriptionStatus"
              value={subscriptionStatus}
              onChange={(e) => setSubscriptionStatus(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="trialEndsAt">Trial Ends At</Label>
            <Input
              id="trialEndsAt"
              value={trialEndsAt}
              onChange={(e) => setTrialEndsAt(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="customerId">Stripe Customer ID</Label>
            <Input
              id="customerId"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? 'Updating...' : 'Update'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminSubscription;
