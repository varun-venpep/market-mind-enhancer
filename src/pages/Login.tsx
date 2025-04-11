
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Input,
  Typography,
  Spinner
} from "@material-tailwind/react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import AuthLayout from "@/components/Auth/AuthLayout";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { login, signInWithGoogle, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // If the user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (mode === 'login') {
        await login(email, password);
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in"
        });
      } else {
        await signUp(email, password);
        toast({
          title: "Account created",
          description: "Your account has been created successfully"
        });
      }
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication Failed",
        description: error.message || "Please check your credentials and try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // For demo purposes to simplify testing
  const handleDemoLogin = async () => {
    setIsLoading(true);
    
    try {
      await login('demo@example.com', 'demo12345');
      toast({
        title: "Demo Login",
        description: "Logged in with demo account"
      });
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Demo login error:', error);
      toast({
        title: "Demo Login Failed",
        description: "Please try again or use the regular login form",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast({
          title: "Google Sign In Failed",
          description: error.message || "Please check your internet connection and try again",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Google Sign In Failed",
        description: error.message || "An error occurred during Google sign in",
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader
          variant="gradient"
          color="blue"
          className="mb-4 grid h-20 place-items-center"
        >
          <Typography variant="h3" color="white">
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </Typography>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardBody className="flex flex-col gap-4">
            <Typography variant="paragraph" color="blue-gray" className="mb-2 font-medium">
              {mode === 'login' 
                ? 'Enter your credentials to access your account' 
                : 'Fill in your details to create a new account'}
            </Typography>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-blue-gray-300" />
              </div>
              <Input
                type="email"
                label="Email"
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                containerProps={{ className: "min-w-0" }}
                required
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-blue-gray-300" />
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                label="Password"
                size="lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                containerProps={{ className: "min-w-0" }}
                required
                icon={
                  <div 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </div>
                }
              />
            </div>
            {mode === 'login' && (
              <Typography
                as="a"
                href="/reset-password"
                variant="small"
                color="blue"
                className="text-right font-medium"
              >
                Forgot password?
              </Typography>
            )}
          </CardBody>
          <CardFooter className="pt-0 flex flex-col gap-4">
            <Button 
              type="submit" 
              fullWidth
              disabled={isLoading}
              className="flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Spinner className="h-4 w-4" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In' : 'Sign Up'}</span>
                </>
              )}
            </Button>
            
            <Button 
              variant="outlined"
              fullWidth
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              Quick Demo Access
            </Button>
            
            <Button
              variant="outlined"
              color="blue-gray"
              fullWidth
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isLoading}
              className="flex items-center justify-center gap-2"
            >
              {isGoogleLoading ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  <path d="M1 1h22v22H1z" fill="none"/>
                </svg>
              )}
              <span>Sign in with Google</span>
            </Button>
            
            <Typography variant="small" className="text-center mt-2">
              {mode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <Typography
                    as="span"
                    variant="small"
                    color="blue"
                    className="font-medium cursor-pointer"
                    onClick={() => setMode('signup')}
                  >
                    Sign up
                  </Typography>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <Typography
                    as="span"
                    variant="small"
                    color="blue"
                    className="font-medium cursor-pointer"
                    onClick={() => setMode('login')}
                  >
                    Sign in
                  </Typography>
                </>
              )}
            </Typography>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
