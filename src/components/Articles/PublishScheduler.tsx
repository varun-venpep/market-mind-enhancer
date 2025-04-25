
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, CheckCircle, Clock, Loader2, Send } from "lucide-react";
import { format } from "date-fns";
import { scheduleArticlePublish, publishArticleNow, isIntegrationConnected } from "@/utils/blogIntegrations";
import { toast } from "sonner";

interface PublishSchedulerProps {
  articleId: string;
  title: string;
}

export function PublishScheduler({ articleId, title }: PublishSchedulerProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [platforms, setPlatforms] = useState({
    blogger: false,
    medium: false
  });
  const [integrations, setIntegrations] = useState({
    blogger: false,
    medium: false
  });
  const [loading, setLoading] = useState(true);
  const [publishingNow, setPublishingNow] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  
  useEffect(() => {
    checkIntegrations();
  }, []);
  
  const checkIntegrations = async () => {
    try {
      setLoading(true);
      const bloggerConnected = await isIntegrationConnected("blogger");
      const mediumConnected = await isIntegrationConnected("medium");
      
      setIntegrations({
        blogger: bloggerConnected,
        medium: mediumConnected
      });
      
    } catch (error) {
      console.error("Error checking integrations:", error);
      toast.error("Failed to check platform integrations");
    } finally {
      setLoading(false);
    }
  };
  
  const handlePublishNow = async () => {
    if (!platforms.blogger && !platforms.medium) {
      toast.error("Please select at least one platform to publish to");
      return;
    }
    
    setPublishingNow(true);
    
    try {
      const success = await publishArticleNow(articleId, platforms);
      if (success) {
        toast.success("Article published successfully");
      }
    } catch (error) {
      console.error("Error publishing article:", error);
      toast.error("Failed to publish article");
    } finally {
      setPublishingNow(false);
    }
  };
  
  const handleSchedule = async () => {
    if (!date) {
      toast.error("Please select a date to schedule");
      return;
    }
    
    if (!platforms.blogger && !platforms.medium) {
      toast.error("Please select at least one platform to publish to");
      return;
    }
    
    setScheduling(true);
    
    try {
      const success = await scheduleArticlePublish(articleId, {
        scheduledDate: date,
        platforms
      });
      
      if (success) {
        toast.success(`Article scheduled for ${format(date, "PPP")}`);
        setDate(undefined);
      }
    } catch (error) {
      console.error("Error scheduling article:", error);
      toast.error("Failed to schedule article");
    } finally {
      setScheduling(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Publish Options</CardTitle>
          <CardDescription>Share your content across platforms</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  const hasConnectedPlatforms = integrations.blogger || integrations.medium;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Send className="mr-2 h-5 w-5 text-primary" />
          Publish Options
        </CardTitle>
        <CardDescription>Share your content across platforms</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasConnectedPlatforms ? (
          <div className="rounded-md bg-muted p-4 text-center">
            <p className="text-sm font-medium">
              You haven't connected any publishing platforms yet.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Go to the Integrations page to connect Blogger or Medium.
            </p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => window.location.href = "/dashboard/integrations"}
            >
              Set Up Integrations
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div className="font-medium">Select platforms to publish to:</div>
              
              {integrations.blogger && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-500">
                      <path d="M14.13 4.35c-1.2.07-3.14.48-4.11 1.13a5.52 5.52 0 00-2.26 3.34c-.2.90-.29 1.8-.31 3.22-.02 1.55-.07 1.94-.35 2.72-.22.6-.41.89-.83 1.3-.28.28-.51.5-.51.51 0 0 .16.22.35.48.73 1 1.02 1.91 1.05 3.28.02.95.12 1.43.47 2.17.7 1.5 2.3 2.43 4.83 2.8 1.1.17 4.16.17 5.36 0 2.38-.33 3.93-1.17 4.8-2.57.45-.73.66-1.43.75-2.52.04-.51.1-.97.14-1.03.07-.11.5-.28.7-.28.08 0 .14-.89.16-2.29l.02-2.28-.29-.14c-.35-.17-.88-.14-1.33.08-.27.13-.33.13-.33-.02 0-.38-1.05-1.93-1.7-2.5-1.06-.93-2.07-1.36-3.55-1.5-.47-.05-.56-.09-.66-.35-.36-.9-1.29-3.69-1.54-4.56-.1-.32-.24-.6-.34-.67-.22-.17-1.06-.31-1.82-.32zm-.15 5.94c.57.07 1.07.41 1.39.94.23.38.23.41.23 3.76v3.38l-.28.01c-.15.01-.9.04-1.68.08-1.55.07-2.14-.02-2.77-.41-.59-.36-.93-.93-1.01-1.66-.15-1.38.71-2.58 2.04-2.85.47-.09 1.13.02 1.47.26.14.1.28.16.3.14.06-.06-.24-.8-.42-1.05-.55-.75-1.47-.95-2.35-.5-.43.22-1.05.93-1.31 1.49-.42.91-.45 1.89-.07 2.85.85 2.15 3.17 3.03 5.14 1.96.21-.11.4-.19.43-.17.08.08-.39.67-.77.97-.69.53-1.3.69-2.59.69-1.31 0-1.49-.04-2.25-.52-.75-.47-1.21-1.11-1.5-2.1-.14-.46-.16-1.83-.03-2.34.12-.52.6-1.58.89-1.97 1.07-1.46 3.07-2.25 4.74-1.89zM12.9 14c.53.27.78.69.79 1.31.01.78-.35 1.33-1.03 1.55-.21.07-.8.09-2.02.07l-1.74-.03v-3.21l1.85.03c1.44.03 1.91.06 2.15.18z" />
                    </svg>
                    <Label htmlFor="blogger-switch" className="cursor-pointer">Blogger</Label>
                  </div>
                  <Switch
                    id="blogger-switch"
                    checked={platforms.blogger}
                    onCheckedChange={(checked) => setPlatforms(prev => ({ ...prev, blogger: checked }))}
                  />
                </div>
              )}
              
              {integrations.medium && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
                    </svg>
                    <Label htmlFor="medium-switch" className="cursor-pointer">Medium</Label>
                  </div>
                  <Switch
                    id="medium-switch"
                    checked={platforms.medium}
                    onCheckedChange={(checked) => setPlatforms(prev => ({ ...prev, medium: checked }))}
                  />
                </div>
              )}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex items-center mb-4">
                <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                <div className="font-medium">Schedule for later</div>
              </div>
              
              <div className="grid gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => setDate(date)}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
                
                <Button 
                  onClick={handleSchedule} 
                  disabled={!date || scheduling || (!platforms.blogger && !platforms.medium)}
                >
                  {scheduling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    <>Schedule Publish</>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
      
      {hasConnectedPlatforms && (
        <CardFooter className="bg-muted/10 border-t flex justify-between">
          <div className="text-sm font-medium">
            <span className="text-muted-foreground mr-2">Article:</span>
            {title}
          </div>
          <Button 
            variant="default" 
            onClick={handlePublishNow}
            disabled={publishingNow || (!platforms.blogger && !platforms.medium)}
            className="gap-2"
          >
            {publishingNow ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Publish Now
              </>
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
