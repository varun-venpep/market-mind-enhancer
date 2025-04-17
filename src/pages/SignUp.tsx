
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
import { useToast } from "@/components/ui/use-toast";
import { 
  SignUp, 
  useSignUp, 
  useUser 
} from "@clerk/clerk-react";
import { BackgroundBoxesDemo } from "@/components/ui/background-boxes";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SignUpPage = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [redirectInProgress, setRedirectInProgress] = useState(false);

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
                Join MarketMind
              </CardTitle>
              <CardDescription className="text-primary-foreground/90">
                Create your account to get started
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6">
              <Tabs defaultValue="signup" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="signup">
                  <SignUp 
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "w-full shadow-none p-0",
                        header: "hidden",
                        footer: "hidden"
                      }
                    }}
                    redirectUrl="/dashboard"
                    signInUrl="/login"
                    afterSignUpUrl="/dashboard"
                  />
                </TabsContent>
                <TabsContent value="signin">
                  <div className="text-center py-4">
                    <p className="mb-4">Already have an account?</p>
                    <Button 
                      variant="default" 
                      onClick={() => navigate('/login')}
                      className="w-full"
                    >
                      Go to Sign In
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
            
            <CardFooter className="border-t px-6 py-4">
              <div className="text-center w-full text-sm">
                By signing up, you agree to our{" "}
                <Link to="/terms" className="text-primary font-medium hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary font-medium hover:underline">
                  Privacy Policy
                </Link>
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

export default SignUpPage;
