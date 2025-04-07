
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const ZapierConnect = () => {
  const [apiKey, setApiKey] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to connect Zapier');
      return;
    }
    
    if (!apiKey && !webhookUrl) {
      toast.error('Please enter either your Zapier API key or a webhook URL');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use type assertion to bypass TypeScript error
      // This is safe because we know the table exists in Supabase
      const { error } = await (supabase as any)
        .from('integrations')
        .upsert({ 
          user_id: user.id,
          type: 'zapier',
          credentials: { 
            api_key: apiKey || null,
            webhook_url: webhookUrl || null 
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast.success('Zapier connected successfully!');
      setApiKey('');
      setWebhookUrl('');
    } catch (error) {
      console.error('Zapier connection error:', error);
      toast.error('Error connecting to Zapier');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Connect Zapier</CardTitle>
        <CardDescription>
          Connect MarketMind to Zapier to automate your SEO workflows
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleConnect}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">Zapier API Key (Optional)</Label>
            <Input
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Zapier API key"
            />
            <p className="text-xs text-muted-foreground">
              You can find your API key in your Zapier account settings
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="webhookUrl">Zapier Webhook URL (Optional)</Label>
            <Input
              id="webhookUrl"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="Enter your Zapier webhook URL"
            />
            <p className="text-xs text-muted-foreground">
              Create a Zapier webhook to trigger actions when SEO events occur
            </p>
          </div>
          
          <p className="text-sm text-muted-foreground">
            You need to provide either an API key or a webhook URL to connect Zapier
          </p>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading || (!apiKey && !webhookUrl)}>
            {isLoading ? 'Connecting...' : 'Connect Zapier'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ZapierConnect;
