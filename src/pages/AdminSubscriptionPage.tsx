
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Define the profile type based on the actual data structure
interface ProfileData {
  id: string;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  plan?: string;
  subscription_status?: string;
  trial_ends_at?: string;
  stripe_customer_id?: string;
  created_at?: string;
  updated_at?: string;
}

const AdminSubscriptionPage = () => {
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
        // Use the edge function to get admin data
        const { data, error } = await supabase.functions.invoke('get-admin-profile', {
          body: { admin_id: 'YOUR_ADMIN_USER_ID' } // Replace with your admin user ID
        });

        if (error) {
          console.error('Error fetching admin data:', error);
          toast.error('Failed to fetch admin data');
          return;
        }

        if (data) {
          const profile = data as ProfileData;
          setEmail(profile.email || '');
          setPlan(profile.plan || 'free');
          setSubscriptionStatus(profile.subscription_status || 'inactive');
          setTrialEndsAt(profile.trial_ends_at || '');
          setCustomerId(profile.stripe_customer_id || '');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      // Use the edge function to update admin data
      const { error } = await supabase.functions.invoke('update-admin-profile', {
        body: {
          admin_id: 'YOUR_ADMIN_USER_ID', // Replace with your admin user ID
          plan,
          subscription_status: subscriptionStatus,
          trial_ends_at: trialEndsAt,
          stripe_customer_id: customerId
        }
      });

      if (error) {
        console.error('Error updating admin data:', error);
        toast.error('Failed to update admin data');
      } else {
        toast.success('Admin data updated successfully');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An unexpected error occurred');
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

export default AdminSubscriptionPage;
