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
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { t } from "@/lib/i18n";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch profile
      const profileData = await api.getProfile();
      setProfile(profileData);

      // Fetch missions
      const missionsData: any = await api.getMissions();
      setMissions(missionsData || []);
    } catch (error: any) {
      toast({
        title: t("error"),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">{t("loading")}</div>;
  }

  // Calculate streak
  const calculateStreak = () => {
    const sortedMissions = [...missions].sort((a, b) => 
      new Date(b.due_date).getTime() - new Date(a.due_date).getTime()
    );
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 365; i++) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const dayMissions = sortedMissions.filter(m => m.due_date === dateStr);
      const hasCompleted = dayMissions.some(m => m.status === "completed");
      
      if (hasCompleted) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (i > 0) {
        break;
      } else {
        currentDate.setDate(currentDate.getDate() - 1);
      }
    }
    
    return streak;
  };

  const finalisedMissions = missions.filter(m => m.status === "completed" || m.status === "failed");
  
  const stats = {
    totalMissions: missions.length,
    completed: missions.filter(m => m.status === "completed").length,
    failed: missions.filter(m => m.status === "failed").length,
    streak: calculateStreak(),
    bestStreak: calculateStreak(), // For now, same as current
    totalDays: new Set(missions.filter(m => m.status === "completed").map(m => m.due_date)).size,
    disciplineScore: finalisedMissions.length > 0 ? Math.round((missions.filter(m => m.status === "completed").length / finalisedMissions.length) * 100) : 0,
  };

  // Calculate rank based on level and XP
  const getRank = () => {
    const level = profile?.level || 1;
    const completed = stats.completed;
    
    if (level >= 20 || completed >= 200) return "Legendary Warrior";
    if (level >= 15 || completed >= 150) return "Elite Commander";
    if (level >= 10 || completed >= 100) return "Elite Soldier";
    if (level >= 7 || completed >= 50) return "Veteran Fighter";
    if (level >= 5 || completed >= 25) return "Skilled Warrior";
    if (level >= 3 || completed >= 10) return "Rising Soldier";
    return "Rookie";
  };
  
  const profileData = {
    name: profile?.username || "Warrior",
    level: profile?.level || 1,
    xp: profile?.xp || 0,
    xpToNextLevel: ((profile?.level || 1) * 100),
    totalXp: profile?.xp || 0,
    rank: getRank(),
    joinDate: new Date(profile?.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
    stats,
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
                <h2 className="text-2xl font-bold">{profileData.name}</h2>
                <p className="text-sm text-muted-foreground">
                  Member since {profileData.joinDate}
                </p>
              </div>
              <Badge className="bg-gradient-elite border-0 text-black font-bold px-4 py-2">
                {profileData.rank}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Level {profileData.level}</span>
                <span className="font-medium">
                  {profileData.xp} / {profileData.xpToNextLevel} XP
                </span>
              </div>
              <Progress
                value={(profileData.xp / profileData.xpToNextLevel) * 100}
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
              <p className="text-2xl font-bold text-white">{stats.streak} days</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-elite border-0 shadow-glow-gold">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-black" />
            <div>
              <p className="text-xs text-black/80">Total XP</p>
              <p className="text-2xl font-bold text-black">{profileData.totalXp.toLocaleString()}</p>
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
            <span className="text-lg font-bold">{stats.totalMissions}</span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-success" />
              <span className="text-sm font-medium">Completed</span>
            </div>
            <span className="text-lg font-bold text-success">{stats.completed}</span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <Flame className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Best Streak</span>
            </div>
            <span className="text-lg font-bold">{stats.bestStreak} days</span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-medium">Total Active Days</span>
            </div>
            <span className="text-lg font-bold">{stats.totalDays}</span>
          </div>

          <div className="pt-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Discipline Score</span>
              <span className="text-lg font-bold text-primary">{stats.disciplineScore}%</span>
            </div>
            <Progress value={stats.disciplineScore} className="h-3" />
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
              {stats.totalMissions > 0 ? Math.round((stats.completed / stats.totalMissions) * 100) : 0}%
            </span>
          </div>
          <Progress
            value={stats.totalMissions > 0 ? (stats.completed / stats.totalMissions) * 100 : 0}
            className="h-2 bg-muted [&>div]:bg-success"
          />
          
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm text-muted-foreground">Failed</span>
            <span className="text-sm font-medium text-destructive">
              {stats.totalMissions > 0 ? Math.round((stats.failed / stats.totalMissions) * 100) : 0}%
            </span>
          </div>
          <Progress
            value={stats.totalMissions > 0 ? (stats.failed / stats.totalMissions) * 100 : 0}
            className="h-2 bg-muted [&>div]:bg-destructive"
          />
        </div>
      </Card>
    </div>
  );
};

export default Profile;
