
import { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { ExternalLink, Mail, Phone } from 'lucide-react';

const UserProfile = () => {
  const { user, isLoaded } = useUser();
  const { isPro } = useSubscription();
  const [isSaving, setIsSaving] = useState(false);

  if (!isLoaded) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Loading user profile...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-28 flex items-center justify-center">
            <div className="animate-pulse flex space-x-4 w-full">
              <div className="rounded-full bg-slate-200 h-16 w-16"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!user) return null;
  
  const fullName = user.fullName || 'User';
  const primaryEmail = user.primaryEmailAddress?.emailAddress || 'No email provided';
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Account Profile</CardTitle>
            <CardDescription>Manage your account details and settings</CardDescription>
          </div>
          <div>
            {isPro && (
              <Badge className="bg-gradient-to-r from-brand-400 to-brand-600 text-white">
                Pro Subscription
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center space-y-3">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.imageUrl} alt={fullName} />
              <AvatarFallback>{fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => user.update({})}
            >
              Change Avatar
            </Button>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
              <p className="text-sm font-medium">{fullName}</p>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <p className="text-sm font-medium">{primaryEmail}</p>
              </div>
            </div>
            
            {user.phoneNumbers && user.phoneNumbers.length > 0 && (
              <div className="space-y-1">
                <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <p className="text-sm font-medium">{user.phoneNumbers[0].phoneNumber}</p>
                </div>
              </div>
            )}
            
            <Separator />
            
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Account Options</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => user.update({})}
                >
                  Manage Account
                </Button>
                <Button 
                  variant={isPro ? "default" : "outline"}
                  size="sm"
                  onClick={() => window.location.href = '/pricing'}
                >
                  {isPro ? "Manage Subscription" : "Upgrade to Pro"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-5">
        <Button variant="outline" onClick={() => window.open('https://clerk.com/docs', '_blank')}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Help & Support
        </Button>
        
        <Button 
          onClick={() => {
            setIsSaving(true);
            setTimeout(() => setIsSaving(false), 1000);
          }} 
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserProfile;
