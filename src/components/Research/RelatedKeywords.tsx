
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, ArrowUpRight, Star, BarChart, DollarSign, Filter, Info } from "lucide-react";
import { useState } from "react";
import { Keyword } from "@/types";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

interface RelatedKeywordsProps {
  mainKeyword: string;
  keywords?: Keyword[]; // Add keywords prop to interface
}

export const RelatedKeywords = ({ mainKeyword, keywords }: RelatedKeywordsProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Use provided keywords or fall back to mock data
  const mockKeywords = [
    {
      id: "mock-1",
      keyword: "AI search engine optimization",
      searchVolume: 2800,
      difficulty: 56,
      cpc: 3.42,
      aiPotential: 92
    },
    {
      id: "mock-2",
      keyword: "How to optimize for AI search",
      searchVolume: 1900,
      difficulty: 42,
      cpc: 4.10,
      aiPotential: 88
    },
    {
      id: "mock-3",
      keyword: "AI content optimization tools",
      searchVolume: 3400,
      difficulty: 61,
      cpc: 5.25,
      aiPotential: 85
    },
    {
      id: "mock-4",
      keyword: "AI SEO best practices",
      searchVolume: 2200,
      difficulty: 52,
      cpc: 4.75,
      aiPotential: 90
    },
    {
      id: "mock-5",
      keyword: "Content optimization for chatbots",
      searchVolume: 1500,
      difficulty: 47,
      cpc: 3.80,
      aiPotential: 87
    },
    {
      id: "mock-6",
      keyword: "AI search vs traditional search",
      searchVolume: 2600,
      difficulty: 45,
      cpc: 2.90,
      aiPotential: 89
    },
    {
      id: "mock-7",
      keyword: "AI search ranking factors",
      searchVolume: 3100,
      difficulty: 59,
      cpc: 4.50,
      aiPotential: 93
    },
    {
      id: "mock-8",
      keyword: "Optimizing content for Claude AI",
      searchVolume: 1800,
      difficulty: 38,
      cpc: 3.20,
      aiPotential: 95
    }
  ];

  const keywordsToUse = keywords && keywords.length > 0 ? keywords : mockKeywords;
  
  const filteredKeywords = keywordsToUse.filter(k => 
    k.keyword.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getDifficultyLabel = (score: number) => {
    if (score < 40) return { label: "Easy", color: "bg-green-500" };
    if (score < 60) return { label: "Medium", color: "bg-amber-500" };
    return { label: "Hard", color: "bg-red-500" };
  };

  const getAIPotentialLabel = (score: number) => {
    if (score < 75) return { label: "Low", color: "bg-muted" };
    if (score < 85) return { label: "Medium", color: "bg-blue-500" };
    return { label: "High", color: "bg-green-500" };
  };

  // Helper to safely format CPC values
  const formatCPC = (cpc: any): string => {
    if (typeof cpc === 'number') {
      return cpc.toFixed(2);
    } else if (typeof cpc === 'string' && !isNaN(parseFloat(cpc))) {
      return parseFloat(cpc).toFixed(2);
    }
    return "0.00"; // Default fallback
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="mr-2 h-5 w-5 text-muted-foreground" />
            Related Keywords for "{mainKeyword}"
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter keywords..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Keyword</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    <div className="flex items-center">
                      <BarChart className="mr-1 h-4 w-4" />
                      Volume
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <div className="flex items-center">
                      <Star className="mr-1 h-4 w-4" />
                      Difficulty
                    </div>
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    <div className="flex items-center">
                      <DollarSign className="mr-1 h-4 w-4" />
                      CPC
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      <ArrowUpRight className="mr-1 h-4 w-4" />
                      AI Potential
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKeywords.length > 0 ? (
                  filteredKeywords.map((kw, i) => {
                    const difficulty = getDifficultyLabel(kw.difficulty);
                    const aiPotential = getAIPotentialLabel(kw.aiPotential);
                    
                    return (
                      <motion.tr
                        key={kw.id || i}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                        className="hover:bg-muted/50 cursor-pointer"
                      >
                        <TableCell className="font-medium">{kw.keyword}</TableCell>
                        <TableCell className="hidden sm:table-cell">{kw.searchVolume.toLocaleString()}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge className={`${difficulty.color} hover:${difficulty.color}`}>
                            {difficulty.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">${formatCPC(kw.cpc)}</TableCell>
                        <TableCell>
                          <Badge className={`${aiPotential.color} hover:${aiPotential.color}`}>
                            {aiPotential.label}
                          </Badge>
                        </TableCell>
                      </motion.tr>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      No keywords found matching your filter
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
