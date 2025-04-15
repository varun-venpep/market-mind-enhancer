
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BloggerCredentials {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

interface MediumCredentials {
  access_token: string;
  expires_at: number;
}

export interface PublishSchedule {
  scheduledDate: Date | null;
  platforms: {
    blogger: boolean;
    medium: boolean;
  };
}

// Save integration credentials to the user's profile
export const saveIntegrationCredentials = async (
  platform: "blogger" | "medium",
  credentials: BloggerCredentials | MediumCredentials
) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      toast.error("You must be logged in to save integration credentials");
      return false;
    }
    
    const { error } = await supabase
      .from("user_integrations")
      .upsert({
        user_id: user.user.id,
        platform,
        credentials,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "user_id,platform"
      });
    
    if (error) {
      console.error(`Error saving ${platform} credentials:`, error);
      toast.error(`Failed to save ${platform} credentials`);
      return false;
    }
    
    toast.success(`${platform.charAt(0).toUpperCase() + platform.slice(1)} connected successfully`);
    return true;
  } catch (error) {
    console.error(`Error in saveIntegrationCredentials for ${platform}:`, error);
    toast.error(`Failed to connect to ${platform}`);
    return false;
  }
};

// Get user integration credentials
export const getIntegrationCredentials = async (platform: "blogger" | "medium") => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      return null;
    }
    
    const { data, error } = await supabase
      .from("user_integrations")
      .select("credentials")
      .eq("user_id", user.user.id)
      .eq("platform", platform)
      .single();
    
    if (error || !data) {
      return null;
    }
    
    return data.credentials;
  } catch (error) {
    console.error(`Error getting ${platform} credentials:`, error);
    return null;
  }
};

// Check if a platform integration is connected
export const isIntegrationConnected = async (platform: "blogger" | "medium") => {
  const credentials = await getIntegrationCredentials(platform);
  return !!credentials;
};

// Disconnect a platform integration
export const disconnectIntegration = async (platform: "blogger" | "medium") => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      toast.error("You must be logged in to disconnect integrations");
      return false;
    }
    
    const { error } = await supabase
      .from("user_integrations")
      .delete()
      .eq("user_id", user.user.id)
      .eq("platform", platform);
    
    if (error) {
      console.error(`Error disconnecting ${platform}:`, error);
      toast.error(`Failed to disconnect ${platform}`);
      return false;
    }
    
    toast.success(`${platform.charAt(0).toUpperCase() + platform.slice(1)} disconnected successfully`);
    return true;
  } catch (error) {
    console.error(`Error in disconnectIntegration for ${platform}:`, error);
    toast.error(`Failed to disconnect from ${platform}`);
    return false;
  }
};

// Schedule article for publishing
export const scheduleArticlePublish = async (
  articleId: string,
  schedule: PublishSchedule
) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      toast.error("You must be logged in to schedule posts");
      return false;
    }
    
    const { error } = await supabase
      .from("article_publishing")
      .upsert({
        article_id: articleId,
        user_id: user.user.id,
        scheduled_date: schedule.scheduledDate?.toISOString() || null,
        platforms: schedule.platforms,
        status: "scheduled",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: "article_id"
      });
    
    if (error) {
      console.error("Error scheduling article:", error);
      toast.error("Failed to schedule article");
      return false;
    }
    
    toast.success("Article scheduled for publishing");
    return true;
  } catch (error) {
    console.error("Error in scheduleArticlePublish:", error);
    toast.error("Failed to schedule article");
    return false;
  }
};

// Publish article immediately to selected platforms
export const publishArticleNow = async (
  articleId: string,
  platforms: { blogger: boolean; medium: boolean }
) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      toast.error("You must be logged in to publish posts");
      return false;
    }
    
    // Call edge function to handle the actual publishing
    const { data, error } = await supabase.functions.invoke("publish-article", {
      body: {
        articleId,
        platforms,
        userId: user.user.id
      }
    });
    
    if (error) {
      console.error("Error publishing article:", error);
      toast.error("Failed to publish article");
      return false;
    }
    
    toast.success("Article published successfully");
    return true;
  } catch (error) {
    console.error("Error in publishArticleNow:", error);
    toast.error("Failed to publish article");
    return false;
  }
};
