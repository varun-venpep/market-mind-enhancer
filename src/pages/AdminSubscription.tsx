
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import DashboardLayout from '@/components/Dashboard/DashboardLayout';

// Define a more complete profile type that includes all needed properties
interface AdminProfile {
  id: string;
  email?: string;
  full_name: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
  plan: string;
  subscription_status?: string;
  trial_ends_at: string;
  stripe_customer_id?: string;
}

const AdminSubscription = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_API_URL}/functions/v1/get-admin-profile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            admin_id: import.meta.env.VITE_ADMIN_ID
          })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch admin profile');
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching admin profile:', error);
        toast.error('Failed to load admin profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateSubscription = async (plan: string, status: string) => {
    setUpdating(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_API_URL}/functions/v1/update-admin-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          admin_id: import.meta.env.VITE_ADMIN_ID,
          plan,
          subscription_status: status,
          // Set trial to end in 14 days from now if it's a trial
          trial_ends_at: status === 'trialing' ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() : null,
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update subscription');
      }

      toast.success(`Subscription updated to ${plan} (${status})`);
      
      // Update the local profile state
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          plan,
          subscription_status: status,
          trial_ends_at: status === 'trialing' ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() : prev.trial_ends_at,
        };
      });
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast.error('Failed to update subscription');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <p>Loading admin profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <p>No admin profile found. Please check your environment variables.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Admin Subscription Management</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Admin Profile</CardTitle>
            <CardDescription>View and manage the admin user profile</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>ID:</strong> {profile.id}</p>
              <p><strong>Email:</strong> {profile.email || 'Not set'}</p>
              <p><strong>Name:</strong> {profile.full_name}</p>
              <p><strong>Current Plan:</strong> {profile.plan || 'No plan'}</p>
              <p><strong>Subscription Status:</strong> {profile.subscription_status || 'No subscription'}</p>
              <p><strong>Stripe Customer ID:</strong> {profile.stripe_customer_id || 'Not linked to Stripe'}</p>
              {profile.trial_ends_at && (
                <p><strong>Trial Ends:</strong> {new Date(profile.trial_ends_at).toLocaleDateString()}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Update Subscription</CardTitle>
            <CardDescription>Manually update the subscription plan and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium mb-2">Free Plan</h3>
                <Button 
                  variant="outline" 
                  className="mr-2 mb-2"
                  disabled={updating || (profile.plan === 'free' && !profile.subscription_status)}
                  onClick={() => handleUpdateSubscription('free', '')}
                >
                  Set as Free
                </Button>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Basic Plan</h3>
                <Button 
                  variant="outline" 
                  className="mr-2 mb-2"
                  disabled={updating || (profile.plan === 'basic' && profile.subscription_status === 'active')}
                  onClick={() => handleUpdateSubscription('basic', 'active')}
                >
                  Active
                </Button>
                <Button 
                  variant="outline" 
                  className="mr-2 mb-2"
                  disabled={updating || (profile.plan === 'basic' && profile.subscription_status === 'trialing')}
                  onClick={() => handleUpdateSubscription('basic', 'trialing')}
                >
                  Trial
                </Button>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Pro Plan</h3>
                <Button 
                  variant="outline" 
                  className="mr-2 mb-2"
                  disabled={updating || (profile.plan === 'pro' && profile.subscription_status === 'active')}
                  onClick={() => handleUpdateSubscription('pro', 'active')}
                >
                  Active
                </Button>
                <Button 
                  variant="outline" 
                  className="mr-2 mb-2"
                  disabled={updating || (profile.plan === 'pro' && profile.subscription_status === 'trialing')}
                  onClick={() => handleUpdateSubscription('pro', 'trialing')}
                >
                  Trial
                </Button>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Enterprise Plan</h3>
                <Button 
                  variant="outline" 
                  className="mr-2 mb-2"
                  disabled={updating || (profile.plan === 'enterprise' && profile.subscription_status === 'active')}
                  onClick={() => handleUpdateSubscription('enterprise', 'active')}
                >
                  Active
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Changes take effect immediately and will update the user's access level.
            </p>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminSubscription;
