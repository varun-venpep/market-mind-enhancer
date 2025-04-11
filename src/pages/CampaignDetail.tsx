
import React, { useState } from 'react';
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
} from "@material-tailwind/react";
import { ArrowLeft, FileText, Plus, Save } from "lucide-react";
import { useToast } from '@/components/ui/use-toast';

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
              onClick={() => navigate('/dashboard/article-generator')}
              className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-blue-500"
              placeholder={null}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Article
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
                        Click on "Add Article" to create your first article for this campaign.
                      </Typography>
                    </div>
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
