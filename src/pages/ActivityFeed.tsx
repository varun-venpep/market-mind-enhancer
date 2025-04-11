
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Typography, 
  Button,
  IconButton,
  Select,
  Option,
  Dialog,
  DialogHeader,
  DialogBody,
} from "@material-tailwind/react";
import { 
  ArrowLeft, 
  FileText, 
  Search, 
  Filter, 
  Check, 
  RefreshCw, 
  AlertCircle, 
  Eye,
  X
} from "lucide-react";
import { useToast } from '@/components/ui/use-toast';
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Article, Campaign } from '@/types';

const ActivityFeed = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Articles state
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Campaign filter state
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Fetch all articles and campaigns
  useEffect(() => {
    // For demo, create mock data
    setIsLoading(true);
    
    // Mock campaign data
    const mockCampaigns: Campaign[] = [
      {
        id: "default-campaign",
        name: "Default Campaign",
        description: "Automatically created campaign for keyword articles",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        workspaceId: "workspace-1",
        articleCount: 3
      },
      {
        id: "summer-campaign",
        name: "Summer Campaign",
        description: "Summer seasonal content",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        workspaceId: "workspace-1",
        articleCount: 2
      }
    ];
    
    // Mock article data
    const mockArticles: Article[] = [
      {
        id: "article-1",
        title: "Gardening for Beginners",
        keywords: ["gardening", "beginners", "plants", "easy gardening"],
        createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(), // 2 days ago
        updatedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
        workspaceId: "workspace-1",
        campaignId: "default-campaign",
        status: 'completed' as const,
        content: "In this guide to gardening, beginners, plants, easy gardening, we'll explore how beginners can create a thriving garden without the usual frustrations.\n\nTo start your gardening journey, first select plants that thrive in your climate and fit your available space.\n\nThe key to successful gardening is consistent care. Many beginners make the mistake of irregular watering, which leads to disappointing results.",
        articleType: 'SEO',
        campaignName: "Default Campaign"
      },
      {
        id: "article-2",
        title: "Summer Gardening Tips",
        keywords: ["summer", "gardening", "heat protection", "watering"],
        createdAt: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
        updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        workspaceId: "workspace-1",
        campaignId: "summer-campaign",
        status: 'completed' as const,
        content: "Summer is a challenging time for gardens. This guide helps you navigate the hot months with proper watering techniques and heat protection strategies.\n\nWatering early in the morning or late in the evening helps reduce evaporation and ensures your plants get the moisture they need.\n\nMulching around your plants provides essential protection from the intense summer heat while reducing water requirements.",
        articleType: 'Blog',
        campaignName: "Summer Campaign"
      },
      {
        id: "article-3",
        title: "Indoor Plants for Beginners",
        keywords: ["indoor plants", "beginners", "houseplants", "low maintenance"],
        createdAt: new Date().toISOString(), // Just now
        updatedAt: new Date().toISOString(),
        workspaceId: "workspace-1",
        campaignId: "default-campaign",
        status: 'in-progress' as const,
        articleType: 'SEO',
        campaignName: "Default Campaign"
      }
    ];
    
    // Set campaigns and articles
    setCampaigns(mockCampaigns);
    setArticles(mockArticles);
    setFilteredArticles(mockArticles);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Filter articles when campaign selection or search term changes
  useEffect(() => {
    let filtered = [...articles];
    
    // Filter by campaign
    if (selectedCampaign !== 'all') {
      filtered = filtered.filter(article => article.campaignId === selectedCampaign);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(article => 
        article.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredArticles(filtered);
  }, [selectedCampaign, searchTerm, articles]);
  
  // Handle campaign filter change
  const handleCampaignChange = (value: string) => {
    setSelectedCampaign(value);
  };
  
  // Handle article view
  const handleViewArticle = (article: Article) => {
    setSelectedArticle(article);
    setIsDialogOpen(true);
  };
  
  // Status badge component
  const StatusBadge = ({ status }: { status: Article['status'] }) => {
    switch (status) {
      case 'completed':
        return (
          <div className="flex items-center">
            <Check className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500">Completed</span>
          </div>
        );
      case 'in-progress':
        return (
          <div className="flex items-center">
            <RefreshCw className="h-4 w-4 text-blue-500 mr-1 animate-spin" />
            <span className="text-blue-500">Generating</span>
          </div>
        );
      case 'draft':
        return (
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-orange-500 mr-1" />
            <span className="text-orange-500">Draft</span>
          </div>
        );
      default:
        return null;
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
              onClick={() => navigate('/dashboard')}
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
              Back to Dashboard
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
                Activity Feed
              </Typography>
              <Typography 
                variant="paragraph" 
                color="blue-gray" 
                className="mt-1"
                placeholder={null}
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
              >
                Track and manage all your generated articles across campaigns
              </Typography>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-4">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-gray-500" />
              <Input 
                placeholder="Search by title or keywords..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="w-full md:w-auto flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-gray-500" />
              <Select
                label="Filter by Campaign"
                value={selectedCampaign}
                onChange={handleCampaignChange}
                placeholder={null}
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
                className="min-w-[220px]"
              >
                <Option value="all">All Campaigns</Option>
                {campaigns.map(campaign => (
                  <Option key={campaign.id} value={campaign.id}>{campaign.name}</Option>
                ))}
              </Select>
            </div>
          </div>
          
          <Card
            placeholder={null}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            <CardHeader
              variant="gradient"
              color="blue"
              className="p-4"
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
                Generated Articles
              </Typography>
            </CardHeader>
            <CardBody 
              className="px-0 py-0"
              placeholder={null}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              {isLoading ? (
                // Loading skeletons
                <div className="space-y-4 p-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex flex-col border-b border-blue-gray-100 p-4 animate-pulse">
                      <div className="flex justify-between items-start">
                        <div className="space-y-3 w-full">
                          <div className="h-5 bg-blue-gray-100 rounded w-1/3"></div>
                          <div className="h-4 bg-blue-gray-100 rounded w-1/4"></div>
                          <div className="h-4 bg-blue-gray-100 rounded w-1/2"></div>
                        </div>
                        <div className="h-8 bg-blue-gray-100 rounded w-24"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredArticles.length > 0 ? (
                <div className="divide-y divide-blue-gray-100">
                  {filteredArticles.map((article) => (
                    <div key={article.id} className="flex flex-col md:flex-row justify-between md:items-center p-4 hover:bg-blue-gray-50/50 transition-colors">
                      <div className="space-y-2 mb-3 md:mb-0">
                        <div className="flex items-center gap-2">
                          <Typography 
                            variant="h6" 
                            color="blue-gray"
                            placeholder={null}
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                          >
                            {article.title || 'Untitled Article'}
                          </Typography>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {article.articleType || 'SEO'}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {article.keywords.slice(0, 3).map((keyword, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                          {article.keywords.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{article.keywords.length - 3} more
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <StatusBadge status={article.status} />
                          <Typography 
                            variant="small" 
                            color="blue-gray"
                            className="text-xs"
                            placeholder={null}
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                          >
                            Campaign: {article.campaignName || 'Unknown'}
                          </Typography>
                          <Typography 
                            variant="small" 
                            color="blue-gray"
                            className="text-xs"
                            placeholder={null}
                            onPointerEnterCapture={() => {}}
                            onPointerLeaveCapture={() => {}}
                          >
                            {new Date(article.updatedAt).toLocaleString()}
                          </Typography>
                        </div>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="outlined"
                        color="blue"
                        className="flex items-center gap-2"
                        onClick={() => handleViewArticle(article)}
                        disabled={article.status === 'in-progress'}
                        placeholder={null}
                        onPointerEnterCapture={() => {}}
                        onPointerLeaveCapture={() => {}}
                      >
                        <Eye className="h-4 w-4" /> View
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <FileText className="h-16 w-16 text-blue-500/20 mb-4" />
                  <Typography 
                    variant="h6" 
                    color="blue-gray"
                    placeholder={null}
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  >
                    No Articles Found
                  </Typography>
                  <Typography 
                    variant="small" 
                    color="blue-gray" 
                    className="max-w-xs mt-1"
                    placeholder={null}
                    onPointerEnterCapture={() => {}}
                    onPointerLeaveCapture={() => {}}
                  >
                    {selectedCampaign !== 'all' || searchTerm 
                      ? "Try adjusting your filters or search terms" 
                      : "Generate your first article to see it here"}
                  </Typography>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
      
      {/* Article content dialog */}
      <Dialog
        open={isDialogOpen}
        handler={() => setIsDialogOpen(!isDialogOpen)}
        size="lg"
        placeholder={null}
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
      >
        <DialogHeader 
          placeholder={null}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
          className="flex items-center justify-between"
        >
          <Typography 
            variant="h5"
            placeholder={null}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            {selectedArticle?.title || 'Article Content'}
          </Typography>
          <IconButton
            variant="text"
            color="blue-gray"
            onClick={() => setIsDialogOpen(false)}
            placeholder={null}
            onPointerEnterCapture={() => {}}
            onPointerLeaveCapture={() => {}}
          >
            <X className="h-5 w-5" />
          </IconButton>
        </DialogHeader>
        <DialogBody 
          placeholder={null}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
          className="max-h-[70vh] overflow-auto"
        >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {selectedArticle?.keywords.map((keyword, index) => (
                <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {keyword}
                </Badge>
              ))}
            </div>
            
            <div className="border-t border-b py-3 my-3 flex justify-between items-center text-sm text-blue-gray-600">
              <div>Campaign: {selectedArticle?.campaignName}</div>
              <div>Type: {selectedArticle?.articleType || 'SEO'}</div>
              <StatusBadge status={selectedArticle?.status || 'completed'} />
            </div>
            
            <Typography 
              variant="paragraph"
              className="whitespace-pre-line"
              placeholder={null}
              onPointerEnterCapture={() => {}}
              onPointerLeaveCapture={() => {}}
            >
              {selectedArticle?.content || 'No content available yet.'}
            </Typography>
          </div>
        </DialogBody>
      </Dialog>
    </DashboardLayout>
  );
};

export default ActivityFeed;
