
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, LucideChrome } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // This is a simulation of a login process
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Logged in successfully!",
        description: "Welcome back to MarketMind.",
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
        description: "Welcome back to MarketMind.",
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
          <Link to="/signup" className="text-sm font-medium text-gray-600 hover:text-brand-600">
            Don't have an account? Sign up
          </Link>
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-2">
              Welcome back
            </h1>
            <p className="text-lg text-gray-600">
              Log in to access your MarketMind dashboard
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <Tabs defaultValue="email" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="google">Google</TabsTrigger>
              </TabsList>
              
              <TabsContent value="email" className="space-y-6">
                <form onSubmit={handleLogin} className="space-y-4">
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
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password">Password</Label>
                      <Link to="/forgot-password" className="text-xs text-brand-600 hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Enter your password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full gradient-button" disabled={loading}>
                    {loading ? "Logging in..." : "Sign in"}
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
                  Sign in with Google
                </Button>
              </TabsContent>
              
              <TabsContent value="google" className="space-y-6">
                <div className="text-center p-6">
                  <LucideChrome className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Sign in with Google</h3>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
