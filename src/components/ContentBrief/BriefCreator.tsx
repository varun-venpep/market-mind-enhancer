import React, { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, X, FileText, Target, List, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { generateBriefContent } from "@/services/briefService";
import { ContentBrief } from "@/types";

const briefFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  keywords: z.string().min(1, { message: "Enter at least one keyword" }),
  targetAudience: z.string().optional(),
  notes: z.string().optional(),
});

type BriefFormValues = z.infer<typeof briefFormSchema>;

export function BriefCreator() {
  const [isCreating, setIsCreating] = useState(false);
  const [keywordList, setKeywordList] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [briefData, setBriefData] = useState<any>(null);
  
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<BriefFormValues>({
    resolver: zodResolver(briefFormSchema),
    defaultValues: {
      title: "",
      keywords: "",
      targetAudience: "",
      notes: ""
    }
  });
  
  const keywordsField = watch("keywords");
  
  const addKeyword = () => {
    if (currentKeyword.trim() && !keywordList.includes(currentKeyword.trim())) {
      const newKeywords = [...keywordList, currentKeyword.trim()];
      setKeywordList(newKeywords);
      setValue("keywords", newKeywords.join(", "));
      setCurrentKeyword("");
    }
  };
  
  const removeKeyword = (keyword: string) => {
    const newKeywords = keywordList.filter(k => k !== keyword);
    setKeywordList(newKeywords);
    setValue("keywords", newKeywords.join(", "));
  };
  
  const handleKeywordKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addKeyword();
    }
  };
  
  React.useEffect(() => {
    if (keywordsField && keywordsField !== keywordList.join(", ")) {
      const newList = keywordsField.split(/,\s*/).filter(k => k.trim());
      setKeywordList(newList);
    }
  }, [keywordsField]);
  
  const onSubmit = async (data: BriefFormValues) => {
    setIsCreating(true);
    try {
      const keywordsArray = data.keywords.split(/,\s*/).filter(k => k.trim());
      
      const briefForGeneration: ContentBrief = {
        id: crypto.randomUUID(),
        title: data.title,
        status: 'draft',
        keywords: keywordsArray,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        targetAudience: data.targetAudience || undefined,
        notes: data.notes || undefined
      };
      
      const briefContent = await generateBriefContent(briefForGeneration);
      
      setBriefData(briefContent);
      toast.success("Content brief created successfully!");
    } catch (error) {
      console.error("Error creating content brief:", error);
      toast.error("Failed to create content brief. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Content Brief</CardTitle>
          <CardDescription>
            Enter the details for your content brief to generate an outline and content recommendations
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Content Title</Label>
              <Input 
                id="title" 
                placeholder="E.g., 10 SEO Strategies for E-commerce Websites" 
                {...register("title")}
              />
              {errors.title && (
                <p className="text-destructive text-sm">{errors.title.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="keywords">Target Keywords</Label>
              <div className="flex">
                <Input
                  id="keywordInput"
                  placeholder="Enter keywords and press Enter"
                  value={currentKeyword}
                  onChange={(e) => setCurrentKeyword(e.target.value)}
                  onKeyPress={handleKeywordKeyPress}
                  className="rounded-r-none"
                />
                <Button 
                  type="button" 
                  onClick={addKeyword}
                  className="rounded-l-none"
                  disabled={!currentKeyword.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {keywordList.map((keyword, index) => (
                  <Badge key={index} className="pl-2 pr-1 py-1 flex items-center gap-1">
                    {keyword}
                    <button 
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              
              <Input
                id="keywords"
                type="hidden"
                {...register("keywords")}
              />
              {errors.keywords && (
                <p className="text-destructive text-sm">{errors.keywords.message}</p>
              )}
              <p className="text-muted-foreground text-xs">
                Enter keywords separated by commas or press Enter after each keyword
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience (Optional)</Label>
              <Input
                id="targetAudience"
                placeholder="E.g., Small business owners, Marketing professionals"
                {...register("targetAudience")}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any specific points you want to include, tone of voice, etc."
                rows={3}
                {...register("notes")}
              />
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button 
              type="submit" 
              className="w-full"
              disabled={isCreating}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Brief...
                </>
              ) : (
                <>
                  Generate Content Brief
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Brief Results</CardTitle>
          <CardDescription>
            Your content brief will appear here after generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isCreating ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Generating content brief...</p>
              <p className="text-xs text-muted-foreground mt-1">
                Analyzing keywords and creating outline
              </p>
            </div>
          ) : briefData ? (
            <div className="space-y-6">
              <div className="bg-primary/5 rounded-lg p-4 space-y-3">
                <h3 className="font-medium flex items-center">
                  <Target className="h-4 w-4 mr-2 text-primary" />
                  Content Outline
                </h3>
                <ul className="space-y-2">
                  {briefData.outline.map((section: any, index: number) => (
                    <li key={index} className="flex">
                      <div className="bg-primary/10 text-primary rounded-full h-6 w-6 flex items-center justify-center text-sm font-medium mr-2 shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{section.text}</p>
                        <p className="text-sm text-muted-foreground">{section.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-primary/5 rounded-lg p-4 space-y-3">
                <h3 className="font-medium flex items-center">
                  <List className="h-4 w-4 mr-2 text-primary" />
                  Key Questions to Answer
                </h3>
                <ul className="space-y-1.5">
                  {briefData.questions.map((question: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-4 w-4 mr-2 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm">{question}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="bg-primary/5 rounded-lg p-4 flex-1 min-w-[150px]">
                  <p className="text-sm text-muted-foreground">Recommended Length</p>
                  <p className="text-xl font-semibold">
                    {briefData.recommendedWordCount.min} - {briefData.recommendedWordCount.max} words
                  </p>
                </div>
                <div className="bg-primary/5 rounded-lg p-4 flex-1 min-w-[150px]">
                  <p className="text-sm text-muted-foreground">Content Score</p>
                  <p className="text-xl font-semibold flex items-center">
                    <Badge className="mr-2" variant={briefData.contentScore > 80 ? "default" : "secondary"}>
                      {briefData.contentScore}/100
                    </Badge>
                    {briefData.contentScore > 80 ? "Good" : "Average"}
                  </p>
                </div>
              </div>
              
              <Button variant="outline" className="w-full flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Export Brief as PDF
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <FileText className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">No brief generated yet</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                Fill out the form on the left and click "Generate Content Brief" to create your content outline
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
