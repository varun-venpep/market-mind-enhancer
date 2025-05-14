
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface BloggerConnectFormProps {
  onConnect: () => void;
  isConnecting: boolean;
  error: string | null;
}

export function BloggerConnectForm({ onConnect, isConnecting, error }: BloggerConnectFormProps) {
  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button 
        onClick={onConnect} 
        disabled={isConnecting}
        className="w-full"
      >
        {isConnecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>Connect with Google</>
        )}
      </Button>
    </div>
  );
}
