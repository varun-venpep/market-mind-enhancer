import { useState } from "react";
import DashboardLayout from "@/components/Dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, ChevronDown, Download, Filter, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area
} from "recharts";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export const Analytics = () => {
  const [dateRange, setDateRange] = useState("30d");
  const [currentTab, setCurrentTab] = useState("performance");

  // Mock data for charts
  const performanceData = [
    { name: "Jan", score: 65, volume: 2100 },
    { name: "Feb", score: 68, volume: 2300 },
    { name: "Mar", score: 71, volume: 2500 },
    { name: "Apr", score: 73, volume: 2400 },
    { name: "May", score: 75, volume: 2600 },
    { name: "Jun", score: 78, volume: 2800 },
    { name: "Jul", score: 82, volume: 3100 },
    { name: "Aug", score: 85, volume: 3300 },
    { name: "Sep", score: 87, volume: 3400 },
    { name: "Oct", score: 89, volume: 3600 },
    { name: "Nov", score: 92, volume: 3800 },
    { name: "Dec", score: 94, volume: 4000 }
  ];

  const keywordData = [
    { name: "AI search", value: 35 },
    { name: "Content optimization", value: 25 },
    { name: "SEO strategy", value: 20 },
    { name: "Voice search", value: 15 },
    { name: "Other", value: 5 }
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  const contentData = [
    { name: "Blog Posts", completed: 32, inProgress: 12, draft: 8 },
    { name: "Product Pages", completed: 18, inProgress: 6, draft: 4 },
    { name: "Landing Pages", completed: 12, inProgress: 3, draft: 2 },
    { name: "Case Studies", completed: 8, inProgress: 4, draft: 6 },
    { name: "Guides", completed: 5, inProgress: 2, draft: 3 }
  ];

  const topPerformingContent = [
    { 
      title: "How to Optimize Content for AI Search Engines", 
      score: 94,
      views: 12580,
      conversion: 3.8
    },
    { 
      title: "Complete Guide to Voice Search Optimization", 
      score: 92,
      views: 10250,
      conversion: 4.2
    },
    { 
      title: "E-commerce SEO Best Practices for 2023", 
      score: 89,
      views: 9870,
      conversion: 3.5
    },
    { 
      title: "Content Marketing Strategy for B2B Companies", 
      score: 87,
      views: 8650,
      conversion: 2.9
    },
    { 
      title: "Local SEO Guide for Small Businesses", 
      score: 85,
      views: 7890,
      conversion: 3.1
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Analytics</h1>
              <p className="text-muted-foreground">Track your content performance and optimization metrics</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <Button variant="outline" className="w-full md:w-auto justify-between">
                <span>Last {dateRange === "7d" ? "7 days" : dateRange === "30d" ? "30 days" : "12 months"}</span>
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="w-full md:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Average Content Score", value: "84/100", change: "+12%", changeType: "positive" },
              { title: "Completed Briefs", value: "75", change: "+8", changeType: "positive" },
              { title: "Total Keywords Tracked", value: "312", change: "+45", changeType: "positive" },
              { title: "Avg. Search Volume", value: "3,240", change: "-5%", changeType: "negative" }
            ].map((stat, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className={stat.changeType === "positive" ? "text-green-500" : "text-red-500"}>
                      {stat.change}
                    </span>
                    {" from previous period"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>
            
            <TabsContent value="performance" className="space-y-6">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Content Score Trends</CardTitle>
                  <CardDescription>Average content score over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={performanceData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#0284c7" 
                        activeDot={{ r: 8 }} 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-2">
                  <CardHeader>
                    <CardTitle>Search Volume Trends</CardTitle>
                    <CardDescription>Monthly search volume for tracked keywords</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={performanceData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Area 
                          type="monotone" 
                          dataKey="volume" 
                          stroke="#0284c7" 
                          fill="#0ea5e9" 
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Content</CardTitle>
                    <CardDescription>Highest score content pieces</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topPerformingContent.slice(0, 3).map((content, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium line-clamp-1">{content.title}</span>
                            <Badge>{content.score}</Badge>
                          </div>
                          <Progress value={content.score} className="h-1.5" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{content.views.toLocaleString()} views</span>
                            <span>{content.conversion}% conversion</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="keywords" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Keyword Performance</CardTitle>
                    <CardDescription>Search volume and difficulty metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { keyword: "AI search engines", volume: 4800, difficulty: 65 },
                          { keyword: "Content optimization", volume: 3600, difficulty: 58 },
                          { keyword: "SEO strategy", volume: 5200, difficulty: 72 },
                          { keyword: "Voice search", volume: 2900, difficulty: 45 },
                          { keyword: "E-commerce SEO", volume: 4100, difficulty: 62 }
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="keyword" angle={-45} textAnchor="end" height={70} />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="volume" fill="#8884d8" name="Search Volume" />
                        <Bar yAxisId="right" dataKey="difficulty" fill="#82ca9d" name="Difficulty" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Keyword Distribution</CardTitle>
                    <CardDescription>By search intent category</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={keywordData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {keywordData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Keyword Trends</CardTitle>
                  <CardDescription>Search volume changes over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: "Jan", aiSearch: 2500, contentOpt: 1800, seoStrategy: 3200 },
                        { month: "Feb", aiSearch: 2700, contentOpt: 1900, seoStrategy: 3300 },
                        { month: "Mar", aiSearch: 3000, contentOpt: 2100, seoStrategy: 3400 },
                        { month: "Apr", aiSearch: 3200, contentOpt: 2300, seoStrategy: 3350 },
                        { month: "May", aiSearch: 3500, contentOpt: 2500, seoStrategy: 3400 },
                        { month: "Jun", aiSearch: 3800, contentOpt: 2700, seoStrategy: 3500 },
                        { month: "Jul", aiSearch: 4100, contentOpt: 2900, seoStrategy: 3600 },
                        { month: "Aug", aiSearch: 4400, contentOpt: 3100, seoStrategy: 3700 },
                        { month: "Sep", aiSearch: 4600, contentOpt: 3300, seoStrategy: 3800 },
                        { month: "Oct", aiSearch: 4800, contentOpt: 3600, seoStrategy: 4000 },
                        { month: "Nov", aiSearch: 5000, contentOpt: 3800, seoStrategy: 4200 },
                        { month: "Dec", aiSearch: 5200, contentOpt: 4000, seoStrategy: 4400 }
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="aiSearch" stroke="#8884d8" name="AI Search" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="contentOpt" stroke="#82ca9d" name="Content Optimization" />
                      <Line type="monotone" dataKey="seoStrategy" stroke="#ffc658" name="SEO Strategy" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content Performance by Type</CardTitle>
                  <CardDescription>Number of briefs by status and content type</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={contentData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completed" stackId="a" fill="#10b981" name="Completed" />
                      <Bar dataKey="inProgress" stackId="a" fill="#f59e0b" name="In Progress" />
                      <Bar dataKey="draft" stackId="a" fill="#6b7280" name="Draft" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Content Score Distribution</CardTitle>
                    <CardDescription>Distribution of content scores across all briefs</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "90-100", value: 15, label: "Excellent" },
                            { name: "80-89", value: 30, label: "Good" },
                            { name: "70-79", value: 35, label: "Average" },
                            { name: "60-69", value: 15, label: "Below Average" },
                            { name: "Below 60", value: 5, label: "Poor" }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {[
                            "#10b981", // Excellent - green
                            "#34d399", // Good - light green
                            "#f59e0b", // Average - amber
                            "#f97316", // Below average - orange 
                            "#ef4444"  // Poor - red
                          ].map((color, index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Content</CardTitle>
                    <CardDescription>Content with highest performance scores</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topPerformingContent.map((content, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium line-clamp-1">{content.title}</span>
                            <Badge className={
                              content.score >= 90 ? "bg-green-500" :
                              content.score >= 80 ? "bg-green-400" :
                              content.score >= 70 ? "bg-amber-500" :
                              "bg-red-500"
                            }>
                              {content.score}
                            </Badge>
                          </div>
                          <Progress 
                            value={content.score} 
                            className={
                              content.score >= 90 ? "h-1.5 bg-secondary [&>div]:bg-green-500" :
                              content.score >= 80 ? "h-1.5 bg-secondary [&>div]:bg-green-400" :
                              content.score >= 70 ? "h-1.5 bg-secondary [&>div]:bg-amber-500" :
                              "h-1.5 bg-secondary [&>div]:bg-red-500"
                            }
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{content.views.toLocaleString()} views</span>
                            <span>{content.conversion}% conversion</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};
