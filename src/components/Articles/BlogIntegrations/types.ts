
export interface BlogPlatformCredentials {
  access_token: string;
  refresh_token?: string;
  expires_at: number;
}

export interface BlogPlatformIntegrationProps {
  platform: "blogger" | "medium";
  title: string;
  description: string;
  authUrl: string;
  onConnect: () => void;
  onDisconnect: () => void;
  isConnected?: boolean;
}
