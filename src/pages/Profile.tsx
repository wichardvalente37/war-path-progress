import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  User,
  Flame,
  Award,
  TrendingUp,
  Target,
  Calendar,
  Settings,
  Zap,
} from "lucide-react";

const Profile = () => {
  const profile = {
    name: "Warrior",
    level: 12,
    xp: 2340,
    xpToNextLevel: 3000,
    totalXp: 15340,
    rank: "Elite Soldier",
    joinDate: "Jan 2025",
    stats: {
      totalMissions: 156,
      completed: 142,
      failed: 8,
      streak: 23,
      bestStreak: 45,
      totalDays: 67,
      disciplineScore: 92,
    },
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <User className="w-6 h-6 text-primary" />
          Profile
        </h1>
        <Button variant="outline">
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
      </div>

      {/* Profile Header */}
      <Card className="p-6 bg-gradient-to-br from-card to-muted/20">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-war flex items-center justify-center shadow-glow-war">
            <User className="w-12 h-12 text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Member since {profile.joinDate}
                </p>
              </div>
              <Badge className="bg-gradient-elite border-0 text-black font-bold px-4 py-2">
                {profile.rank}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Level {profile.level}</span>
                <span className="font-medium">
                  {profile.xp} / {profile.xpToNextLevel} XP
                </span>
              </div>
              <Progress
                value={(profile.xp / profile.xpToNextLevel) * 100}
                className="h-3"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Key Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-gradient-war border-0 shadow-glow-war">
          <div className="flex items-center gap-3">
            <Flame className="w-8 h-8 text-white" />
            <div>
              <p className="text-xs text-white/80">Current Streak</p>
              <p className="text-2xl font-bold text-white">{profile.stats.streak} days</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-elite border-0 shadow-glow-gold">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-black" />
            <div>
              <p className="text-xs text-black/80">Total XP</p>
              <p className="text-2xl font-bold text-black">{profile.totalXp.toLocaleString()}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Stats */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Statistics
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium">Total Missions</span>
            </div>
            <span className="text-lg font-bold">{profile.stats.totalMissions}</span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-success" />
              <span className="text-sm font-medium">Completed</span>
            </div>
            <span className="text-lg font-bold text-success">{profile.stats.completed}</span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <Flame className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Best Streak</span>
            </div>
            <span className="text-lg font-bold">{profile.stats.bestStreak} days</span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium">Total Active Days</span>
            </div>
            <span className="text-lg font-bold">{profile.stats.totalDays}</span>
          </div>

          <div className="pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Discipline Score</span>
              <span className="text-lg font-bold text-primary">{profile.stats.disciplineScore}%</span>
            </div>
            <Progress value={profile.stats.disciplineScore} className="h-3" />
          </div>
        </div>
      </Card>

      {/* Performance Breakdown */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Mission Success Rate</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Completed</span>
            <span className="text-sm font-medium text-success">
              {Math.round((profile.stats.completed / profile.stats.totalMissions) * 100)}%
            </span>
          </div>
          <Progress
            value={(profile.stats.completed / profile.stats.totalMissions) * 100}
            className="h-2 bg-muted [&>div]:bg-success"
          />
          
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">Failed</span>
            <span className="text-sm font-medium text-destructive">
              {Math.round((profile.stats.failed / profile.stats.totalMissions) * 100)}%
            </span>
          </div>
          <Progress
            value={(profile.stats.failed / profile.stats.totalMissions) * 100}
            className="h-2 bg-muted [&>div]:bg-destructive"
          />
        </div>
      </Card>
    </div>
  );
};

export default Profile;
