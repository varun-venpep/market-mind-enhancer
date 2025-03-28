
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Award, BookOpen, Check, CheckCircle, Clock, Edit, Eye, FileText, HelpCircle, Lightbulb, List, RotateCcw, Save, Sparkles, Target, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const [content, setContent] = useState(
    `# Optimizing Content for AI Search Engines in 2023

In today's rapidly evolving digital landscape, AI search engines are transforming how users discover and interact with content online. This guide explores how content creators can optimize their work specifically for AI-powered search platforms.

## Understanding How AI Search Engines Work

AI search engines differ fundamentally from traditional search engines in how they process, understand, and rank content. While conventional search relies heavily on keywords and backlinks, AI search prioritizes comprehensive, accurate information that directly addresses user queries.

### Key Differences Between Traditional and AI Search

Traditional search engines like Google use algorithms that consider hundreds of ranking factors including keywords, backlinks, site structure, and user behavior metrics. In contrast, AI search engines leverage natural language processing (NLP) and machine learning to evaluate content based on:

- Semantic understanding rather than keyword matching
- Comprehensive coverage of topics
- Direct answers to user questions
- Content accuracy and factual correctness
- Logical structure and content flow

### How AI Evaluates Content Quality and Relevance

AI-powered search engines can interpret content much like a human reader would. They assess whether the content provides valuable information on a topic, addresses potential questions, and presents information in a coherent, accessible manner.

These systems can recognize when content genuinely explores a subject in depth versus simply incorporating keywords without substantive information.

## Essential Optimization Strategies for AI Search

To rank well in AI search environments, content creators need to shift their focus from traditional SEO tactics to strategies that emphasize quality, depth, and user value.

### Creating Comprehensive, In-depth Content

AI search engines reward content that thoroughly covers a topic from multiple angles. To optimize for these platforms:

- Address the primary topic completely
- Cover related subtopics and common questions
- Include factual information with authoritative sources
- Provide context and background when introducing concepts
- Consider different user perspectives and needs

The goal is to create content so thorough that a user wouldn't need to search elsewhere to understand the topic fully.

### Focusing on User Intent and Conversational Queries

Since many AI search interactions happen through conversational interfaces, optimizing for natural language queries is crucial:

- Research common questions in your topic area
- Structure content to directly answer specific questions
- Use conversational headings that match how people ask questions
- Include FAQ sections that address common user concerns
- Consider voice search patterns in your content structure

## Tools and Techniques for AI-First Content Creation

Several specialized tools can help optimize content specifically for AI search engines:

- AI content analysis tools that evaluate topic coverage
- NLP-based keyword research platforms
- Content brief generators focused on AI optimization
- Readability analyzers that assess clarity and structure
- Fact-checking tools to ensure information accuracy

## Measuring Success in AI Search Environments

Unlike traditional search, where ranking position is the primary success metric, AI search success requires different measurement approaches:

- Feature rate (how often your content is featured in AI responses)
- Attribution tracking (when AI engines cite your content)
- Click-through rates from AI search results
- Engagement metrics for users arriving from AI platforms
- Conversion rates from AI search visitors

## Future Trends in AI Search Optimization

The AI search landscape continues to evolve rapidly. Forward-thinking content creators should watch for:

- Multimodal search combining text, images, and audio
- Enhanced personalization in AI search results
- Greater emphasis on E-E-A-T principles in AI ranking
- Integration between traditional and AI search systems
- Emerging standards for AI-optimized content structure`
  );
  
  const [wordCount, setWordCount] = useState(content.split(/\s+/).length);
  const recommendedWordCount = briefData.recommendedWordCount;
  const wordCountPercentage = Math.min(
    100,
    (wordCount / recommendedWordCount.min) * 100
  );
  
  // Mock data for AI suggestions
  const aiSuggestions = [
    {
      type: "content",
      section: "Understanding How AI Search Engines Work",
      suggestion: "Add examples of leading AI search engines like Perplexity, Claude, and ChatGPT to provide specific context for readers.",
      severity: "medium"
    },
    {
      type: "content",
      section: "Essential Optimization Strategies",
      suggestion: "Include a brief case study or success story showing real results from AI optimization.",
      severity: "low"
    },
    {
      type: "structure",
      section: "Tools and Techniques",
      suggestion: "This section needs more specific tool recommendations with brief descriptions of how each works.",
      severity: "high"
    },
    {
      type: "keyword",
      section: "Overall",
      suggestion: "The term 'AI search optimization' could be used 2-3 more times throughout the content for better visibility.",
      severity: "medium"
    },
    {
      type: "missing",
      section: "Future Trends",
      suggestion: "Add a paragraph about the implications for traditional SEO practices as AI search grows in prominence.",
      severity: "medium"
    }
  ];

  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setWordCount(e.target.value.split(/\s+/).length);
    
    // Simulate score changes based on content length
    const newScore = Math.min(
      100, 
      Math.max(
        60,
        score + Math.floor(Math.random() * 6) - 2
      )
    );
    onScoreChange(newScore);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium">Content Editor</h2>
          <Badge variant={isEditing ? "default" : "outline"}>
            {isEditing ? "Editing" : "Preview"}
          </Badge>
        </div>
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
              </div>
            ) : null}
            
            <CardContent className={`p-0 ${isEditing ? 'h-[600px]' : 'h-[650px]'} overflow-auto`}>
              {isEditing ? (
                <Textarea
                  value={content}
                  onChange={handleEditorChange}
                  className="w-full h-full border-0 rounded-none focus-visible:ring-0 resize-none font-mono text-sm p-4"
                />
              ) : (
                <div className="prose max-w-full p-6 markdown-content">
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
                    <span className="text-sm font-medium">84/100</span>
                  </div>
                  <Progress value={84} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">Topic Coverage</span>
                    <span className="text-sm font-medium">78/100</span>
                  </div>
                  <Progress value={78} className="h-2" />
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
              <div className="space-y-3">
                {aiSuggestions.map((suggestion, index) => (
                  <div key={index} className="rounded-md border p-3 bg-muted/10">
                    <div className="flex items-start gap-2">
                      <div className={`
                        rounded-full p-1 
                        ${suggestion.severity === 'high' ? 'bg-red-100 text-red-600' : 
                          suggestion.severity === 'medium' ? 'bg-amber-100 text-amber-600' : 
                          'bg-green-100 text-green-600'}
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
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            <Check className="h-3 w-3 mr-1" />
                            <span className="text-xs">Apply</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 px-2">
                            <X className="h-3 w-3 mr-1" />
                            <span className="text-xs">Dismiss</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
