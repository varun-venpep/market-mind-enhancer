
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { Sparkles, Lock, ChevronRight } from 'lucide-react';

interface UpgradePromptProps {
  title?: string;
  description?: string;
  features?: string[];
  className?: string;
  compact?: boolean;
}

const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  title = "Upgrade to Pro",
  description = "Unlock premium features to maximize your SEO performance",
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
      <Card className={`border-brand-200/50 bg-gradient-to-br from-brand-50 to-blue-50 dark:from-brand-950/40 dark:to-blue-950/40 ${className}`}>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 text-brand-500 mr-3" />
            <div>
              <h3 className="font-medium text-sm">{title}</h3>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
          <Button
            size="sm"
            className="gradient-button"
            onClick={() => navigate('/pricing')}
          >
            Upgrade
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-brand-200/50 overflow-hidden ${className}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-500/20 to-brand-600/30 rounded-full transform translate-x-16 -translate-y-16 blur-2xl" />
      
      <CardHeader className="relative">
        <div className="flex items-center mb-2">
          <Sparkles className="h-5 w-5 text-brand-500 mr-2" />
          <CardTitle>{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="relative">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Lock className="h-4 w-4 text-brand-500 mr-2 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter className="relative">
        <Button 
          className="w-full gradient-button group"
          onClick={() => navigate('/pricing')}
        >
          View Pricing
          <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UpgradePrompt;
