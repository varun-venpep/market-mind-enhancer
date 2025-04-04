
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
      
      // Extract questions with regex as fallback
      const questionMatches = questionsResponse.match(/["']([^"']+\?)["']/g);
      if (questionMatches) {
        questions = questionMatches.map(q => q.replace(/^["']|["']$/g, ''));
      } else {
        questions = [
          "What are the key benefits of this approach?",
          "How can beginners get started with this topic?",
          "What common challenges might someone face?",
          "How does this compare to alternatives?",
          "What future trends should readers be aware of?"
        ];
      }
    }
    
    // Calculate recommended word count based on brief complexity
    const recommendedWordCount = {
      min: 1200 + (brief.keywords.length * 50),
      max: 2000 + (brief.keywords.length * 100)
    };
    
    // Generate a random content score for the initial brief
    const contentScore = Math.floor(Math.random() * 20) + 60; // Score between 60-80
    
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
