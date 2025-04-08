
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Sparkles, ChevronRight, Gift } from 'lucide-react';

interface UpgradePromptProps {
  title?: string;
  description?: string;
  features?: string[];
  className?: string;
  compact?: boolean;
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  title = "Premium Features",
  description = "All premium features are currently available for testing",
  features = [
    "Connect Shopify and WordPress stores",
    "Unlimited keyword tracking",
    "Advanced SERP analysis",
    "AI-powered content generation",
    "Bulk SEO optimization"
  ],
  className = "",
  compact = false
}) => {
  const navigate = useNavigate();

  if (compact) {
    return (
      <Card className={`border-blue-200/50 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 hover-card ${className}`}>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Gift className="h-5 w-5 text-blue-500 mr-3" />
            <div>
              <h3 className="font-medium text-sm">{title}</h3>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
          <Button
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
            onClick={() => navigate('/dashboard/integrations')}
          >
            Access Now
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-blue-200/50 overflow-hidden hover-card ${className}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-indigo-600/30 rounded-full transform translate-x-16 -translate-y-16 blur-2xl" />
      
      <CardHeader className="relative">
        <div className="flex items-center mb-2">
          <Sparkles className="h-5 w-5 text-blue-500 mr-2" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="relative">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className="h-5 w-5 text-blue-500 mr-2 flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter className="relative">
        <Button 
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all group"
          onClick={() => navigate('/dashboard/integrations')}
        >
          Access Features
          <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UpgradePrompt;
