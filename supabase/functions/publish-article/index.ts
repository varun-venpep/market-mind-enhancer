
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

interface RequestBody {
  articleId: string;
  platforms: {
    blogger: boolean;
    medium: boolean;
  };
  userId: string;
}

interface BloggerCredentials {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

interface MediumCredentials {
  access_token: string;
  expires_at: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }
  
  try {
    // Parse request body
    const { articleId, platforms, userId } = await req.json() as RequestBody;
    
    if (!articleId) {
      throw new Error("Article ID is required");
    }

    if (!userId) {
      throw new Error("User ID is required");
    }
    
    if (!platforms.blogger && !platforms.medium) {
      throw new Error("At least one publishing platform must be selected");
    }
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Supabase credentials are not configured");
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get article data
    const { data: article, error: articleError } = await supabase
      .from("articles")
      .select("*")
      .eq("id", articleId)
      .eq("user_id", userId)
      .single();
    
    if (articleError || !article) {
      throw new Error("Article not found or access denied");
    }
    
    // Get user integrations
    const { data: integrations, error: integrationsError } = await supabase
      .from("user_integrations")
      .select("platform, credentials")
      .eq("user_id", userId);
    
    if (integrationsError) {
      throw new Error("Failed to retrieve user integrations");
    }
    
    const credentialsMap: Record<string, BloggerCredentials | MediumCredentials> = {};
    
    for (const integration of integrations) {
      credentialsMap[integration.platform] = integration.credentials;
    }
    
    let publishResults: Record<string, boolean | string> = {};
    
    // Publish to Blogger if selected
    if (platforms.blogger && credentialsMap.blogger) {
      try {
        console.log("Publishing to Blogger:", article.title);
        publishResults.blogger = await publishToBlogger(
          article, 
          credentialsMap.blogger as BloggerCredentials
        );
      } catch (error) {
        console.error("Error publishing to Blogger:", error);
        publishResults.blogger = `Error: ${error.message}`;
      }
    }
    
    // Publish to Medium if selected
    if (platforms.medium && credentialsMap.medium) {
      try {
        console.log("Publishing to Medium:", article.title);
        publishResults.medium = await publishToMedium(
          article, 
          credentialsMap.medium as MediumCredentials
        );
      } catch (error) {
        console.error("Error publishing to Medium:", error);
        publishResults.medium = `Error: ${error.message}`;
      }
    }
    
    // Update article status in database
    const { error: updateError } = await supabase
      .from("articles")
      .update({ 
        status: "published",
        updated_at: new Date().toISOString(),
        publish_status: publishResults
      })
      .eq("id", articleId);
    
    if (updateError) {
      console.error("Error updating article status:", updateError);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Publishing complete", 
        results: publishResults 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error publishing article:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

// Function to publish to Blogger
async function publishToBlogger(
  article: any,
  credentials: BloggerCredentials
): Promise<boolean> {
  // Implementation would handle the actual API call to Blogger
  // This is a simplified version for demonstration
  
  // Check if token is expired and needs refresh
  if (Date.now() > credentials.expires_at) {
    // In a real implementation, you would refresh the token here
    console.log("Blogger token expired, would refresh in production");
  }

  try {
    // In a real implementation, we would:
    // 1. Get the user's blog ID using credentials.access_token
    // 2. Format the article content for Blogger
    // 3. Make a POST request to create a new post
    
    // Making a simulated API call for demonstration purposes
    const blogId = "12345"; // This would be retrieved from the actual API
    const url = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts`;
    
    console.log(`Would POST to Blogger API: ${url}`);
    console.log("Article data:", {
      title: article.title,
      content: article.content.substring(0, 50) + "...",
    });
    
    // Simulating a successful post creation
    // In a real implementation, this would be the response from the API call
    
    // Return true to indicate successful publishing
    return true;
  } catch (error) {
    console.error("Error in publishToBlogger:", error);
    throw error;
  }
}

// Function to publish to Medium
async function publishToMedium(
  article: any,
  credentials: MediumCredentials
): Promise<boolean> {
  // Implementation would handle the actual API call to Medium
  // This is a simplified version for demonstration
  
  // Check if token is expired
  if (Date.now() > credentials.expires_at) {
    throw new Error("Medium token expired");
  }

  try {
    // In a real implementation, we would:
    // 1. Get the user's Medium ID using credentials.access_token
    // 2. Format the article content for Medium
    // 3. Make a POST request to create a new post
    
    // Making a simulated API call for demonstration purposes
    const url = "https://api.medium.com/v1/users/me/posts";
    
    console.log(`Would POST to Medium API: ${url}`);
    console.log("Article data:", {
      title: article.title,
      content: article.content.substring(0, 50) + "...",
      contentFormat: "html",
      publishStatus: "public",
    });
    
    // Simulating a successful post creation
    // In a real implementation, this would be the response from the API call
    
    // Return true to indicate successful publishing
    return true;
  } catch (error) {
    console.error("Error in publishToMedium:", error);
    throw error;
  }
}
