
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { disconnectIntegration, isIntegrationConnected } from "@/utils/blogIntegrations";
import { useLocation, useNavigate } from "react-router-dom";
import { BlogPlatformIntegrationProps } from "./types";
import { PlatformIcon } from "./PlatformIcons";
import { ConnectedState } from "./ConnectedState";
import { BloggerConnectForm } from "./BloggerConnectForm";
import { MediumConnectForm } from "./MediumConnectForm";
import { Loader2 } from "lucide-react";

export function BlogPlatformIntegration({
  platform,
  title,
  description,
  authUrl,
  onConnect,
  onDisconnect,
  isConnected: externalIsConnected
}: BlogPlatformIntegrationProps) {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connectLoading, setConnectLoading] = useState(false);
  const [disconnectLoading, setDisconnectLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (externalIsConnected !== undefined) {
      setConnected(externalIsConnected);
      setLoading(false);
    } else {
      checkConnection();
    }
  }, [externalIsConnected]);

  // Handle OAuth callback when returning from Google auth
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state');
      const error = url.searchParams.get('error');
      
      // Clear the URL parameters
      if (code || error) {
        window.history.replaceState({}, document.title, location.pathname);
      }

      // If there's an error in the URL, show it
      if (error) {
        setError(`Authorization failed: ${error}`);
        return;
      }
      
      // Handle Blogger OAuth callback
      if (code && state === 'blogger') {
        setConnectLoading(true);
        try {
          const { data: user } = await supabase.auth.getUser();
          
          if (!user.user) {
            throw new Error("You must be logged in to connect Blogger");
          }

          const redirectUri = `${window.location.origin}${location.pathname}`;
          
          const { data, error } = await supabase.functions.invoke('blogger-callback', {
            body: {
              code,
              redirectUri,
              userId: user.user.id
            }
          });

          if (error) throw error;
          
          if (data.success) {
            setConnected(true);
            onConnect();
            toast.success('Successfully connected to Blogger');
            
            if (data.hasBloggerAccount) {
              if (data.blogsCount > 0) {
                toast.success(`Found ${data.blogsCount} Blogger ${data.blogsCount === 1 ? 'blog' : 'blogs'}`);
              } else {
                toast.info("Connected successfully, but no blogs found. Create a blog on Blogger to start publishing.");
              }
            }
          } else {
            throw new Error(data.error || "Failed to connect to Blogger");
          }
        } catch (err) {
          console.error('Error processing Blogger callback:', err);
          setError(`Failed to connect Blogger: ${err.message}`);
          toast.error('Failed to connect to Blogger');
        } finally {
          setConnectLoading(false);
        }
      }
    };

    handleOAuthCallback();
  }, [location.search, location.pathname]);

  const checkConnection = async () => {
    setLoading(true);
    try {
      const isConnected = await isIntegrationConnected(platform);
      setConnected(isConnected);
    } catch (err) {
      console.error(`Error checking ${platform} connection:`, err);
      setError(`Failed to check ${platform} connection status.`);
    } finally {
      setLoading(false);
    }
  };

  const handleBloggerConnect = async () => {
    setConnectLoading(true);
    setError(null);
    
    try {
      // Ensure user is logged in
      const { data: user } = await supabase.auth.getUser();
      
      if (!user.user) {
        toast.error('You must be logged in to connect Blogger');
        return;
      }

      // Generate the redirect URL that includes the current path
      const redirectUrl = `${window.location.origin}${location.pathname}`;
      
      // Call the edge function to get the auth URL
      const { data, error } = await supabase.functions.invoke('blogger-auth', {
        body: { redirectUrl }
      });

      if (error) throw error;

      if (!data || !data.url) {
        throw new Error('Invalid response from authentication service');
      }

      // Add state parameter to identify the platform when returning
      const authUrlWithState = new URL(data.url);
      authUrlWithState.searchParams.append('state', 'blogger');
      
      // Redirect to Google's OAuth consent screen
      window.location.href = authUrlWithState.toString();
    } catch (err) {
      console.error('Error starting Blogger auth:', err);
      toast.error('Failed to connect to Blogger');
      setError(`Failed to connect: ${err.message}`);
      setConnectLoading(false);
    }
  };

  const handleMediumConnect = async (token: string) => {
    setConnectLoading(true);
    setError(null);
    
    try {
      // For simplicity, we're just using an access token
      // In a production app, you'd handle the full OAuth flow
      const credentials = {
        access_token: token,
        expires_at: Date.now() + 3600000 // 1 hour expiry for example
      };
      
      const success = await saveIntegrationCredentials(platform, credentials);
      
      if (success) {
        setConnected(true);
        onConnect();
      }
    } catch (err) {
      console.error(`Error connecting to ${platform}:`, err);
      setError(`Failed to connect to ${platform}. Please check your token and try again.`);
    } finally {
      setConnectLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setDisconnectLoading(true);
    setError(null);
    
    try {
      const success = await disconnectIntegration(platform);
      
      if (success) {
        setConnected(false);
        onDisconnect();
      }
    } catch (err) {
      console.error(`Error disconnecting from ${platform}:`, err);
      setError(`Failed to disconnect from ${platform}.`);
    } finally {
      setDisconnectLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className={`flex flex-row items-center gap-4 bg-muted/10 ${platform === 'blogger' ? 'border-l-4 border-l-orange-500' : 'border-l-4 border-l-black'}`}>
        <div className={`rounded-full p-2 ${platform === 'blogger' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>
          <PlatformIcon platform={platform} />
        </div>
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : connected ? (
          <ConnectedState 
            platform={platform} 
            onDisconnect={handleDisconnect}
            isDisconnecting={disconnectLoading}
          />
        ) : (
          <>
            {platform === 'blogger' ? (
              <BloggerConnectForm 
                onConnect={handleBloggerConnect}
                isConnecting={connectLoading}
                error={error}
              />
            ) : (
              <MediumConnectForm 
                onConnect={handleMediumConnect}
                isConnecting={connectLoading}
                error={error}
                authUrl={authUrl}
              />
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Add the missing helper function used by Medium connect
import { saveIntegrationCredentials } from "@/utils/blogIntegrations";

// Export the refactored component from the index file
