
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface WordPressFormData {
  siteUrl: string;
  username: string;
  apiKey: string;
}

const WordPressConnect = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<WordPressFormData>({
    siteUrl: '',
    username: '',
    apiKey: ''
  });
  const { user } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to connect your WordPress site');
      return;
    }
    
    if (!formData.siteUrl || !formData.username || !formData.apiKey) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Validate the WordPress credentials
      const { data, error } = await supabase.functions.invoke('wordpress-connect', {
        body: { 
          siteUrl: formData.siteUrl,
          username: formData.username,
          apiKey: formData.apiKey,
          userId: user.id
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data?.success) {
        toast.success('WordPress site connected successfully!');
        setFormData({ siteUrl: '', username: '', apiKey: '' });
      } else {
        toast.error(data?.message || 'Failed to connect WordPress site');
      }
    } catch (error) {
      console.error('WordPress connection error:', error);
      toast.error('Error connecting to WordPress site');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Connect WordPress Site</CardTitle>
        <CardDescription>
          Connect your WordPress site to analyze and optimize its SEO performance
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleConnect}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteUrl">WordPress Site URL</Label>
            <Input
              id="siteUrl"
              name="siteUrl"
              placeholder="https://yoursite.com"
              value={formData.siteUrl}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              placeholder="Your WordPress username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiKey">Application Password</Label>
            <Input
              id="apiKey"
              name="apiKey"
              type="password"
              placeholder="WordPress application password"
              value={formData.apiKey}
              onChange={handleInputChange}
              required
            />
            <p className="text-xs text-muted-foreground">
              You can generate an application password in your WordPress admin under Users → Profile → Application Passwords
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Connecting...' : 'Connect WordPress Site'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default WordPressConnect;
