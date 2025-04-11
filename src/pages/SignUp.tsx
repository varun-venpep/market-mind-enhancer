
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Input,
  Checkbox,
  Typography,
  Spinner
} from "@material-tailwind/react";
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
  const { signUp, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [termsError, setTermsError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  // If the user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'terms' ? checked : value
    });
    
    // Clear errors when user types
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
    setIsGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.error) {
        toast({
          title: "Google Sign In Failed",
          description: result.error.message,
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center items-center min-h-screen p-4 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950"
    >
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader
          variant="gradient"
          color="blue"
          className="mb-4 grid h-20 place-items-center"
        >
          <Typography variant="h3" color="white">
            Join MarketMind
          </Typography>
        </CardHeader>
        <CardBody className="flex flex-col gap-4">
          <Typography variant="paragraph" color="blue-gray" className="text-center">
            Create your account and start optimizing your content strategy
          </Typography>
          
          <Button
            size="lg"
            variant="outlined"
            color="blue-gray"
            className="flex items-center justify-center gap-3 normal-case"
            fullWidth
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
          >
            {isGoogleLoading ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <FaGoogle className="h-4 w-4 text-red-500" />
            )}
            Sign up with Google
          </Button>

          <div className="relative flex py-3">
            <div className="flex-grow border-t my-auto"></div>
            <Typography variant="small" className="mx-4">Or continue with email</Typography>
            <div className="flex-grow border-t my-auto"></div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Input
                type="email"
                name="email"
                label="Email"
                size="lg"
                value={formData.email}
                onChange={handleInputChange}
                error={!!emailError}
              />
              {emailError && (
                <Typography variant="small" color="red" className="mt-1">
                  {emailError}
                </Typography>
              )}
            </div>
            
            <div>
              <Input
                type="password"
                name="password"
                label="Password"
                size="lg"
                value={formData.password}
                onChange={handleInputChange}
                error={!!passwordError}
              />
              {passwordError && (
                <Typography variant="small" color="red" className="mt-1">
                  {passwordError}
                </Typography>
              )}
            </div>
            
            <div>
              <Input
                type="password"
                name="confirmPassword"
                label="Confirm Password"
                size="lg"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                error={!!confirmPasswordError}
              />
              {confirmPasswordError && (
                <Typography variant="small" color="red" className="mt-1">
                  {confirmPasswordError}
                </Typography>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <Checkbox
                name="terms"
                checked={formData.terms}
                onChange={handleInputChange}
                color="blue"
                className="rounded-sm"
              />
              <Typography variant="small" color="blue-gray" className="font-medium">
                I agree to the{" "}
                <Link to="/terms" className="text-blue-500 hover:underline">
                  terms of service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-blue-500 hover:underline">
                  privacy policy
                </Link>
              </Typography>
            </div>
            {termsError && (
              <Typography variant="small" color="red">
                {termsError}
              </Typography>
            )}
            
            <Button
              type="submit"
              className="mt-4 bg-gradient-to-r from-blue-600 to-blue-500"
              fullWidth
              disabled={isLoading || isGoogleLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner className="h-4 w-4" />
                  <span>Processing...</span>
                </div>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </CardBody>
        <CardFooter className="pt-0">
          <Typography variant="small" className="text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 font-medium hover:underline">
              Sign in
            </Link>
          </Typography>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SignUp;
