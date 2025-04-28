
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Check, ExternalLink, Loader2, Trash } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { disconnectIntegration, isIntegrationConnected, saveIntegrationCredentials } from "@/utils/blogIntegrations";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface BlogPlatformIntegrationProps {
  platform: "blogger" | "medium";
  title: string;
  description: string;
  authUrl: string;
  onConnect: () => void;
  onDisconnect: () => void;
  isConnected?: boolean;
}

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
  const [accessToken, setAccessToken] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (externalIsConnected !== undefined) {
      setConnected(externalIsConnected);
      setLoading(false);
    } else {
      checkConnection();
    }
  }, [externalIsConnected]);

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
    
    try {
      const { data: { url }, error } = await supabase.functions.invoke('blogger-auth', {
        body: {
          redirectUrl: `${window.location.origin}/dashboard/blog-integrations`
        }
      });

      if (error) throw error;
      window.location.href = url;
    } catch (err) {
      console.error('Error starting Blogger auth:', err);
      toast.error('Failed to connect to Blogger');
      setConnectLoading(false);
    }
  };

  const handleMediumConnect = async () => {
    if (!accessToken) {
      setError("Please enter your access token");
      return;
    }

    setConnectLoading(true);
    setError(null);
    
    try {
      // For simplicity, we're just using an access token
      // In a production app, you'd handle the full OAuth flow
      const credentials = {
        access_token: accessToken,
        expires_at: Date.now() + 3600000 // 1 hour expiry for example
      };
      
      const success = await saveIntegrationCredentials(platform, credentials);
      
      if (success) {
        setConnected(true);
        setAccessToken("");
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

  const platformIcons = {
    blogger: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M14.13 4.35c-1.2.07-3.14.48-4.11 1.13a5.52 5.52 0 00-2.26 3.34c-.2.90-.29 1.8-.31 3.22-.02 1.55-.07 1.94-.35 2.72-.22.6-.41.89-.83 1.3-.28.28-.51.5-.51.51 0 0 .16.22.35.48.73 1 1.02 1.91 1.05 3.28.02.95.12 1.43.47 2.17.7 1.5 2.3 2.43 4.83 2.8 1.1.17 4.16.17 5.36 0 2.38-.33 3.93-1.17 4.8-2.57.45-.73.66-1.43.75-2.52.04-.51.1-.97.14-1.03.07-.11.5-.28.7-.28.08 0 .14-.89.16-2.29l.02-2.28-.29-.14c-.35-.17-.88-.14-1.33.08-.27.13-.33.13-.33-.02 0-.38-1.05-1.93-1.7-2.5-1.06-.93-2.07-1.36-3.55-1.5-.47-.05-.56-.09-.66-.35-.36-.9-1.29-3.69-1.54-4.56-.1-.32-.24-.6-.34-.67-.22-.17-1.06-.31-1.82-.32zm-.15 5.94c.57.07 1.07.41 1.39.94.23.38.23.41.23 3.76v3.38l-.28.01c-.15.01-.9.04-1.68.08-1.55.07-2.14-.02-2.77-.41-.59-.36-.93-.93-1.01-1.66-.15-1.38.71-2.58 2.04-2.85.47-.09 1.13.02 1.47.26.14.1.28.16.3.14.06-.06-.24-.8-.42-1.05-.55-.75-1.47-.95-2.35-.5-.43.22-1.05.93-1.31 1.49-.42.91-.45 1.89-.07 2.85.85 2.15 3.17 3.03 5.14 1.96.21-.11.4-.19.43-.17.08.08-.39.67-.77.97-.69.53-1.3.69-2.59.69-1.31 0-1.49-.04-2.25-.52-.75-.47-1.21-1.11-1.5-2.1-.14-.46-.16-1.83-.03-2.34.12-.52.6-1.58.89-1.97 1.07-1.46 3.07-2.25 4.74-1.89zM12.9 14c.53.27.78.69.79 1.31.01.78-.35 1.33-1.03 1.55-.21.07-.8.09-2.02.07l-1.74-.03v-3.21l1.85.03c1.44.03 1.91.06 2.15.18z" />
      </svg>
    ),
    medium: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
      </svg>
    )
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardHeader className={`flex flex-row items-center gap-4 bg-muted/10 ${platform === 'blogger' ? 'border-l-4 border-l-orange-500' : 'border-l-4 border-l-black'}`}>
        <div className={`rounded-full p-2 ${platform === 'blogger' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>
          {platformIcons[platform]}
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
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center justify-center bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 w-full py-3 rounded-md">
              <Check className="mr-2 h-5 w-5" />
              <span className="font-medium">Connected successfully</span>
            </div>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.open(`https://${platform}.com/my-blogs`, '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View my {platform === 'blogger' ? 'Blogs' : 'Stories'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {platform === 'blogger' ? (
              <Button 
                onClick={handleBloggerConnect} 
                disabled={connectLoading}
                className="w-full"
              >
                {connectLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>Connect with Google</>
                )}
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`${platform}-token`}>Access Token</Label>
                  <Input
                    id={`${platform}-token`}
                    type="text"
                    placeholder="Paste your access token here"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    You can get your access token by authenticating with {platform}.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button onClick={handleMediumConnect} disabled={connectLoading} className="w-full">
                    {connectLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>Connect to {platform.charAt(0).toUpperCase() + platform.slice(1)}</>
                    )}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => window.open(authUrl, '_blank')}
                    className="w-full"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Get Authentication Token
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      {connected && (
        <CardFooter className="bg-muted/10 border-t">
          <Button 
            variant="destructive" 
            onClick={handleDisconnect} 
            disabled={disconnectLoading}
            className="w-full"
          >
            {disconnectLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Disconnecting...
              </>
            ) : (
              <>
                <Trash className="mr-2 h-4 w-4" />
                Disconnect {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
