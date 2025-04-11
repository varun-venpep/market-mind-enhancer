
import React, { useState } from 'react';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Search, ArrowRight, Loader2 } from "lucide-react";
import { Keyword } from '@/types';
import KeywordSkeletonLoader from '@/components/Research/KeywordSkeletonLoader';
import KeywordAnalysisResults from '@/components/Research/KeywordAnalysisResults';

const RelatedKeywords = () => {
  const [keyword, setKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [relatedKeywords, setRelatedKeywords] = useState<Keyword[]>([]);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) {
      toast({
        title: "Keyword required",
        description: "Please enter a keyword to search",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    // Simulate API call
    setTimeout(() => {
      const mockKeywords: Keyword[] = [
        {
          id: '1',
          keyword: `${keyword} guide`,
          searchVolume: 5800,
          difficulty: 65,
          cpc: 2.45,
          aiPotential: 87
        },
        {
          id: '2',
          keyword: `best ${keyword}`,
          searchVolume: 7200,
          difficulty: 72,
          cpc: 3.10,
          aiPotential: 92
        },
        {
          id: '3',
          keyword: `how to use ${keyword}`,
          searchVolume: 4300,
          difficulty: 45,
          cpc: 1.95,
          aiPotential: 95
        },
        {
          id: '4',
          keyword: `${keyword} tips`,
          searchVolume: 3100,
          difficulty: 38,
          cpc: 1.75,
          aiPotential: 89
        },
        {
          id: '5',
          keyword: `${keyword} for beginners`,
          searchVolume: 6500,
          difficulty: 58,
          cpc: 2.85,
          aiPotential: 97
        }
      ];
      
      setRelatedKeywords(mockKeywords);
      setIsSearching(false);
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold gradient-text">Related Keywords</h1>
            <p className="text-muted-foreground mt-1">
              Discover related keywords and their search volumes
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Keyword Explorer</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter a keyword..."
                    className="pl-9"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="gradient-button" disabled={isSearching}>
                  {isSearching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      Search
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {isSearching ? (
            <KeywordSkeletonLoader />
          ) : hasSearched ? (
            <KeywordAnalysisResults keywords={relatedKeywords} mainKeyword={keyword} />
          ) : (
            <Card className="p-10 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Start exploring keywords</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Enter a keyword in the search box above to discover related keywords, search volumes, and content opportunities.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default RelatedKeywords;
