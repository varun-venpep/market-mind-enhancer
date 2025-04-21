
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type Props = {
  authError?: string | null;
  connectionError?: string | null;
};

const ShopifyConnectAlerts: React.FC<Props> = ({ authError, connectionError }) => (
  <>
    {authError && (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Authentication Required</AlertTitle>
        <AlertDescription>{authError}</AlertDescription>
      </Alert>
    )}
    {connectionError && (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Connection Failed</AlertTitle>
        <AlertDescription>{connectionError}</AlertDescription>
      </Alert>
    )}
  </>
);

export default ShopifyConnectAlerts;
