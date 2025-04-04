
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Award, BookOpen, Check, CheckCircle, Clock, Edit, Eye, FileText, HelpCircle, Image, Lightbulb, List, Loader2, RotateCcw, Save, Sparkles, Target, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { generateContent, generateImage } from "@/services/geminiApi";
import { useToast } from "@/components/ui/use-toast";

interface ContentEditorProps {
  briefData: any;
  score: number;
  onScoreChange: (score: number) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

export const ContentEditor = ({
  briefData,
  score,
  onScoreChange,
  isEditing,
  setIsEditing
}: ContentEditorProps) => {
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [blogImage, setBlogImage] = useState("");
  const [appliedSuggestions, setAppliedSuggestions] = useState<number[]>([]);
  const { toast } = useToast();
  
  const recommendedWordCount = briefData.recommendedWordCount;
  const wordCountPercentage = Math.min(
    100,
    (wordCount / recommendedWordCount.min) * 100
  );
  
  // AI suggestions based on content analysis
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  
  useEffect(() => {
    // Initialize with the example content if content is empty
    if (!content) {
      generateInitialContent();
    }
  }, []);
  
  const generateInitialContent = async () => {
    setIsGenerating(true);
    try {
      const initialPrompt = `Write a comprehensive blog post about "${briefData.title}". 
      Focus on these keywords: ${briefData.keywords.join(", ")}.
      Include the following sections:
      ${briefData.outline.map(item => `- ${item.text}`).join("\n")}
      
      Make sure to address these questions:
      ${briefData.questions.map(q => `- ${q}`).join("\n")}
      
      Format the content in markdown with appropriate headings, lists, and paragraphs.
      The content should be informative, engaging, and optimized for both readers and search engines.
      Target word count: ${recommendedWordCount.min}-${recommendedWordCount.max} words.`;
      
      const generatedContent = await generateContent(initialPrompt);
      setContent(generatedContent);
      setOriginalContent(generatedContent);
      const words = generatedContent.split(/\s+/).length;
      setWordCount(words);
      
      // Generate AI suggestions
      generateSuggestions(generatedContent);
      
      // Simulate score change based on content
      const newScore = Math.min(
        100, 
        Math.max(
          60,
          65 + Math.floor(Math.random() * 20)
        )
      );
      onScoreChange(newScore);
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      });
      // Fallback to empty content
      setContent("");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const generateSuggestions = async (contentToAnalyze: string) => {
    try {
      const analysisPrompt = `Analyze this content about "${briefData.title}" and provide 5 specific suggestions for improvement. 
      Format each suggestion as a JSON object with these properties:
      - type: One of these values: "content", "structure", "keyword", "missing", "readability"
      - section: The section this suggestion applies to
      - suggestion: The specific suggestion text
      - severity: "low", "medium", or "high" based on importance
      
      Return ONLY the JSON array of 5 suggestions, nothing else.
      
      Here's the content:
      ${contentToAnalyze.substring(0, 2000)}...`;
      
      const suggestionsResponse = await generateContent(analysisPrompt, { temperature: 0.7 });
      
      // Extract the JSON array from the response
      const jsonString = suggestionsResponse.replace(/```json|```/g, '').trim();
      let parsedSuggestions = [];
      
      try {
        parsedSuggestions = JSON.parse(jsonString);
      } catch (e) {
        // If parsing fails, create some default suggestions
        parsedSuggestions = [
          {
            type: "content",
            section: "Introduction",
            suggestion: "Add more context to better introduce the topic to new readers.",
            severity: "medium"
          },
          {
            type: "keyword",
            section: "Overall",
            suggestion: `Use the keyword "${briefData.keywords[0]}" more naturally throughout the content.`,
            severity: "high"
          },
          {
            type: "structure",
            section: "Main Sections",
            suggestion: "Break up long paragraphs into smaller, more digestible chunks.",
            severity: "medium"
          },
          {
            type: "missing",
            section: "Conclusion",
            suggestion: "Add a stronger call-to-action at the end of the content.",
            severity: "low"
          },
          {
            type: "readability",
            section: "Overall",
            suggestion: "Simplify some technical terms to improve readability for general audience.",
            severity: "medium"
          }
        ];
      }
      
      setAiSuggestions(parsedSuggestions);
    } catch (error) {
      console.error("Error generating suggestions:", error);
      // Set default suggestions if generation fails
      setAiSuggestions([
        {
          type: "content",
          section: "Introduction",
          suggestion: "Add more context to better introduce the topic to new readers.",
          severity: "medium"
        },
        {
          type: "keyword",
          section: "Overall",
          suggestion: `Use the keyword "${briefData.keywords[0]}" more naturally throughout the content.`,
          severity: "high"
        },
        {
          type: "structure",
          section: "Main Sections",
          suggestion: "Break up long paragraphs into smaller, more digestible chunks.",
          severity: "medium"
        },
        {
          type: "missing",
          section: "Conclusion",
          suggestion: "Add a stronger call-to-action at the end of the content.",
          severity: "low"
        },
        {
          type: "readability",
          section: "Overall",
          suggestion: "Simplify some technical terms to improve readability for general audience.",
          severity: "medium"
        }
      ]);
    }
  };
  
  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    const newWordCount = e.target.value.split(/\s+/).length;
    setWordCount(newWordCount);
    
    // Update score based on changes from original
    const contentChangeFactor = 
      Math.abs(e.target.value.length - originalContent.length) / originalContent.length;
    
    const newScore = Math.min(
      100, 
      Math.max(
        60,
        score + (contentChangeFactor > 0.05 ? Math.floor(Math.random() * 6) - 2 : 0)
      )
    );
    onScoreChange(newScore);
  };
  
