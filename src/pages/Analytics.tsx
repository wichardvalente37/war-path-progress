import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Calendar, Filter, Target, Flame, Award, Zap } from "lucide-react";
import { useState } from "react";

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("7days");
  const [category, setCategory] = useState("all");

  // Mock data
  const weeklyData = [
    { day: "Mon", completed: 8, total: 10 },
    { day: "Tue", completed: 9, total: 10 },
    { day: "Wed", completed: 7, total: 10 },
    { day: "Thu", completed: 10, total: 10 },
    { day: "Fri", completed: 8, total: 10 },
    { day: "Sat", completed: 6, total: 10 },
    { day: "Sun", completed: 9, total: 10 },
  ];

  const categoryStats = [
    { name: "Fitness", completed: 45, total: 50, xp: 2250, color: "text-war-orange" },
    { name: "Learning", completed: 38, total: 45, xp: 1520, color: "text-cyber" },
    { name: "Health", completed: 42, total: 45, xp: 1680, color: "text-success" },
    { name: "Productivity", completed: 35, total: 40, xp: 1400, color: "text-gold" },
  ];

  const streakData = {
    current: 23,
    longest: 45,
    total: 156,
    thisMonth: 18,
  };

  const performanceMetrics = {
    completionRate: 87,
    avgDailyXP: 245,
    totalMissions: 156,
    disciplineScore: 92,
  };

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            Analytics Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Deep dive into your performance and progress
          </p>
        </div>
        <Button variant="outline" className="border-primary/30">
          <Filter className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-muted-foreground mb-2 block">Time Range</label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="text-xs text-muted-foreground mb-2 block">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="fitness">Fitness</SelectItem>
                <SelectItem value="learning">Learning</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="productivity">Productivity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-war border-0 shadow-glow-war">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/80">Completion Rate</p>
              <p className="text-2xl font-bold text-white">{performanceMetrics.completionRate}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-elite border-0 shadow-glow-gold">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-black/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-black" />
            </div>
            <div>
              <p className="text-xs text-black/80">Avg Daily XP</p>
              <p className="text-2xl font-bold text-black">{performanceMetrics.avgDailyXP}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-success border-0 shadow-glow-success">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/80">Total Missions</p>
              <p className="text-2xl font-bold text-white">{performanceMetrics.totalMissions}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-cyber border-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/80">Discipline</p>
              <p className="text-2xl font-bold text-white">{performanceMetrics.disciplineScore}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs for Different Views */}
      <Tabs defaultValue="weekly" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weekly">Weekly Overview</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="streaks">Streaks & Consistency</TabsTrigger>
        </TabsList>

        {/* Weekly Overview */}
        <TabsContent value="weekly" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Weekly Performance
            </h3>
            <div className="space-y-4">
              {weeklyData.map((day) => (
                <div key={day.day}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{day.day}</span>
                    <span className="text-muted-foreground">
                      {day.completed}/{day.total} missions
                    </span>
                  </div>
                  <Progress 
                    value={(day.completed / day.total) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Weekly Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Total Completed</p>
                <p className="text-2xl font-bold text-success">57</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Total Failed</p>
                <p className="text-2xl font-bold text-destructive">13</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">XP Gained</p>
                <p className="text-2xl font-bold text-gold">1,715</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground">Avg Completion</p>
                <p className="text-2xl font-bold text-cyber">81%</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Category Breakdown */}
        <TabsContent value="categories" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Performance by Category</h3>
            <div className="space-y-6">
              {categoryStats.map((cat) => (
                <div key={cat.name}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-bold ${cat.color}`}>{cat.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {cat.completed}/{cat.total}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {cat.xp} XP
                    </span>
                  </div>
                  <Progress 
                    value={(cat.completed / cat.total) * 100} 
                    className="h-3"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round((cat.completed / cat.total) * 100)}% completion rate
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Top Performing Categories</h3>
            <div className="space-y-3">
              {categoryStats
                .sort((a, b) => (b.completed / b.total) - (a.completed / a.total))
                .map((cat, idx) => (
                  <div key={cat.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${
                        idx === 0 ? "bg-gold/20" : 
                        idx === 1 ? "bg-muted" : 
                        "bg-muted/50"
                      } flex items-center justify-center`}>
                        <span className="font-bold text-sm">#{idx + 1}</span>
                      </div>
                      <span className="font-medium">{cat.name}</span>
                    </div>
                    <span className={`font-bold ${cat.color}`}>
                      {Math.round((cat.completed / cat.total) * 100)}%
                    </span>
                  </div>
                ))}
            </div>
          </Card>
        </TabsContent>

        {/* Streaks & Consistency */}
        <TabsContent value="streaks" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-6 bg-gradient-war border-0 shadow-glow-war">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/80 mb-1">Current Streak</p>
                  <p className="text-4xl font-bold text-white">{streakData.current} days</p>
                </div>
                <Flame className="w-12 h-12 text-white/80" />
              </div>
            </Card>

            <Card className="p-6 bg-gradient-elite border-0 shadow-glow-gold">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-black/80 mb-1">Longest Streak</p>
                  <p className="text-4xl font-bold text-black">{streakData.longest} days</p>
                </div>
                <Award className="w-12 h-12 text-black/80" />
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Streak Statistics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Days Active This Month</span>
                  <span className="font-medium">{streakData.thisMonth}/30</span>
                </div>
                <Progress value={(streakData.thisMonth / 30) * 100} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Total Active Days</span>
                  <span className="font-medium">{streakData.total} days</span>
                </div>
                <Progress value={75} className="[&>div]:bg-success" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Consistency Heatmap</h3>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 28 }).map((_, i) => {
                const intensity = Math.random();
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-sm ${
                      intensity > 0.75 ? "bg-success" :
                      intensity > 0.5 ? "bg-success/70" :
                      intensity > 0.25 ? "bg-success/40" :
                      "bg-muted"
                    }`}
                    title={`Day ${i + 1}`}
                  />
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Last 4 weeks activity - Darker = More missions completed
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
