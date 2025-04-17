
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { 
  SignIn, 
  useSignIn, 
  useUser 
} from "@clerk/clerk-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BackgroundBoxesDemo } from "@/components/ui/background-boxes";

const Login = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [redirectInProgress, setRedirectInProgress] = useState(false);
  const { setActive } = useSignIn();

  useEffect(() => {
    if (isSignedIn && !redirectInProgress) {
      navigate("/dashboard");
    }
  }, [isSignedIn, navigate, redirectInProgress]);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="flex flex-col md:flex-row w-full">
        {/* Left side - Authentication UI */}
        <div className="w-full md:w-1/2 p-6 flex items-center justify-center">
          <Card className="w-full max-w-md shadow-xl">
            <CardHeader className="bg-primary text-primary-foreground space-y-1 p-6">
              <CardTitle className="text-2xl font-bold">
                Welcome to MarketMind
              </CardTitle>
              <CardDescription className="text-primary-foreground/90">
                Sign in to access your account
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="signin">
                  <SignIn 
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "w-full shadow-none p-0",
                        header: "hidden",
                        footer: "hidden"
                      }
                    }}
                    redirectUrl="/dashboard"
                    signUpUrl="/signup"
                    afterSignInUrl="/dashboard"
                  />
                </TabsContent>
                <TabsContent value="signup">
                  <div className="text-center py-4">
                    <p className="mb-4">Create a new account to get started</p>
                    <Button 
                      variant="default" 
                      onClick={() => navigate('/signup')}
                      className="w-full"
                    >
                      Go to Sign Up
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6">
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    // For demo purposes - this would typically be handled by Clerk
                    toast({
                      title: "Demo Access",
                      description: "Use the Sign In form to access the demo"
                    });
                  }}
                >
                  Quick Demo Access
                </Button>
              </div>
            </CardContent>
            
            <CardFooter className="border-t px-6 py-4">
              <div className="text-center w-full text-sm">
                Need help? <Link to="/help" className="text-primary font-medium hover:underline">Contact Support</Link>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        {/* Right side - Visual element */}
        <div className="hidden md:flex md:w-1/2 bg-muted p-6">
          <div className="w-full h-full rounded-lg overflow-hidden">
            <BackgroundBoxesDemo />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
