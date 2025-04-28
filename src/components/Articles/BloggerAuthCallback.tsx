
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function BloggerAuthCallback() {
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code from the URL
        const url = new URL(window.location.href);
        const code = url.searchParams.get('code');
        const error = url.searchParams.get('error');
        
        if (error) {
          setError(`Authentication failed: ${error}`);
          toast.error(`Authentication failed: ${error}`);
          setTimeout(() => navigate('/dashboard/blog-integrations'), 2000);
          return;
        }
        
        if (!code) {
          setError('No authorization code found in the URL');
          toast.error('Authentication failed: No authorization code found');
          setTimeout(() => navigate('/dashboard/blog-integrations'), 2000);
          return;
        }

        // Get the current user
        const { data: userData } = await supabase.auth.getUser();
        
        if (!userData?.user) {
          setError('You must be logged in to complete authentication');
          toast.error('Authentication failed: Not logged in');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        // Create the redirect URI
        const redirectUri = `${window.location.origin}/dashboard/blog-integrations`;
        
        // Exchange the code for tokens using the edge function
        const { data, error: functionError } = await supabase.functions.invoke('blogger-callback', {
          body: {
            code,
            redirectUri,
            userId: userData.user.id
          }
        });

        if (functionError || !data?.success) {
          throw new Error(functionError?.message || data?.error || 'Failed to authenticate with Blogger');
        }

        // Success - redirect back to the integrations page
        toast.success('Successfully connected to Blogger!');
        navigate('/dashboard/blog-integrations');
        
      } catch (err) {
        console.error('Error during Blogger authentication:', err);
        setError(err.message || 'Failed to complete authentication');
        toast.error('Authentication failed');
        setTimeout(() => navigate('/dashboard/blog-integrations'), 2000);
      } finally {
        setProcessing(false);
      }
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Authentication Error</h1>
        <p className="text-gray-700 mb-6">{error}</p>
        <p className="text-sm text-gray-500">Redirecting you back...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Authenticating with Blogger</h1>
      {processing ? (
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-gray-600">Processing your authentication...</p>
        </div>
      ) : (
        <p className="text-green-600">Authentication complete! Redirecting you back...</p>
      )}
    </div>
  );
}
