
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, ExternalLink, Loader2, Trash } from "lucide-react";

interface ConnectedStateProps {
  platform: "blogger" | "medium";
  onDisconnect: () => void;
  isDisconnecting: boolean;
}

export function ConnectedState({ platform, onDisconnect, isDisconnecting }: ConnectedStateProps) {
  return (
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
      
      <Button 
        variant="destructive" 
        onClick={onDisconnect} 
        disabled={isDisconnecting}
        className="w-full"
      >
        {isDisconnecting ? (
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
    </div>
  );
}
