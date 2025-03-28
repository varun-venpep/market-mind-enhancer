
import { useState } from "react";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Award, 
  BarChart, 
  Calendar, 
  Clock, 
  FileText, 
  Flag, 
  Lightbulb, 
  Search,
  Star, 
  Target, 
  TrendingUp, 
  Upload,
  Users
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock data
  const userProfile = {
    name: "John Doe",
    email: user?.email || "john.doe@example.com",
    role: "Marketing Manager",
    company: "Acme Inc.",
    plan: "Pro",
    joined: "June 12, 2022",
    avatar: null,
    stats: {
      contentScore: 86,
      completedBriefs: 48,
      activeKeywords: 124,
      totalSearches: 376
    },
    recentActivity: [
      { 
        type: "brief", 
        action: "created", 
        title: "How to optimize content for AI search engines", 
        date: "June 2, 2023" 
      },
      { 
        type: "keyword", 
        action: "researched", 
        title: "voice search optimization", 
        date: "June 1, 2023" 
      },
      { 
        type: "brief", 
        action: "updated", 
        title: "E-commerce SEO best practices for 2023", 
        date: "May 29, 2023" 
      },
      { 
        type: "brief", 
        action: "completed", 
        title: "Content marketing strategies for B2B companies", 
        date: "May 25, 2023" 
      },
      { 
        type: "keyword", 
        action: "researched", 
        title: "AI content detection", 
        date: "May 22, 2023" 
      }
    ],
    achievements: [
      { 
        title: "Content Master", 
        description: "Created 20+ content briefs", 
        progress: 100, 
        date: "May 15, 2023",
        icon: FileText
      },
      { 
        title: "Keyword Expert", 
        description: "Tracked 100+ keywords", 
        progress: 100, 
        date: "April 10, 2023",
        icon: Target
      },
      { 
        title: "Optimization Guru", 
        description: "Achieved 90+ content score", 
        progress: 78, 
        date: null,
        icon: TrendingUp
      },
      { 
        title: "Research Pro", 
        description: "Completed 200 keyword searches", 
        progress: 94, 
        date: null,
        icon: Lightbulb
      }
    ],
    topPerforming: [
      {
        title: "How to Optimize Content for AI Search Engines",
        score: 94,
        date: "May 10, 2023"
      },
      {
        title: "Voice Search Optimization Guide 2023",
        score: 92,
        date: "April 22, 2023"
      },
      {
        title: "E-commerce SEO Best Practices",
        score: 89,
        date: "March 15, 2023"
      }
    ]
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto w-full">
        <div className="flex flex-col gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="relative group">
                  <Avatar className="h-24 w-24 border-2 border-muted">
                    <AvatarImage src={userProfile.avatar || undefined} />
                    <AvatarFallback className="text-2xl">
                      {userProfile.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Upload className="h-5 w-5 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h1 className="text-2xl font-bold">{userProfile.name}</h1>
                    <Badge className="w-fit bg-brand-500">{userProfile.plan} Plan</Badge>
                  </div>
                  <div className="text-muted-foreground space-y-1">
                    <p>{userProfile.email}</p>
                    <p>{userProfile.role} at {userProfile.company}</p>
                    <p className="flex items-center text-sm">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      Joined {userProfile.joined}
                    </p>
                  </div>
                </div>
                
                <div>
                  <Button variant="outline">Edit Profile</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Average Content Score</p>
                    <BarChart className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold">{userProfile.stats.contentScore}<span className="text-sm font-normal text-muted-foreground">/100</span></p>
                  <Progress value={userProfile.stats.contentScore} className="h-1" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Completed Briefs</p>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold">{userProfile.stats.completedBriefs}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Active Keywords</p>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold">{userProfile.stats.activeKeywords}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">Total Searches</p>
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold">{userProfile.stats.totalSearches}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Content</CardTitle>
                  <CardDescription>Your highest scoring content briefs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userProfile.topPerforming.map((content, i) => (
                      <div key={i} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div className="space-y-1">
                          <p className="font-medium">{content.title}</p>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            {content.date}
                          </p>
                        </div>
                        <Badge className={
                          content.score >= 90 ? "bg-green-500" :
                          content.score >= 80 ? "bg-amber-500" :
                          "bg-red-500"
                        }>
                          {content.score}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button variant="outline" className="w-full">View All Content</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest actions and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userProfile.recentActivity.slice(0, 3).map((activity, i) => (
                      <div key={i} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                        <div className={`rounded-full p-2 ${
                          activity.type === 'brief' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {activity.type === 'brief' ? (
                            <FileText className="h-4 w-4" />
                          ) : (
                            <Target className="h-4 w-4" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">
                            {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}{' '}
                            {activity.type === 'brief' ? 'content brief' : 'keyword research'}
                          </p>
                          <p className="text-sm">{activity.title}</p>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            {activity.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <Button variant="outline" className="w-full">View All Activity</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Timeline</CardTitle>
                  <CardDescription>Your recent actions and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userProfile.recentActivity.map((activity, i) => (
                      <div key={i} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                        <div className={`rounded-full p-2 ${
                          activity.type === 'brief' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {activity.type === 'brief' ? (
                            <FileText className="h-4 w-4" />
                          ) : (
                            <Target className="h-4 w-4" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">
                            {activity.action.charAt(0).toUpperCase() + activity.action.slice(1)}{' '}
                            {activity.type === 'brief' ? 'content brief' : 'keyword research'}
                          </p>
                          <p className="text-sm">{activity.title}</p>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            {activity.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="achievements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Your Achievements</CardTitle>
                  <CardDescription>Milestones and recognition</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    {userProfile.achievements.map((achievement, i) => (
                      <Card key={i} className={`overflow-hidden ${achievement.progress === 100 ? 'border-brand-200' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex flex-col">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`rounded-full p-2 ${achievement.progress === 100 ? 'bg-brand-100 text-brand-700' : 'bg-muted'}`}>
                                  {achievement.progress === 100 ? (
                                    <Award className="h-4 w-4" />
                                  ) : (
                                    <achievement.icon className="h-4 w-4" />
                                  )}
                                </div>
                                <div>
                                  <h3 className="font-medium">{achievement.title}</h3>
                                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                                </div>
                              </div>
                              {achievement.progress === 100 && (
                                <Badge className="bg-brand-500">Complete</Badge>
                              )}
                            </div>
                            
                            <div className="mt-3">
                              <div className="flex justify-between text-xs mb-1">
                                <span>Progress</span>
                                <span>{achievement.progress}%</span>
                              </div>
                              <Progress value={achievement.progress} className="h-1.5" />
                            </div>
                            
                            {achievement.date && (
                              <p className="text-xs text-muted-foreground mt-3 flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                Achieved on {achievement.date}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Achievements</CardTitle>
                  <CardDescription>Your next milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { 
                        title: "Collaboration Champion", 
                        description: "Share 10 content briefs with team members", 
                        progress: 50,
                        goal: "5/10 shared",
                        icon: Users
                      },
                      { 
                        title: "Power User", 
                        description: "Use the platform for 30 consecutive days", 
                        progress: 70,
                        goal: "21/30 days",
                        icon: Flag
                      },
                      { 
                        title: "AI Master", 
                        description: "Create 5 briefs with 90+ AI optimization score", 
                        progress: 40,
                        goal: "2/5 briefs",
                        icon: Lightbulb
                      }
                    ].map((achievement, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-lg border">
                        <div className="rounded-full bg-muted p-2">
                          <achievement.icon className="h-4 w-4" />
                        </div>
                        <div className="space-y-2 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{achievement.title}</h3>
                              <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            </div>
                            <Badge variant="outline">{achievement.goal}</Badge>
                          </div>
                          <Progress value={achievement.progress} className="h-1.5" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};
