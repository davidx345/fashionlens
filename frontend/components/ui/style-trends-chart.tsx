"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Calendar } from "lucide-react";
import { StyleTrendData } from "@/app/api/services/dashboard-service";

interface StyleTrendsChartProps {
  data: StyleTrendData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-3 min-w-[140px]">
        <p className="font-medium text-foreground mb-1">{label}</p>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
          <span className="text-sm text-muted-foreground">Style Score:</span>
          <span className="font-semibold text-primary">{payload[0].value}/10</span>
        </div>
      </div>
    );
  }
  return null;
};

export function StyleTrendsChart({ data }: StyleTrendsChartProps) {
  // Format data for chart - backend already provides formatted month names
  const chartData = data.map(item => ({
    ...item,
    formattedMonth: item.name, // Use the already formatted month name from backend
    score: Number(item.score.toFixed(1))
  }));

  // Calculate trend
  const averageScore = data.length > 0 ? data.reduce((acc, item) => acc + item.score, 0) / data.length : 0;
  const isImproving = data.length >= 2 && data[data.length - 1].score > data[data.length - 2].score;
  const trendPercentage = data.length >= 2 
    ? ((data[data.length - 1].score - data[0].score) / data[0].score * 100)
    : 0;

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl font-semibold">Style Trends</CardTitle>
          <CardDescription>Your outfit analysis scores over time</CardDescription>
        </div>
        <div className="flex items-center gap-2 text-sm">
          {data.length > 0 && (
            <>
              <div className={`flex items-center gap-1 ${isImproving ? 'text-green-600' : 'text-red-500'}`}>
                <TrendingUp className={`h-4 w-4 ${!isImproving ? 'rotate-180' : ''}`} />
                <span className="font-medium">
                  {trendPercentage >= 0 ? '+' : ''}{trendPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="text-muted-foreground">
                Avg: {averageScore.toFixed(1)}/10
              </div>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 20,
                }}
              >
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#8b5cf6"/>
                    <stop offset="50%" stopColor="#ec4899"/>
                    <stop offset="100%" stopColor="#f97316"/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="hsl(var(--border))" 
                  opacity={0.3}
                />
                <XAxis 
                  dataKey="formattedMonth"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 10]}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="url(#lineGradient)"
                  strokeWidth={3}
                  fill="url(#scoreGradient)"
                  dot={{
                    fill: "hsl(var(--primary))",
                    stroke: "hsl(var(--background))",
                    strokeWidth: 2,
                    r: 5
                  }}
                  activeDot={{
                    r: 7,
                    fill: "hsl(var(--primary))",
                    stroke: "hsl(var(--background))",
                    strokeWidth: 3
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 w-full flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-lg mb-1">No trend data yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Start analyzing your outfits to see your style trends over time. 
                Your scores will appear here as you use the outfit analyzer.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
