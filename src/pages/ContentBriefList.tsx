
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, Search, FileText } from "lucide-react";
import { ContentBriefCard } from "@/components/Dashboard/ContentBriefCard";
import { ContentBriefSkeleton } from "@/components/Dashboard/ContentBriefSkeleton";
import { ContentBrief } from '@/types';

const ContentBriefList = () => {
  const navigate = useNavigate();
  const [briefs, setBriefs] = useState<ContentBrief[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulate loading content briefs from an API
    setIsLoading(true);
    const timer = setTimeout(() => {
      const dummyBriefs: ContentBrief[] = [
        {
          id: '1',
          title: 'SEO Guide for 2025',
          keywords: ['SEO', 'search optimization', 'ranking'],
          status: 'published',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          score: 92,
          wordCount: 2500,
          searchVolume: 5800,
          difficulty: 65,
          aiPotential: 87
        },
        {
          id: '2',
          title: 'Content Marketing Strategies',
          keywords: ['content marketing', 'strategies', 'digital marketing'],
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          score: 78,
          wordCount: 1800,
          searchVolume: 4200,
          difficulty: 45,
          aiPotential: 92
        }
      ];
      setBriefs(dummyBriefs);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredBriefs = briefs.filter(brief => 
    brief.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    brief.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold gradient-text">Content Briefs</h1>
              <p className="text-muted-foreground mt-1">
                Manage and create SEO-optimized content briefs
              </p>
            </div>
            <Button 
              className="gradient-button mt-4 md:mt-0"
              onClick={() => navigate('/dashboard/content-brief-editor')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Brief
            </Button>
          </div>
          
          <div className="relative w-full max-w-md mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search briefs..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <ContentBriefSkeleton key={i} />
              ))}
            </div>
          ) : filteredBriefs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBriefs.map((brief) => (
                <ContentBriefCard 
                  key={brief.id} 
                  brief={brief} 
                  onClick={() => navigate(`/dashboard/content-brief/${brief.id}`)}
                />
              ))}
            </div>
          ) : (
            <Card className="p-10 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">No briefs found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm 
                    ? `No briefs match "${searchTerm}". Try a different search term.`
                    : "You haven't created any content briefs yet. Create your first brief to get started."}
                </p>
                <Button 
                  className="gradient-button"
                  onClick={() => navigate('/dashboard/content-brief-editor')}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Brief
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ContentBriefList;
