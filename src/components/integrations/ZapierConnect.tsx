
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
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to connect Zapier');
      return;
    }
    
    if (!apiKey) {
      toast.error('Please enter your Zapier API key');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Store the Zapier API key
      const { error } = await supabase
        .from('integrations')
        .upsert({ 
          user_id: user.id,
          type: 'zapier',
          credentials: { api_key: apiKey },
          created_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast.success('Zapier connected successfully!');
      setApiKey('');
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
            <Label htmlFor="apiKey">Zapier API Key</Label>
            <Input
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Zapier API key"
              required
            />
            <p className="text-xs text-muted-foreground">
              You can find your API key in your Zapier account settings
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Connecting...' : 'Connect Zapier'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ZapierConnect;
