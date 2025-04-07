
import { supabase } from "@/integrations/supabase/client";
import { generateContent, generateImage } from "@/services/geminiApi";
import { ContentBrief } from "@/types";

export async function generateBriefContent(brief: ContentBrief): Promise<{
  outline: any[];
  questions: string[];
  recommendedWordCount: { min: number; max: number };
  contentScore: number;
}> {
  try {
    // Generate outline based on brief title and keywords
    const outlinePrompt = `Create a detailed blog post outline for a post titled "${brief.title}" targeting these keywords: ${brief.keywords.join(", ")}.
    
    Return the response as a JSON array containing sections, with each section having:
    - text: The section heading
    - importance: A number 1-10 indicating importance
    - description: A brief description of what to include
    
    Format: [{"text": "Introduction", "importance": 10, "description": "..."}, ...]
    Return ONLY the JSON array, with no additional text.`;
    
    const outlineResponse = await generateContent(outlinePrompt);
    
    // Parse the outline response
    let outline = [];
    try {
      const jsonStr = outlineResponse.replace(/```json|```/g, '').trim();
      outline = JSON.parse(jsonStr);
      
      // Ensure the parsed result is an array
      if (!Array.isArray(outline)) {
        outline = [];
      }
    } catch (error) {
      console.error("Failed to parse outline JSON:", error);
      console.log("Raw outline response:", outlineResponse);
      
      // Fallback outline if parsing fails
      outline = [
        { text: "Introduction", importance: 10, description: "Introduce the topic and its importance" },
        { text: "Main Points", importance: 8, description: "Cover the key aspects of the topic" },
        { text: "Practical Tips", importance: 7, description: "Provide actionable advice for readers" },
        { text: "Case Studies", importance: 6, description: "Include real-world examples" },
        { text: "Conclusion", importance: 9, description: "Summarize key takeaways" }
      ];
    }
    
    // Generate questions related to the brief
    const questionsPrompt = `Generate 5 important questions that readers might have about "${brief.title}".
    Think about what someone interested in ${brief.keywords.join(", ")} would want to know.
    Return only an array of questions with no additional text.
    Example: ["Question 1?", "Question 2?", "Question 3?", "Question 4?", "Question 5?"]`;
    
    const questionsResponse = await generateContent(questionsPrompt);
    
    // Parse the questions response
    let questions = [];
    try {
      const jsonStr = questionsResponse.replace(/```json|```/g, '').trim();
      questions = JSON.parse(jsonStr);
      
      // Ensure the parsed result is an array
      if (!Array.isArray(questions)) {
        // Try to extract questions using regex as a fallback
        const questionMatches = questionsResponse.match(/\d+\.\s+(.*?)(?=\d+\.|$)/gs);
        if (questionMatches) {
          questions = questionMatches.map(q => q.replace(/^\d+\.\s+/, '').trim());
        } else {
          questions = questionsResponse.split('\n')
            .filter(line => line.trim().endsWith('?'))
            .map(line => line.trim());
        }
      }
    } catch (error) {
      console.error("Failed to parse questions JSON:", error);
      console.log("Raw questions response:", questionsResponse);
      
      // Extract questions with regex as fallback
      const questionMatches = questionsResponse.match(/["']([^"']+\?)["']/g);
      if (questionMatches) {
        questions = questionMatches.map(q => q.replace(/^["']|["']$/g, ''));
      } else {
        // Default questions if all else fails
        questions = [
          `What are the key benefits of ${brief.title}?`,
          `How can beginners get started with ${brief.keywords[0]}?`,
          `What common challenges might someone face with ${brief.keywords[0]}?`,
          `How does ${brief.keywords[0]} compare to alternatives?`,
          `What future trends should readers be aware of for ${brief.keywords[0]}?`
        ];
      }
    }
    
    // Calculate recommended word count based on brief complexity
    const recommendedWordCount = {
      min: 1200 + (brief.keywords.length * 50),
      max: 2000 + (brief.keywords.length * 100)
    };
    
    // Generate a content score based on keyword relevance and outline quality
    const contentScore = Math.min(95, Math.floor(60 + (outline.length * 2) + (questions.length * 2)));
    
    return {
      outline,
      questions,
      recommendedWordCount,
      contentScore
    };
  } catch (error) {
    console.error("Error in generateBriefContent:", error);
    throw error;
  }
}

export async function generateBriefThumbnail(brief: ContentBrief): Promise<string> {
  try {
    const imagePrompt = `Create a professional branded thumbnail image for a blog post titled "${brief.title}" 
    related to ${brief.keywords.join(", ")}. The image should be visually appealing and suitable for a professional blog.`;
    
    const imageUrl = await generateImage(imagePrompt);
    return imageUrl;
  } catch (error) {
    console.error("Error generating brief thumbnail:", error);
    // Return a fallback image URL
    return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1920&auto=format&fit=crop";
  }
}

// For storing briefs in the future, we can implement database integration
export async function saveBrief(brief: ContentBrief): Promise<ContentBrief> {
  try {
    // In a real app with Supabase connected, this would save to the database
    console.log("Saving brief:", brief);
    
    // For now, just return the brief with some added metadata
    return {
      ...brief,
      updatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error saving brief:", error);
    throw error;
  }
}

export async function getBrief(id: string): Promise<ContentBrief | null> {
  try {
    // In a real app with Supabase connected, this would fetch from the database
    console.log("Getting brief with ID:", id);
    
    // For now, return null to indicate that the brief was not found
    // This will be handled by the UI to show a not found message
    return null;
  } catch (error) {
    console.error("Error getting brief:", error);
    throw error;
  }
}
