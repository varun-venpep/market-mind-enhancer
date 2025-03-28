
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, ArrowRight, LucideChrome } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // This is a simulation of a signup process
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Account created!",
        description: "Welcome to MarketMind. Let's get started!",
      });
      navigate("/dashboard");
    }, 1500);
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    
    // This is a simulation of a Google signin process
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Signed in with Google!",
        description: "Welcome to MarketMind. Let's get started!",
      });
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      <div className="container max-w-6xl px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex justify-between items-center py-6">
          <Link to="/" className="flex items-center">
            <span className="self-center text-xl font-bold whitespace-nowrap gradient-text">
              MarketMind
            </span>
          </Link>
          <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-brand-600">
            Already have an account? Sign in
          </Link>
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-2">
                Create your MarketMind account
              </h1>
              <p className="text-lg text-gray-600">
                Start crafting content that ranks higher in AI and traditional search engines
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-brand-600 mt-0.5 mr-2" />
                <div>
                  <h3 className="font-medium text-gray-900">AI-optimized content</h3>
                  <p className="text-gray-600 text-sm">Create content that performs well in both traditional search engines and AI platforms</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-brand-600 mt-0.5 mr-2" />
                <div>
                  <h3 className="font-medium text-gray-900">Comprehensive research tools</h3>
                  <p className="text-gray-600 text-sm">Get deep insights into your competitors, keywords, and content opportunities</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle2 className="h-5 w-5 text-brand-600 mt-0.5 mr-2" />
                <div>
                  <h3 className="font-medium text-gray-900">Free to get started</h3>
                  <p className="text-gray-600 text-sm">Start with our free plan or try our professional plan free for 30 days</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="google">Google</TabsTrigger>
              </TabsList>
              
              <TabsContent value="email" className="space-y-6">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Enter your name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Create a password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <p className="text-xs text-gray-500">Must be at least 8 characters</p>
                  </div>
                  
                  <Button type="submit" className="w-full gradient-button" disabled={loading}>
                    {loading ? "Creating account..." : "Create account"}
                    {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <LucideChrome className="mr-2 h-4 w-4" />
                  Sign up with Google
                </Button>
              </TabsContent>
              
              <TabsContent value="google" className="space-y-6">
                <div className="text-center p-6">
                  <LucideChrome className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Sign up with Google</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Connect your Google account for quick and secure access
                  </p>
                  
                  <Button 
                    className="w-full" 
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                  >
                    <LucideChrome className="mr-2 h-4 w-4" />
                    {loading ? "Connecting..." : "Continue with Google"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-center text-gray-500">
                By signing up, you agree to our{" "}
                <Link to="/terms" className="text-brand-600 hover:underline">Terms of Service</Link> and{" "}
                <Link to="/privacy" className="text-brand-600 hover:underline">Privacy Policy</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
