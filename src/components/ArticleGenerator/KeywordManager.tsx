
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles } from "lucide-react";

interface KeywordManagerProps {
  keywords: string;
  setKeywords: (keywords: string) => void;
  handleKeywordInput: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  keywordSuggestions: string[];
  addKeyword: (keyword: string) => void;
  isLoadingSuggestions: boolean;
  getSuggestions: () => void;
}

const KeywordManager: React.FC<KeywordManagerProps> = ({
  keywords,
  setKeywords,
  handleKeywordInput,
  keywordSuggestions,
  addKeyword,
  isLoadingSuggestions,
  getSuggestions
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label htmlFor="keywords">Target Keywords</Label>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 text-xs"
          onClick={getSuggestions}
          disabled={isLoadingSuggestions}
        >
          {isLoadingSuggestions ? 
            <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : 
            <Sparkles className="h-3 w-3 mr-1" />
          }
          Get suggestions
        </Button>
      </div>
      <Input 
        id="keywords" 
        placeholder="e.g., seo, e-commerce, shopify" 
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        onKeyDown={handleKeywordInput}
      />
      
      {keywordSuggestions.length > 0 && (
        <div className="mt-2">
          <Label className="text-xs">Suggestions:</Label>
          <div className="flex flex-wrap gap-1 mt-1">
            {keywordSuggestions.map((kw, i) => (
              <Button 
                key={i} 
                variant="outline" 
                size="sm" 
                className="h-6 text-xs py-0 px-2"
                onClick={() => addKeyword(kw)}
              >
                + {kw}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordManager;
