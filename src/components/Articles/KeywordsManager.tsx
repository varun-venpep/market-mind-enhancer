
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from 'lucide-react';

interface KeywordsManagerProps {
  keywords: string[];
  onAddKeyword: (keyword: string) => void;
  onRemoveKeyword: (keyword: string) => void;
}

const KeywordsManager = ({ keywords, onAddKeyword, onRemoveKeyword }: KeywordsManagerProps) => {
  const handleKeywordInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      onAddKeyword(input.value);
      input.value = '';
    }
  };

  return (
    <div>
      <Label htmlFor="keywords">Keywords</Label>
      <Input
        type="text"
        id="keywords"
        placeholder="Enter keywords and press Enter"
        onKeyDown={handleKeywordInput}
        className="mb-2"
      />
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword) => (
          <div
            key={keyword}
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full px-3 py-1 text-sm flex items-center"
          >
            {keyword}
            <button
              onClick={() => onRemoveKeyword(keyword)}
              className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KeywordsManager;
