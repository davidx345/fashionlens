
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Shirt, FolderKanban, Lightbulb, Activity, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import dashboardService, { AnalyticsData, RecentActivity, StyleTrendData } from "@/app/api/services/dashboard-service";

// Placeholder for chart component - you'd replace this with an actual chart library
const PlaceholderChart = ({data}: {data: StyleTrendData[]}) => (
  <div className="w-full h-64 bg-muted/50 rounded-lg flex items-center justify-center text-sm text-muted-foreground">
    {data.length > 0 ? (
      <div className="text-center">
        <p>Style Trend Data Available</p>
        <p className="text-xs mt-1">
          {data.length} months of data • Avg Score: {data.reduce((acc, item) => acc + item.score, 0) / data.length}
        </p>
      </div>
    ) : (
      <p>No trend data available yet</p>
    )}
  </div>
);

// Helper function to get activity icon
const getActivityIcon = (type: string) => {
  switch (type) {
    case 'analysis':
      return Shirt;
    case 'wardrobe':
      return FolderKanban;
    case 'profile':
      return Users;
    default:
      return Activity;
  }
};

const quickActions = [
  { label: "Analyze New Outfit", href: "/dashboard/outfit-analyzer", icon: Shirt },
  { label: "Add to Wardrobe", href: "/dashboard/wardrobe?action=add", icon: FolderKanban }, 
  { label: "View Recommendations", href: "/dashboard/recommendations", icon: Lightbulb },
];

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [styleTrends, setStyleTrends] = useState<StyleTrendData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch all dashboard data in parallel
        const [analyticsData, activityData, trendsData] = await Promise.all([
          dashboardService.getAnalytics(),
          dashboardService.getRecentActivity(),
          dashboardService.getStyleTrends()
        ]);

        setAnalytics(analyticsData);
        setRecentActivity(activityData);
        setStyleTrends(trendsData);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Create analytics array from real data
  const analyticsData = analytics ? [
    { 
      title: "Total Outfits Analyzed", 
      value: analytics.totalAnalyses.value.toString(), 
      trend: analytics.totalAnalyses.trend, 
      icon: Shirt, 
      iconColor: "text-blue-500" 
    },
    { 
      title: "Wardrobe Items", 
      value: analytics.wardrobeItems.value.toString(), 
      trend: analytics.wardrobeItems.trend, 
      icon: FolderKanban, 
      iconColor: "text-green-500" 
    },
    { 
      title: "Recommendations Viewed", 
      value: analytics.recommendationsViewed.value.toString(), 
      trend: analytics.recommendationsViewed.trend, 
      icon: Lightbulb, 
      iconColor: "text-yellow-500" 
    },
    { 
      title: "Style Score Average", 
      value: analytics.styleScoreAverage.value, 
      trend: analytics.styleScoreAverage.trend, 
      icon: Activity, 
      iconColor: "text-purple-500" 
    },
  ] : [];

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold md:text-3xl">Dashboard Overview</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold md:text-3xl">Dashboard Overview</h1>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-destructive">Error: {error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
              variant="outline"
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold md:text-3xl">Dashboard Overview</h1>
        <Button asChild className="hidden sm:flex">
          <Link href="/dashboard/outfit-analyzer">Analyze Outfit <ArrowUpRight className="ml-2 h-4 w-4" /></Link>
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {analyticsData.map((item, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <item.icon className={`h-5 w-5 ${item.iconColor}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{item.value}</div>
              <p className="text-xs text-muted-foreground">{item.trend} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="lg:col-span-1 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Get started with common tasks.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            {quickActions.map((action, index) => (
              <Button key={index} variant="outline" className="w-full justify-start" asChild>
                <Link href={action.href}>
                  <action.icon className="mr-2 h-4 w-4" />
                  {action.label}
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2 hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>What you&apos;ve been up to lately.</CardDescription>          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => {
                  const ActivityIcon = getActivityIcon(activity.type);
                  return (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 pt-1">
                        <ActivityIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </li>
                  );
                })
              ) : (
                <li className="text-center py-8 text-muted-foreground">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No recent activity</p>
                  <p className="text-xs mt-1">Start analyzing outfits to see activity here</p>
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>      {/* Style Trends Chart */}
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader>
          <CardTitle>Style Trends</CardTitle>
          <CardDescription>Your outfit analysis scores over time.</CardDescription>
        </CardHeader>
        <CardContent>
          <PlaceholderChart data={styleTrends} />
        </CardContent>
      </Card>

    </div>
  );
}
