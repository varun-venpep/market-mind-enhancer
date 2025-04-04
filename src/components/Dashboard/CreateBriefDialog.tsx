
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { generateContent } from "@/services/geminiApi";

export const CreateBriefDialog = ({ open, onOpenChange, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [keyword, setKeyword] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleAddKeyword = () => {
    if (keyword && !keywords.includes(keyword)) {
      setKeywords([...keywords, keyword]);
      setKeyword("");
    }
  };

  const handleRemoveKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleGenerateSuggestions = async () => {
    if (!title) {
      toast({
        title: "Title Required",
        description: "Please enter a brief title to generate keyword suggestions.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = `Generate 5 relevant SEO keywords for a blog post titled "${title}". 
      Return ONLY an array of keywords, with no additional text or explanation.
      Example: ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]`;

      const response = await generateContent(prompt);
      
      // Parse the response to extract the array
      let suggestedKeywords: string[] = [];
      try {
        // Try to parse directly if the response is already JSON
        suggestedKeywords = JSON.parse(response.replace(/```json|```/g, '').trim());
      } catch (e) {
        // If parsing fails, try to extract array using regex
        const match = response.match(/\[(.*)\]/s);
        if (match) {
          try {
            suggestedKeywords = JSON.parse(`[${match[1]}]`);
          } catch (e2) {
            // If still fails, extract comma-separated keywords
            suggestedKeywords = match[1]
              .split(',')
              .map(k => k.trim().replace(/"/g, ''))
              .filter(k => k.length > 0);
          }
        }
      }

      // Add only keywords that don't already exist
      const newKeywords = suggestedKeywords.filter(k => !keywords.includes(k));
      setKeywords([...keywords, ...newKeywords]);
      
      toast({
        title: "Keywords Generated",
        description: `Added ${newKeywords.length} suggested keywords.`,
      });
    } catch (error) {
      console.error("Error generating keywords:", error);
      toast({
        title: "Error",
        description: "Failed to generate keyword suggestions.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = () => {
    if (!title) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your content brief.",
        variant: "destructive",
      });
      return;
    }

    if (keywords.length === 0) {
      toast({
        title: "Keywords Required",
        description: "Please add at least one keyword for your content brief.",
        variant: "destructive",
      });
      return;
    }

    onSubmit(title, keywords);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Content Brief</DialogTitle>
          <DialogDescription>
            Add details to create a new content optimization brief.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Content Title</Label>
            <Input
              id="title"
              placeholder="e.g., Complete Guide to SEO in 2023"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="keywords">Target Keywords</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleGenerateSuggestions}
                disabled={isGenerating || !title}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-3 w-3" />
                    Suggest
                  </>
                )}
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                id="keywords"
                placeholder="Add a keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddKeyword();
                  }
                }}
              />
              <Button type="button" onClick={handleAddKeyword} disabled={!keyword}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {keywords.map((kw, index) => (
                  <Badge key={index} variant="secondary" className="px-2 py-1">
                    {kw}
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(index)}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Create Brief</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
