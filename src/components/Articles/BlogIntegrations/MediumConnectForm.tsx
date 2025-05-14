
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, ExternalLink, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface MediumConnectFormProps {
  onConnect: (token: string) => void;
  isConnecting: boolean;
  error: string | null;
  authUrl: string;
}

export function MediumConnectForm({ onConnect, isConnecting, error, authUrl }: MediumConnectFormProps) {
  const [accessToken, setAccessToken] = useState("");

  const handleConnect = () => {
    if (accessToken) {
      onConnect(accessToken);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-2">
        <Label htmlFor="medium-token">Access Token</Label>
        <Input
          id="medium-token"
          type="text"
          placeholder="Paste your access token here"
          value={accessToken}
          onChange={(e) => setAccessToken(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          You can get your access token by authenticating with Medium.
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <Button onClick={handleConnect} disabled={isConnecting || !accessToken} className="w-full">
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            <>Connect to Medium</>
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
  );
}
