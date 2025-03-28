
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, BookOpen, Check, HelpCircle, Lightbulb, Target, Zap } from "lucide-react";

export const OptimizationTips = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-muted-foreground" />
          Optimization Tips
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ai">
          <TabsList className="w-full md:w-auto justify-start mb-4">
            <TabsTrigger value="ai">
              <Zap className="h-4 w-4 mr-2" />
              AI Search
            </TabsTrigger>
            <TabsTrigger value="traditional">
              <Target className="h-4 w-4 mr-2" />
              Traditional SEO
            </TabsTrigger>
            <TabsTrigger value="content">
              <BookOpen className="h-4 w-4 mr-2" />
              Content Structure
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ai">
            <div className="space-y-4">
              <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-brand-100 p-2">
                    <Lightbulb className="h-5 w-5 text-brand-700" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium mb-1">AI Search Optimization Focus</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      AI search engines like Claude, ChatGPT, and Perplexity prioritize comprehensive, well-structured content that thoroughly answers user queries. Focus on depth, clarity, and factual accuracy.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-brand-100 text-brand-800 hover:bg-brand-200">
                        User Intent
                      </Badge>
                      <Badge className="bg-brand-100 text-brand-800 hover:bg-brand-200">
                        Comprehensive Coverage
                      </Badge>
                      <Badge className="bg-brand-100 text-brand-800 hover:bg-brand-200">
                        Clear Structure
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    AI Optimization Best Practices
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {[
                      "Answer questions directly and completely",
                      "Use clear, descriptive headings for each section",
                      "Include factual information with sources when possible",
                      "Cover multiple perspectives on the topic",
                      "Use natural, conversational language",
                      "Organize content logically with a clear flow"
                    ].map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="rounded-full bg-green-100 p-1 mt-0.5">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                    Practices to Avoid
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {[
                      "Keyword stuffing and unnatural repetition",
                      "Thin content that lacks depth on the topic",
                      "Vague or misleading information",
                      "Focusing on word count over content quality",
                      "Ignoring common user questions about the topic",
                      "Large blocks of text without proper structure"
                    ].map((tip, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="rounded-full bg-red-100 p-1 mt-0.5">
                          <AlertCircle className="h-3 w-3 text-red-600" />
                        </div>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium mb-2">Key Questions to Answer</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    "How do AI search engines differ from traditional search?",
                    "What content formats work best for AI search engines?",
                    "How important is factual accuracy for AI search ranking?",
                    "Should content be structured differently for AI search?",
                    "How do AI search engines evaluate content quality?",
                    "What role does E-E-A-T play in AI search rankings?"
                  ].map((question, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 bg-muted/30 rounded-md">
                      <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                        <HelpCircle className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm">{question}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="traditional">
            <div className="space-y-4">
              <div className="bg-muted/30 border rounded-lg p-4">
                <h3 className="text-base font-medium mb-2">Traditional SEO Considerations</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  While optimizing for AI search, don't neglect traditional SEO factors that still matter for standard search engines like Google.
                </p>
                
                <div className="grid gap-4 sm:grid-cols-2 mt-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">On-Page Factors</h4>
                    <ul className="space-y-2 text-sm">
                      {[
                        "Include target keywords in your title and headings",
                        "Optimize meta description with keywords and value proposition",
                        "Use SEO-friendly URLs with relevant keywords",
                        "Include internal links to relevant content",
                        "Optimize images with alt text and descriptive filenames"
                      ].map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                            <Check className="h-3 w-3 text-primary" />
                          </div>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Technical Factors</h4>
                    <ul className="space-y-2 text-sm">
                      {[
                        "Ensure fast page loading speed",
                        "Make content mobile-friendly",
                        "Use proper header hierarchy (H1, H2, H3)",
                        "Implement schema markup for rich results",
                        "Create an XML sitemap for better indexing"
                      ].map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                            <Check className="h-3 w-3 text-primary" />
                          </div>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Keyword Placement Recommendations</h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {[
                      { location: "Title", recommendation: "Include primary keyword near the beginning" },
                      { location: "First Paragraph", recommendation: "Mention primary keyword within first 100 words" },
                      { location: "Headings", recommendation: "Use keywords in at least 2-3 subheadings" },
                      { location: "Body Content", recommendation: "Use natural variations throughout" },
                      { location: "Meta Description", recommendation: "Include primary and secondary keywords" },
                      { location: "URL", recommendation: "Keep it short with main keyword" }
                    ].map((item, i) => (
                      <div key={i} className="bg-muted/20 p-2 rounded-md">
                        <div className="text-xs font-medium">{item.location}</div>
                        <div className="text-xs">{item.recommendation}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="content">
            <div className="space-y-4">
              <div className="bg-muted/30 border rounded-lg p-4">
                <h3 className="text-base font-medium mb-2">Content Structure Recommendations</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Well-structured content helps both readers and search engines understand your content. Use these recommendations to organize your content effectively.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Optimal Content Structure</h4>
                    <ol className="space-y-3">
                      {[
                        {
                          section: "Introduction",
                          description: "Set up the topic, establish relevance, and provide a brief overview of what will be covered."
                        },
                        {
                          section: "Problem Statement",
                          description: "Clearly define the challenge or question that the content will address."
                        },
                        {
                          section: "Main Content Sections",
                          description: "Organize in logical segments, each with a clear H2 heading and possibly H3 subheadings."
                        },
                        {
                          section: "Practical Examples",
                          description: "Include case studies, examples, or demonstrations to illustrate key points."
                        },
                        {
                          section: "Actionable Takeaways",
                          description: "Provide clear, implementable steps or advice the reader can follow."
                        },
                        {
                          section: "Conclusion",
                          description: "Summarize key points and reinforce the main message or solution."
                        }
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 pb-3 border-b border-muted last:border-0 last:pb-0">
                          <div className="rounded-full bg-brand-100 text-brand-800 h-6 w-6 flex items-center justify-center flex-shrink-0 font-medium">
                            {i + 1}
                          </div>
                          <div>
                            <div className="font-medium">{item.section}</div>
                            <div className="text-sm text-muted-foreground">{item.description}</div>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Content Enhancement Tips</h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {[
                        "Use bulleted or numbered lists for better readability",
                        "Include relevant images, charts, or infographics",
                        "Add a table of contents for longer articles",
                        "Use descriptive subheadings that include key phrases",
                        "Break up large paragraphs (aim for 3-4 sentences max)",
                        "Bold important points or key terms",
                        "Include a FAQ section addressing common questions",
                        "Add internal links to relevant resources"
                      ].map((tip, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                            <Check className="h-3 w-3 text-primary" />
                          </div>
                          <span className="text-sm">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