  const handleApplySuggestion = async (index: number) => {
    if (appliedSuggestions.includes(index)) return;
    
    const suggestion = aiSuggestions[index];
    
    try {
      const improvePrompt = `I have this content about "${briefData.title}". 
      This is the specific suggestion to implement: "${suggestion.suggestion}" in the "${suggestion.section}" section.
      
      Please rewrite or improve ONLY the relevant part of the content to implement this suggestion.
      Return ONLY the improved section, not the entire content.
      
      Here's the current content:
      ${content}`;
      
      const improvedSection = await generateContent(improvePrompt, { temperature: 0.7 });
      
      // Notify user
      toast({
        title: "Suggestion Applied",
        description: `Improved the ${suggestion.section} section based on AI suggestion.`,
      });
      
      // Update score
      const newScore = Math.min(100, score + Math.floor(Math.random() * 5) + 1);
      onScoreChange(newScore);
      
      // Mark suggestion as applied
      setAppliedSuggestions([...appliedSuggestions, index]);
      
      // Update content with improved section
      // This is a simplified implementation; in a real app, you'd want to 
      // more accurately identify and replace only the specific section
      const contentLines = content.split('\n');
      const sectionHeadingRegExp = new RegExp(suggestion.section, 'i');
      
      let sectionStartIndex = -1;
      let sectionEndIndex = -1;
      
      // Find the section to replace
      for (let i = 0; i < contentLines.length; i++) {
        if (sectionHeadingRegExp.test(contentLines[i]) && sectionStartIndex === -1) {
          sectionStartIndex = i;
        } else if (sectionStartIndex !== -1 && 
                  (contentLines[i].startsWith('#') || i === contentLines.length - 1)) {
          sectionEndIndex = i === contentLines.length - 1 ? i + 1 : i;
          break;
        }
      }
      
      // Replace the section if found
      if (sectionStartIndex !== -1) {
        const updatedContent = [
          ...contentLines.slice(0, sectionStartIndex),
          ...improvedSection.split('\n'),
          ...contentLines.slice(sectionEndIndex)
        ].join('\n');
        
        setContent(updatedContent);
        setWordCount(updatedContent.split(/\s+/).length);
      } else {
        // If section heading not found, append the improvement as a note
        setContent(content + '\n\n**Improvement Note:** ' + improvedSection);
        setWordCount((content + '\n\n**Improvement Note:** ' + improvedSection).split(/\s+/).length);
      }
      
    } catch (error) {
      console.error("Error applying suggestion:", error);
      toast({
        title: "Error",
        description: "Failed to apply the suggestion. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    try {
      const imagePrompt = `Create a professional, high-quality featured image for a blog post titled "${briefData.title}". 
      The image should be visually appealing and relevant to the topic of ${briefData.keywords.join(", ")}.
      Make it suitable for a professional business blog.`;
      
      const imageUrl = await generateImage(imagePrompt);
      setBlogImage(imageUrl);
      
      toast({
        title: "Image Generated",
        description: "Blog featured image has been generated successfully.",
      });
      
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };
  
  const handleRegenerate = async () => {
    setIsGenerating(true);
    try {
      const regeneratePrompt = `Rewrite this blog post about "${briefData.title}" to make it more engaging and SEO-optimized.
      Keep the same structure and key points, but improve the language, flow, and presentation.
      Focus on these keywords: ${briefData.keywords.join(", ")}.
      
      Here's the current content:
      ${content}`;
      
      const regeneratedContent = await generateContent(regeneratePrompt);
      setContent(regeneratedContent);
      setWordCount(regeneratedContent.split(/\s+/).length);
      
      // Generate new suggestions
      generateSuggestions(regeneratedContent);
      
      // Update score
      const newScore = Math.min(100, score + Math.floor(Math.random() * 10) - 3);
      onScoreChange(newScore);
      
      toast({
        title: "Content Regenerated",
        description: "Your content has been refreshed with a new version.",
      });
    } catch (error) {
      console.error("Error regenerating content:", error);
      toast({
        title: "Error",
        description: "Failed to regenerate content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating && !content) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <h3 className="text-lg font-medium mb-2">Generating Content...</h3>
        <p className="text-center text-muted-foreground max-w-md">
          Our AI is creating high-quality content based on your brief.
          This may take a moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium">Content Editor</h2>
          <Badge variant={isEditing ? "default" : "outline"}>
            {isEditing ? "Editing" : "Preview"}
          </Badge>
        </div>
        <div className="flex gap-2">
          {blogImage ? (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(blogImage, '_blank')}
            >
              <Image className="mr-2 h-4 w-4" />
              View Image
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleGenerateImage}
              disabled={isGeneratingImage}
            >
              {isGeneratingImage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Image className="mr-2 h-4 w-4" />
                  Generate Image
                </>
              )}
            </Button>
          )}
          <Button 
            variant={isEditing ? "outline" : "default"}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            {isEditing ? (
              <div className="border-b p-2 bg-muted/30 flex items-center gap-2 overflow-x-auto">
                {["H1", "H2", "H3", "B", "I", "Link", "Image", "List", "Quote"].map((item) => (
                  <Button key={item} variant="ghost" size="sm" className="h-8 px-2">
                    {item}
                  </Button>
                ))}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 px-2 ml-auto"
                  onClick={handleRegenerate}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Sparkles className="h-3 w-3 mr-1" />
                      Regenerate
                    </>
                  )}
                </Button>
              </div>
            ) : null}
            
            <CardContent className={`p-0 ${isEditing ? 'h-[600px]' : 'h-[650px]'} overflow-auto`}>
              {isEditing ? (
                <Textarea
                  value={content}
                  onChange={handleEditorChange}
                  className="w-full h-full border-0 rounded-none focus-visible:ring-0 resize-none font-mono text-sm p-4"
                  placeholder="Start writing your content here..."
                />
              ) : (
                <div className="prose max-w-full p-6 markdown-content">
                  {blogImage && (
                    <div className="mb-6">
                      <img 
                        src={blogImage} 
                        alt={briefData.title} 
                        className="w-full rounded-md border"
                      />
                    </div>
                  )}
                  <div dangerouslySetInnerHTML={{ 
                    __html: content
                      .replace(/# (.*)/g, '<h1>$1</h1>')
                      .replace(/## (.*)/g, '<h2>$1</h2>')
                      .replace(/### (.*)/g, '<h3>$1</h3>')
                      .replace(/\n- (.*)/g, '<ul><li>$1</li></ul>')
                      .replace(/\n/g, '<br />')
                  }} />
                </div>
              )}
            </CardContent>
            
            <CardFooter className="bg-muted/30 border-t">
              <div className="w-full flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {wordCount} words 
                    <span className="text-muted-foreground ml-1">
                      (recommended: {recommendedWordCount.min}-{recommendedWordCount.max})
                    </span>
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Discard
                  </Button>
                  <Button size="sm" className="gradient-button">
                    <Save className="mr-2 h-4 w-4" />
                    Save Draft
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">AI Content Analysis</CardTitle>
              <CardDescription>
                Real-time feedback on your content
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-3">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Content Score</span>
                    <span className="text-sm font-medium">{score}/100</span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Word Count</span>
                    <span className="text-sm font-medium">{wordCount}</span>
                  </div>
                  <Progress value={wordCountPercentage} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Keyword Usage</span>
                    <span className="text-sm font-medium">{72 + Math.floor(score/10)}/100</span>
                  </div>
                  <Progress value={72 + Math.floor(score/10)} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Topic Coverage</span>
                    <span className="text-sm font-medium">{68 + Math.floor(score/8)}/100</span>
                  </div>
                  <Progress value={68 + Math.floor(score/8)} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center">
                <Sparkles className="mr-2 h-4 w-4 text-brand-500" />
                AI Suggestions
              </CardTitle>
              <CardDescription>
                Recommendations to improve your content
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[280px] overflow-y-auto">
              {aiSuggestions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <Loader2 className="w-6 h-6 text-muted-foreground animate-spin mb-2" />
                  <p className="text-muted-foreground text-sm">Analyzing content...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {aiSuggestions.map((suggestion, index) => (
                    <div key={index} className={`rounded-md border p-3 ${
                      appliedSuggestions.includes(index) 
                        ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
                        : 'bg-muted/10'
                    }`}>
                      <div className="flex items-start gap-2">
                        <div className={`
                          rounded-full p-1 
                          ${suggestion.severity === 'high' ? 'bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400' : 
                            suggestion.severity === 'medium' ? 'bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400' : 
                            'bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400'}
                        `}>
                          {suggestion.severity === 'high' ? (
                            <HelpCircle className="h-3 w-3" />
                          ) : suggestion.severity === 'medium' ? (
                            <Lightbulb className="h-3 w-3" />
                          ) : (
                            <Target className="h-3 w-3" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div className="text-xs font-medium mb-1">
                              {suggestion.section}
                            </div>
                            <Badge variant="outline" className="text-xs font-normal">
                              {suggestion.type}
                            </Badge>
                          </div>
                          <p className="text-sm">{suggestion.suggestion}</p>
                          
                          <div className="flex items-center gap-1 mt-2">
                            {appliedSuggestions.includes(index) ? (
                              <Badge variant="outline" className="bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400 border-green-200 dark:border-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Applied
                              </Badge>
                            ) : (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-7 px-2"
                                  onClick={() => handleApplySuggestion(index)}
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  <span className="text-xs">Apply</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 px-2">
                                  <X className="h-3 w-3 mr-1" />
                                  <span className="text-xs">Dismiss</span>
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

