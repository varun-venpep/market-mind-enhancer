
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, SortAsc, SortDesc, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Keyword {
  id: string;
  keyword: string;
  searchVolume: number;
  difficulty: number;
  cpc: number | string;
  aiPotential: number;
}

interface RelatedKeywordsProps {
  mainKeyword: string;
  keywords: Keyword[];
}

export function RelatedKeywords({ mainKeyword, keywords = [] }: RelatedKeywordsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Keyword>("searchVolume");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Ensure keywords array is valid and normalize data types
  const normalizedKeywords: Keyword[] = Array.isArray(keywords) ? keywords.map(kw => ({
    id: kw.id || `kw-${Math.random().toString(36).substr(2, 9)}`,
    keyword: kw.keyword || "",
    searchVolume: typeof kw.searchVolume === 'number' ? kw.searchVolume : 0,
    difficulty: typeof kw.difficulty === 'number' ? kw.difficulty : 0,
    cpc: typeof kw.cpc === 'number' ? kw.cpc : parseFloat(String(kw.cpc || 0)),
    aiPotential: typeof kw.aiPotential === 'number' ? kw.aiPotential : 0
  })) : [];
  
  const filteredKeywords = normalizedKeywords.filter(
    (kw) => kw.keyword.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedKeywords = [...filteredKeywords].sort((a, b) => {
    if (sortField === "keyword") {
      return sortDirection === "asc"
        ? a.keyword.localeCompare(b.keyword)
        : b.keyword.localeCompare(a.keyword);
    }
    
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const handleSort = (field: keyof Keyword) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Render difficulty badge with appropriate color
  const renderDifficultyBadge = (difficulty: number) => {
    let color = "";
    if (difficulty < 30) color = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    else if (difficulty < 60) color = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    else color = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    
    return <Badge className={`${color} font-medium`}>{difficulty}</Badge>;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" />
          Related Keywords for "{mainKeyword}"
        </CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter keywords..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {sortedKeywords.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={() => handleSort("keyword")} className="cursor-pointer hover:bg-muted/30">
                    <div className="flex items-center gap-1">
                      Keyword
                      {sortField === "keyword" && (
                        sortDirection === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort("searchVolume")} className="cursor-pointer hover:bg-muted/30 text-right">
                    <div className="flex items-center justify-end gap-1">
                      Search Volume
                      {sortField === "searchVolume" && (
                        sortDirection === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort("difficulty")} className="cursor-pointer hover:bg-muted/30 text-center">
                    <div className="flex items-center justify-center gap-1">
                      Difficulty
                      {sortField === "difficulty" && (
                        sortDirection === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort("cpc")} className="cursor-pointer hover:bg-muted/30 text-right">
                    <div className="flex items-center justify-end gap-1">
                      CPC ($)
                      {sortField === "cpc" && (
                        sortDirection === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead onClick={() => handleSort("aiPotential")} className="cursor-pointer hover:bg-muted/30 text-right">
                    <div className="flex items-center justify-end gap-1">
                      AI Potential
                      {sortField === "aiPotential" && (
                        sortDirection === "asc" ? <SortAsc className="h-3 w-3" /> : <SortDesc className="h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedKeywords.map((kw) => (
                  <TableRow key={kw.id}>
                    <TableCell className="font-medium">{kw.keyword}</TableCell>
                    <TableCell className="text-right">{kw.searchVolume.toLocaleString()}</TableCell>
                    <TableCell className="text-center">{renderDifficultyBadge(kw.difficulty)}</TableCell>
                    <TableCell className="text-right">
                      ${typeof kw.cpc === 'number' ? kw.cpc.toFixed(2) : parseFloat(String(kw.cpc)).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge 
                        className="bg-primary/20 text-primary hover:bg-primary/30"
                      >
                        {kw.aiPotential}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">Analyze</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            {keywords.length === 0 ? 
              "No keyword data available. Try running a search first." : 
              "No keywords match your filter. Try another search term."}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
