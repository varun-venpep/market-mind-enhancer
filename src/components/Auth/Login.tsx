
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { 
  Card, 
  CardBody, 
  CardFooter, 
  CardHeader,
  Typography,
  Button,
  Input,
  Spinner
} from "@material-tailwind/react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<'login' | 'signup'>('login');

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

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Card 
        className="w-full max-w-md shadow-xl"
        placeholder={null}
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
      >
        <CardHeader
          variant="gradient"
          color="blue"
          className="mb-4 grid h-20 place-items-center"
          placeholder={null}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        >
          <Typography 
            variant="h3" 
            color="white"
            placeholder={null}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
          </Typography>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardBody 
            className="flex flex-col gap-4"
            placeholder={null}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            <Typography 
              variant="paragraph" 
              color="blue-gray" 
              className="mb-2 font-medium"
              placeholder={null}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
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
                crossOrigin={undefined}
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
                shrink={false}
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
                crossOrigin={undefined}
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
                shrink={false}
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
                placeholder={null}
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
              >
                Forgot password?
              </Typography>
            )}
          </CardBody>
          <CardFooter 
            className="pt-0 flex flex-col gap-4"
            placeholder={null}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            <Button 
              type="submit" 
              fullWidth
              disabled={isLoading}
              className="flex items-center justify-center gap-2"
              placeholder={null}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              {isLoading ? (
                <>
                  <Spinner 
                    className="h-4 w-4" 
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In' : 'Sign Up'}</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
            
            <Button 
              variant="outlined"
              fullWidth
              onClick={handleDemoLogin}
              disabled={isLoading}
              placeholder={null}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              Quick Demo Access
            </Button>
            
            <Typography 
              variant="small" 
              className="text-center mt-2"
              placeholder={null}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              {mode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <Typography
                    as="span"
                    variant="small"
                    color="blue"
                    className="font-medium cursor-pointer"
                    onClick={() => setMode('signup')}
                    placeholder={null}
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
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
                    placeholder={null}
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
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
}
