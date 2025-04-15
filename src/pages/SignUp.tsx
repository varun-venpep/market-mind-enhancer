import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { FaGoogle } from 'react-icons/fa';
import { motion } from "framer-motion";

const signUpSchema = z
  .object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
    terms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const { signUp, signUpWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [termsError, setTermsError] = useState("");
  const [redirectInProgress, setRedirectInProgress] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  useEffect(() => {
    if (user && !redirectInProgress) {
      navigate("/dashboard");
    }
  }, [user, navigate, redirectInProgress]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'terms' ? checked : value
    });
    
    if (name === 'email') setEmailError("");
    if (name === 'password') setPasswordError("");
    if (name === 'confirmPassword') setConfirmPasswordError("");
    if (name === 'terms') setTermsError("");
  };

  const validateForm = () => {
    let isValid = true;
    
    if (!formData.email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setEmailError("Please enter a valid email");
      isValid = false;
    }
    
    if (!formData.password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (formData.password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      isValid = false;
    }
    
    if (!formData.confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    }
    
    if (!formData.terms) {
      setTermsError("You must agree to the terms and conditions");
      isValid = false;
    }
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const result = await signUp(formData.email, formData.password);
      if (result.error) {
        toast({
          title: "Sign Up Failed",
          description: result.error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Sign Up Successful",
          description: "Please check your email to verify your account.",
        });
        navigate("/login");
      }
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message || "An error occurred during sign up",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isGoogleLoading) return;
    
    setIsGoogleLoading(true);
    setRedirectInProgress(true);
    
    try {
      const { error } = await signUpWithGoogle();
      if (error) {
        toast({
          title: "Google Sign Up Failed",
          description: error.message,
          variant: "destructive",
        });
        setRedirectInProgress(false);
      }
    } catch (error: any) {
      toast({
        title: "Google Sign Up Failed",
        description: error.message || "An error occurred during Google sign up",
        variant: "destructive",
      });
      setRedirectInProgress(false);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen p-4 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950"
    >
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="bg-primary text-primary-foreground space-y-1 p-6">
          <CardTitle className="text-2xl font-bold">
            Join MarketMind
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <CardDescription className="text-center">
            Create your account and start optimizing your content strategy
          </CardDescription>
          
          <Button
            size="lg"
            variant="outline"
            className="w-full flex items-center justify-center gap-3"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading || redirectInProgress}
          >
            {isGoogleLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <FaGoogle className="h-4 w-4 text-red-500" />
            )}
            {redirectInProgress ? "Redirecting to Google..." : "Sign up with Google"}
          </Button>

          <div className="relative flex py-3">
            <div className="flex-grow border-t my-auto"></div>
            <span className="mx-4 text-sm text-muted-foreground">Or continue with email</span>
            <div className="flex-grow border-t my-auto"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className={emailError ? "border-red-500" : ""}
              />
              {emailError && (
                <p className="text-sm text-red-500 mt-1">
                  {emailError}
                </p>
              )}
            </div>
            
            <div>
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className={passwordError ? "border-red-500" : ""}
              />
              {passwordError && (
                <p className="text-sm text-red-500 mt-1">
                  {passwordError}
                </p>
              )}
            </div>
            
            <div>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={confirmPasswordError ? "border-red-500" : ""}
              />
              {confirmPasswordError && (
                <p className="text-sm text-red-500 mt-1">
                  {confirmPasswordError}
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Checkbox
                id="terms"
                name="terms"
                checked={formData.terms}
                onCheckedChange={(checked) => {
                  setFormData({
                    ...formData,
                    terms: checked === true
                  });
                  setTermsError("");
                }}
                className={termsError ? "border-red-500" : ""}
              />
              <label htmlFor="terms" className="text-sm">
                I agree to the{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  terms of service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  privacy policy
                </Link>
              </label>
            </div>
            {termsError && (
              <p className="text-sm text-red-500">
                {termsError}
              </p>
            )}
            
            <Button
              type="submit"
              className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-500"
              disabled={isLoading || isGoogleLoading || redirectInProgress}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <div className="text-center w-full text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SignUp;
