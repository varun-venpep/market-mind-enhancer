
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Typography, 
  Button,
  IconButton,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Select,
  Option,
  Radio,
  Chip,
} from "@material-tailwind/react";
import { ArrowLeft, FileText, Plus, Save, RefreshCw, Check, AlertCircle, Clock } from "lucide-react";
import { useToast } from '@/components/ui/use-toast';
import { generateContent } from '@/services/geminiApi';
import { Article } from '@/types';

const CampaignDetail = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Tab state
  const [activeTab, setActiveTab] = useState("articles");
  
  // Article preferences state
  const [preferences, setPreferences] = useState({
    language: "english",
    targetCountry: "us",
    toneOfVoice: "professional",
    pointOfView: "third_person",
    formality: "neutral"
  });

  // Articles state
  const [articles, setArticles] = useState<Article[]>([]);
  
  // Article generation state
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock keywords for demo
  const mockKeywords = ["gardening", "beginners", "plants", "easy gardening"];

  // Handle preferences change
  const handlePreferencesChange = (field, value) => {
    setPreferences({
      ...preferences,
      [field]: value
    });
  };

  // Handle save preferences
  const handleSavePreferences = () => {
    // In a real app, save preferences to database
    console.log("Saving preferences:", preferences);
    
    toast({
      title: "Preferences Saved",
      description: "Your article preferences have been saved successfully.",
    });
  };

  // Handle article generation
  const handleGenerateArticle = async () => {
    try {
      // Show generating state
      setIsGenerating(true);
      setActiveTab("activity");
      
      // Create a new draft article - using proper literal type for status
      const newArticle: Article = {
        id: `article-${Date.now()}`,
        keywords: mockKeywords,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        workspaceId: "workspace-1", // Hardcoded for demo
        campaignId: campaignId || "campaign-1",
        status: 'in-progress', // Using literal type from Article interface
      };
      
      // Add the article to the list
      setArticles(prev => [newArticle, ...prev]);
      
      // Wait for 2 seconds to simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Use the geminiApi service to generate content (mock for now)
      const prompt = `Write an SEO article about ${mockKeywords.join(", ")} with these specifications:
        - Language: ${preferences.language}
        - Target audience: Readers from ${preferences.targetCountry === 'us' ? 'United States' : 
          preferences.targetCountry === 'uk' ? 'United Kingdom' : 
          preferences.targetCountry === 'au' ? 'Australia' : 
          preferences.targetCountry === 'ca' ? 'Canada' : 
          preferences.targetCountry === 'br' ? 'Brazil' : 'Other countries'}
        - Tone of voice: ${preferences.toneOfVoice}
        - Point of view: ${preferences.pointOfView.replace('_', ' ')}
        - Formality: ${preferences.formality}
        
        Format:
        Title: [Create a catchy title]
        Content: [Write 2-3 paragraphs]
      `;
      
      // Since we don't want to make actual API calls in this example,
      // we'll create a mock response instead of calling generateContent(prompt)
      const mockTitle = preferences.toneOfVoice === 'funny' 
        ? "Why Plants Keep Ghosting You: A Beginner's Guide to Gardening"
        : preferences.toneOfVoice === 'professional'
        ? "Essential Gardening Techniques for Novice Horticulturists"
        : "Gardening 101: Getting Started with Your First Plants";
      
      const mockContent = `In this guide to ${mockKeywords.join(", ")}, we'll explore how beginners can create a thriving garden without the usual frustrations.
        
        ${preferences.formality === 'formal' 
          ? "It is essential that one understands the fundamental requirements of plant cultivation. The process commences with the selection of appropriate specimens for one's geographical location and available space."
          : preferences.formality === 'informal'
          ? "So you wanna grow some plants? Awesome! First thing you gotta do is pick the right plants for where you live and the space you've got."
          : "To start your gardening journey, first select plants that thrive in your climate and fit your available space."
        }
        
        ${preferences.pointOfView === 'first_person_singular'
          ? "I've found that the key to successful gardening is consistent care. When I first started, I made the mistake of irregular watering, which led to disappointing results."
          : preferences.pointOfView === 'first_person_plural'
          ? "We've found that the key to successful gardening is consistent care. When we first started, we made the mistake of irregular watering, which led to disappointing results."
          : preferences.pointOfView === 'second_person'
          ? "You'll find that the key to successful gardening is consistent care. When you first start, you might make the mistake of irregular watering, which leads to disappointing results."
          : "The key to successful gardening is consistent care. Many beginners make the mistake of irregular watering, which leads to disappointing results."
        }`;
      
      // Update the article with the generated content - making sure to use proper literal type for status
      const updatedArticles = articles.map(article => 
        article.id === newArticle.id 
          ? { 
              ...article, 
              title: mockTitle,
              content: mockContent,
              status: 'completed' as const, // Using literal type with type assertion
              updatedAt: new Date().toISOString()
            } 
          : article
      );
      
      setArticles(updatedArticles);
      
      // Show success toast
      toast({
        title: "Article Generated",
        description: "Your article has been successfully created.",
      });
    } catch (error) {
      console.error("Error generating article:", error);
      
      // Update the article with error status - using proper literal type
      const updatedArticles = articles.map(article => 
        article.id === articles[0]?.id
          ? { 
              ...article, 
              status: 'draft' as const, // Using literal type with type assertion
              updatedAt: new Date().toISOString()
            } 
          : article
      );
      
      setArticles(updatedArticles);
      
      // Show error toast
      toast({
        title: "Generation Failed",
        description: "There was an error generating your article. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
            <IconButton
              variant="text"
              size="sm"
              onClick={() => navigate('/dashboard/campaigns')}
              className="mr-4"
              placeholder={null}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              <ArrowLeft className="h-4 w-4" />
            </IconButton>
            <Typography 
              variant="lead"
              placeholder={null}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              Back to Campaigns
            </Typography>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <Typography 
                variant="h2" 
                className="bg-gradient-to-r from-blue-600 to-blue-500 text-transparent bg-clip-text"
                placeholder={null}
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
              >
                Campaign Details
              </Typography>
              <Typography 
                variant="paragraph" 
                color="blue-gray" 
                className="mt-1"
                placeholder={null}
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
              >
                Manage articles and preferences for this campaign
              </Typography>
            </div>
            <Button 
              onClick={handleGenerateArticle}
              className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-blue-500"
              placeholder={null}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Generating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" /> Generate Article
                </>
              )}
            </Button>
          </div>
          
          <Tabs value={activeTab} onChange={(value) => setActiveTab(value)}>
            <TabsHeader
              placeholder={null}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              <Tab 
                key="articles" 
                value="articles"
                placeholder={null}
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
              >
                Articles
              </Tab>
              <Tab 
                key="activity" 
                value="activity"
                placeholder={null}
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
              >
                Activity
              </Tab>
              <Tab 
                key="preferences" 
                value="preferences"
                placeholder={null}
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
              >
                Article Preferences
              </Tab>
            </TabsHeader>
            
            <TabsBody
              placeholder={null}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              <TabPanel key="articles" value="articles">
                <Card
                  placeholder={null}
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}
                >
                  <CardHeader
                    variant="gradient"
                    color="blue"
                    className="mb-2 p-4"
                    placeholder={null}
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  >
                    <Typography 
                      variant="h5" 
                      color="white"
                      placeholder={null}
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}
                    >
                      Articles in this Campaign
                    </Typography>
                    <Typography 
                      variant="small" 
                      color="white" 
                      className="opacity-80"
                      placeholder={null}
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}
                    >
                      All articles created for this campaign
                    </Typography>
                  </CardHeader>
                  <CardBody
                    placeholder={null}
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  >
                    {articles.filter(article => article.status === 'completed').length > 0 ? (
                      <div className="space-y-4">
                        {articles
                          .filter(article => article.status === 'completed')
                          .map(article => (
                            <Card key={article.id} className="overflow-hidden"
                              placeholder={null}
                              onPointerEnterCapture={() => {}}
                              onPointerLeaveCapture={() => {}}
                            >
                              <CardBody className="p-4"
                                placeholder={null}
                                onPointerEnterCapture={() => {}}
                                onPointerLeaveCapture={() => {}}
                              >
                                <div className="flex justify-between items-start">
                                  <div>
                                    <Typography 
                                      variant="h6" 
                                      color="blue-gray"
                                      placeholder={null}
                                      onPointerEnterCapture={() => {}}
                                      onPointerLeaveCapture={() => {}}
                                    >
                                      {article.title}
                                    </Typography>
                                    <div className="flex flex-wrap gap-2 mt-2 mb-3">
                                      {article.keywords.map(keyword => (
                                        <Chip 
                                          key={keyword} 
                                          value={keyword} 
                                          size="sm" 
                                          variant="outlined" 
                                          color="blue" 
                                          className="text-xs"
                                        />
                                      ))}
                                    </div>
                                    <Typography 
                                      variant="small" 
                                      color="blue-gray" 
                                      className="whitespace-pre-line"
                                      placeholder={null}
                                      onPointerEnterCapture={() => {}}
                                      onPointerLeaveCapture={() => {}}
                                    >
                                      {article.content?.substring(0, 200)}...
                                    </Typography>
                                  </div>
                                  <Chip 
                                    value="Completed" 
                                    size="sm" 
                                    color="green"
                                    icon={<Check className="h-3 w-3" />}
                                  />
                                </div>
                              </CardBody>
                            </Card>
                          ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <FileText className="h-16 w-16 text-blue-500/30 mb-4" />
                        <Typography 
                          variant="h6" 
                          color="blue-gray"
                          placeholder={null}
                          onPointerEnterCapture={() => {}}
                          onPointerLeaveCapture={() => {}}
                        >
                          No Articles Yet
                        </Typography>
                        <Typography 
                          variant="small" 
                          color="blue-gray" 
                          className="mt-1 max-w-xs"
                          placeholder={null}
                          onPointerEnterCapture={() => {}}
                          onPointerLeaveCapture={() => {}}
                        >
                          Click on "Generate Article" to create your first article for this campaign.
                        </Typography>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </TabPanel>
              
              <TabPanel key="activity" value="activity">
                <Card
                  placeholder={null}
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}
                >
                  <CardHeader
                    variant="gradient"
                    color="blue"
                    className="mb-2 p-4"
                    placeholder={null}
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  >
                    <Typography 
                      variant="h5" 
                      color="white"
                      placeholder={null}
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}
                    >
                      Activity Feed
                    </Typography>
                    <Typography 
                      variant="small" 
                      color="white" 
                      className="opacity-80"
                      placeholder={null}
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}
                    >
                      Recent article generation activity
                    </Typography>
                  </CardHeader>
                  <CardBody
                    placeholder={null}
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  >
                    {articles.length > 0 ? (
                      <div className="space-y-4">
                        {articles.map(article => (
                          <Card key={article.id} className="overflow-hidden"
                            placeholder={null}
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                          >
                            <CardBody className="p-4"
                              placeholder={null}
                              onPointerEnterCapture={() => {}}
                              onPointerLeaveCapture={() => {}}
                            >
                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  {article.status === 'in-progress' ? (
                                    <RefreshCw className="h-5 w-5 text-blue-500 mr-3 animate-spin" />
                                  ) : article.status === 'completed' ? (
                                    <Check className="h-5 w-5 text-green-500 mr-3" />
                                  ) : (
                                    <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                                  )}
                                  <div>
                                    <Typography 
                                      variant="h6" 
                                      color="blue-gray"
                                      placeholder={null}
                                      onPointerEnterCapture={() => {}}
                                      onPointerLeaveCapture={() => {}}
                                    >
                                      {article.title || 'Article Generation'}
                                    </Typography>
                                    <div className="flex items-center">
                                      <Clock className="h-3 w-3 text-blue-gray-500 mr-1" />
                                      <Typography 
                                        variant="small" 
                                        color="blue-gray"
                                        placeholder={null}
                                        onPointerEnterCapture={() => {}}
                                        onPointerLeaveCapture={() => {}}
                                      >
                                        {new Date(article.updatedAt).toLocaleString()}
                                      </Typography>
                                    </div>
                                  </div>
                                </div>
                                <Chip 
                                  value={
                                    article.status === 'in-progress' ? 'Generating' :
                                    article.status === 'completed' ? 'Completed' : 'Failed'
                                  } 
                                  size="sm" 
                                  color={
                                    article.status === 'in-progress' ? 'blue' :
                                    article.status === 'completed' ? 'green' : 'red'
                                  }
                                />
                              </div>
                            </CardBody>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Clock className="h-16 w-16 text-blue-500/30 mb-4" />
                        <Typography 
                          variant="h6" 
                          color="blue-gray"
                          placeholder={null}
                          onPointerEnterCapture={() => {}}
                          onPointerLeaveCapture={() => {}}
                        >
                          No Activity Yet
                        </Typography>
                        <Typography 
                          variant="small" 
                          color="blue-gray" 
                          className="mt-1 max-w-xs"
                          placeholder={null}
                          onPointerEnterCapture={() => {}}
                          onPointerLeaveCapture={() => {}}
                        >
                          When you generate articles, your activity will appear here.
                        </Typography>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </TabPanel>
              
              <TabPanel key="preferences" value="preferences">
                <Card
                  placeholder={null}
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}
                >
                  <CardHeader
                    variant="gradient"
                    color="blue"
                    className="mb-2 p-4"
                    placeholder={null}
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  >
                    <Typography 
                      variant="h5" 
                      color="white"
                      placeholder={null}
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}
                    >
                      SEO Article Preferences
                    </Typography>
                    <Typography 
                      variant="small" 
                      color="white" 
                      className="opacity-80"
                      placeholder={null}
                      onPointerEnterCapture={() => {}}
                      onPointerLeaveCapture={() => {}}
                    >
                      Customize how AI generates articles for this campaign
                    </Typography>
                  </CardHeader>
                  <CardBody
                    placeholder={null}
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                    className="p-6 space-y-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Language */}
                      <div>
                        <Typography 
                          variant="small" 
                          color="blue-gray" 
                          className="mb-2 font-medium"
                          placeholder={null}
                          onPointerEnterCapture={() => {}}
                          onPointerLeaveCapture={() => {}}
                        >
                          Language
                        </Typography>
                        <Select
                          label="Select Language"
                          value={preferences.language}
                          onChange={(value) => handlePreferencesChange('language', value)}
                          placeholder={null}
                          onPointerEnterCapture={() => {}}
                          onPointerLeaveCapture={() => {}}
                        >
                          <Option value="english">English</Option>
                          <Option value="portuguese">Portuguese</Option>
                          <Option value="spanish">Spanish</Option>
                          <Option value="french">French</Option>
                          <Option value="german">German</Option>
                        </Select>
                      </div>
                      
                      {/* Target Country */}
                      <div>
                        <Typography 
                          variant="small" 
                          color="blue-gray" 
                          className="mb-2 font-medium"
                          placeholder={null}
                          onPointerEnterCapture={() => {}}
                          onPointerLeaveCapture={() => {}}
                        >
                          Target Country
                        </Typography>
                        <Select
                          label="Select Target Country"
                          value={preferences.targetCountry}
                          onChange={(value) => handlePreferencesChange('targetCountry', value)}
                          placeholder={null}
                          onPointerEnterCapture={() => {}}
                          onPointerLeaveCapture={() => {}}
                        >
                          <Option value="us">United States</Option>
                          <Option value="uk">United Kingdom</Option>
                          <Option value="au">Australia</Option>
                          <Option value="ca">Canada</Option>
                          <Option value="br">Brazil</Option>
                          <Option value="other">Other</Option>
                        </Select>
                      </div>
                    </div>

                    {/* Tone of Voice */}
                    <div>
                      <Typography 
                        variant="small" 
                        color="blue-gray" 
                        className="mb-3 font-medium"
                        placeholder={null}
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                      >
                        Tone of Voice
                      </Typography>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {['professional', 'casual', 'funny', 'formal', 'friendly', 'enthusiastic'].map((tone) => (
                          <Radio
                            key={tone}
                            name="toneOfVoice"
                            label={tone.charAt(0).toUpperCase() + tone.slice(1)}
                            checked={preferences.toneOfVoice === tone}
                            onChange={() => handlePreferencesChange('toneOfVoice', tone)}
                            color="blue"
                            crossOrigin={undefined}
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Point of View */}
                    <div>
                      <Typography 
                        variant="small" 
                        color="blue-gray" 
                        className="mb-3 font-medium"
                        placeholder={null}
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                      >
                        Point of View
                      </Typography>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Radio
                          name="pointOfView"
                          label="First Person Singular (I, me, my)"
                          checked={preferences.pointOfView === "first_person_singular"}
                          onChange={() => handlePreferencesChange('pointOfView', 'first_person_singular')}
                          color="blue"
                          crossOrigin={undefined}
                          onPointerEnterCapture={() => {}}
                          onPointerLeaveCapture={() => {}}
                        />
                        <Radio
                          name="pointOfView"
                          label="First Person Plural (We, us, our)"
                          checked={preferences.pointOfView === "first_person_plural"}
                          onChange={() => handlePreferencesChange('pointOfView', 'first_person_plural')}
                          color="blue"
                          crossOrigin={undefined}
                          onPointerEnterCapture={() => {}}
                          onPointerLeaveCapture={() => {}}
                        />
                        <Radio
                          name="pointOfView"
                          label="Second Person (You, your)"
                          checked={preferences.pointOfView === "second_person"}
                          onChange={() => handlePreferencesChange('pointOfView', 'second_person')}
                          color="blue"
                          crossOrigin={undefined}
                          onPointerEnterCapture={() => {}}
                          onPointerLeaveCapture={() => {}}
                        />
                        <Radio
                          name="pointOfView"
                          label="Third Person (He/She/They, their)"
                          checked={preferences.pointOfView === "third_person"}
                          onChange={() => handlePreferencesChange('pointOfView', 'third_person')}
                          color="blue"
                          crossOrigin={undefined}
                          onPointerEnterCapture={() => {}}
                          onPointerLeaveCapture={() => {}}
                        />
                      </div>
                    </div>

                    {/* Formality */}
                    <div>
                      <Typography 
                        variant="small" 
                        color="blue-gray" 
                        className="mb-3 font-medium"
                        placeholder={null}
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                      >
                        Formality
                      </Typography>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <Radio
                          name="formality"
                          label="Formal"
                          checked={preferences.formality === "formal"}
                          onChange={() => handlePreferencesChange('formality', 'formal')}
                          color="blue"
                          crossOrigin={undefined}
                          onPointerEnterCapture={() => {}}
                          onPointerLeaveCapture={() => {}}
                        />
                        <Radio
                          name="formality"
                          label="Neutral"
                          checked={preferences.formality === "neutral"}
                          onChange={() => handlePreferencesChange('formality', 'neutral')}
                          color="blue"
                          crossOrigin={undefined}
                          onPointerEnterCapture={() => {}}
                          onPointerLeaveCapture={() => {}}
                        />
                        <Radio
                          name="formality"
                          label="Informal"
                          checked={preferences.formality === "informal"}
                          onChange={() => handlePreferencesChange('formality', 'informal')}
                          color="blue"
                          crossOrigin={undefined}
                          onPointerEnterCapture={() => {}}
                          onPointerLeaveCapture={() => {}}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={handleSavePreferences}
                        className="bg-gradient-to-r from-blue-600 to-blue-500 mt-4"
                        placeholder={null}
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                      >
                        <Save className="mr-2 h-4 w-4" /> Save Preferences
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CampaignDetail;
