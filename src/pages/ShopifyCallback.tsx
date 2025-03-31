
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export default function ShopifyCallback() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    const completeAuth = async () => {
      try {
        const queryParams = new URLSearchParams(location.search);
        const shop = queryParams.get('shop');
        const code = queryParams.get('code');
        const hmac = queryParams.get('hmac');
        const timestamp = queryParams.get('timestamp');
        
        if (!shop || !code) {
          throw new Error('Missing required parameters');
        }
        
        const response = await fetch(`${BACKEND_URL}/shopify-callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            shop,
            code,
            hmac,
            timestamp
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to authenticate with Shopify');
        }
        
        const data = await response.json();
        
        toast({
          title: 'Store Connected Successfully',
          description: `Your Shopify store ${shop} has been connected to the SEO platform.`
        });
        
        // Redirect to the Shopify stores page
        navigate('/dashboard/shopify');
      } catch (err) {
        console.error('Authentication error:', err);
        setError(err instanceof Error ? err.message : 'Failed to connect your Shopify store');
        toast({
          title: 'Connection Failed',
          description: err instanceof Error ? err.message : 'Failed to connect your Shopify store',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    completeAuth();
  }, [location.search, navigate, toast]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {isLoading ? 'Connecting Your Shopify Store' : 
             error ? 'Connection Failed' : 'Store Connected Successfully'}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {isLoading ? (
            <>
              <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
              <p className="text-center text-muted-foreground">
                Please wait while we complete the connection to your Shopify store...
              </p>
            </>
          ) : error ? (
            <>
              <div className="rounded-full bg-destructive/10 p-4 mb-4">
                <span className="text-destructive text-3xl">✕</span>
              </div>
              <p className="text-center text-muted-foreground mb-4">{error}</p>
              <button 
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                onClick={() => navigate('/dashboard/shopify')}
              >
                Return to Shopify Stores
              </button>
            </>
          ) : (
            <>
              <div className="rounded-full bg-green-100 p-4 mb-4">
                <span className="text-green-600 text-3xl">✓</span>
              </div>
              <p className="text-center text-muted-foreground mb-4">
                Your Shopify store has been successfully connected to the SEO platform.
              </p>
              <button 
                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                onClick={() => navigate('/dashboard/shopify')}
              >
                View Connected Stores
              </button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
