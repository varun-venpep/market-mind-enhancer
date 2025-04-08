
import React from 'react';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileText, Lightbulb, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { BriefCreator } from "@/components/ContentBrief/BriefCreator";

export default function ContentBriefs() {
  const navigate = useNavigate();
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate('/dashboard')} 
                className="mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Button>
            </div>
            <h1 className="text-3xl font-bold gradient-text">Content Briefs</h1>
            <p className="text-muted-foreground mt-1">
              Create detailed content briefs and outlines for high-performing SEO content
            </p>
          </div>
        </div>
        
        <Tabs defaultValue="create" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="create" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>Create Brief</span>
            </TabsTrigger>
            <TabsTrigger value="inspiration" className="flex items-center gap-1">
              <Lightbulb className="h-4 w-4" />
              <span>Content Ideas</span>
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-1">
              <ListChecks className="h-4 w-4" />
              <span>Saved Briefs</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="create">
            <BriefCreator />
          </TabsContent>
          
          <TabsContent value="inspiration">
            <Card>
              <CardHeader>
                <CardTitle>Content Inspiration</CardTitle>
                <CardDescription>
                  Discover trending topics and content ideas for your niche
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Lightbulb className="h-16 w-16 text-amber-500/30 mb-4" />
                  <p className="text-muted-foreground">Content Ideas Coming Soon</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                    This feature is under development and will be available soon.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="saved">
            <Card>
              <CardHeader>
                <CardTitle>Saved Briefs</CardTitle>
                <CardDescription>
                  Access your saved content briefs and outlines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <ListChecks className="h-16 w-16 text-blue-500/30 mb-4" />
                  <p className="text-muted-foreground">No Saved Briefs Yet</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                    Create your first content brief to save it here.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
