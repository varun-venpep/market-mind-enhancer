
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, HelpCircle, Lightbulb } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ContentBrief } from "@/types";

interface OptimizationTipsProps {
  brief?: ContentBrief;
}

export const OptimizationTips = ({ brief }: OptimizationTipsProps) => {
  const tips = [
    {
      title: "Include your primary keyword in the title and first paragraph",
      description: "Search engines give more weight to keywords that appear early in your content."
    },
    {
      title: "Use semantically related terms throughout your content",
      description: "AI search engines understand context and related concepts, not just exact keywords."
    },
    {
      title: "Structure content with clear headings (H2, H3, H4)",
      description: "Proper heading hierarchy helps both readers and search engines understand your content."
    },
    {
      title: "Answer common user questions directly",
      description: "Address the questions listed in this brief to increase your content's helpfulness."
    },
    {
      title: "Include visual elements with descriptive alt text",
      description: "Images and videos improve engagement and can rank in image search results."
    }
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center">
          <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
          <span>Optimization Tips</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="ml-1">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-sm">
                <p className="text-sm">
                  These tips will help your content rank better in search results and
                  provide more value to readers.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <ul className="space-y-3">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="rounded-full bg-green-500/10 p-1 mt-0.5 flex-shrink-0">
                <Check className="h-3.5 w-3.5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{tip.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{tip.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
