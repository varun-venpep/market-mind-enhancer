
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Save, ArrowLeft, List, Target, Users } from "lucide-react";
import ContentOutline from '@/components/ContentBrief/ContentOutline';
import { OutlineItem } from '@/types';

const ContentBriefEditor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [notes, setNotes] = useState('');
  const [outlineItems, setOutlineItems] = useState<OutlineItem[]>([
    { id: '1', type: 'h1', text: 'Introduction' },
    { id: '2', type: 'h2', text: 'What is [Topic]?' },
    { id: '3', type: 'h2', text: 'Key Benefits of [Topic]' },
    { id: '4', type: 'h2', text: 'How to Use [Topic]' },
    { id: '5', type: 'h2', text: 'Common Challenges and Solutions' },
    { id: '6', type: 'h1', text: 'Conclusion' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your content brief",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Brief saved",
        description: "Your content brief has been saved successfully",
      });
      setIsSubmitting(false);
      navigate('/dashboard/content-brief-list');
    }, 1500);
  };

  const handleOutlineChange = (newOutline: OutlineItem[]) => {
    setOutlineItems(newOutline);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard/content-brief-list')}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Briefs
            </Button>
          </div>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold gradient-text">Create Content Brief</h1>
            <p className="text-muted-foreground mt-1">
              Define your content requirements and outline the structure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <List className="mr-2 h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter a descriptive title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="keywords">Target Keywords</Label>
                    <Input
                      id="keywords"
                      placeholder="Enter keywords separated by commas..."
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Add primary and secondary keywords to target in your content
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="targetAudience" className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      Target Audience
                    </Label>
                    <Textarea
                      id="targetAudience"
                      placeholder="Describe your target audience..."
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any additional requirements or notes..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5" />
                    Content Outline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ContentOutline 
                    items={outlineItems} 
                    onChange={handleOutlineChange} 
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Brief Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="wordCount">Recommended Word Count</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="minWordCount"
                        type="number"
                        placeholder="Min"
                        defaultValue="1200"
                      />
                      <span>to</span>
                      <Input
                        id="maxWordCount"
                        type="number"
                        placeholder="Max"
                        defaultValue="2000"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full gradient-button"
                    onClick={handleSave}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-pulse">Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Brief
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ContentBriefEditor;
