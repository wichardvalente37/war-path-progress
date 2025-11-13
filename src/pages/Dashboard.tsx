import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Flame, Target, Zap, Award, TrendingUp, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { t } from "@/lib/i18n";
import { format } from "date-fns";

interface Mission {
  id: string;
  title: string;
  difficulty: string;
  status: string;
  xp: number;
  due_date: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [todayMissions, setTodayMissions] = useState<Mission[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      console.log("Fetching dashboard data...");
      
      // Fetch profile
      const profileData = await api.getProfile();
      console.log("Profile data:", profileData);
      setProfile(profileData);

      // Fetch today's missions
      const missionsData: any = await api.getMissions();
      console.log("All missions:", missionsData);
      
      const today = new Date().toISOString().split("T")[0];
      console.log("Today's date:", today);
      
      const todayMissionsFiltered = missionsData.filter((m: any) => {
        if (!m.due_date) {
          console.log("Mission without due_date:", m);
          return false;
        }
        const missionDate = m.due_date.split("T")[0];
        console.log(`Comparing mission date ${missionDate} with today ${today}`, missionDate === today);
        return missionDate === today;
      });
      
      console.log("Today's missions filtered:", todayMissionsFiltered);
      setTodayMissions(todayMissionsFiltered || []);
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: t("error"),
        description: error.message || "Failed to load dashboard data",
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
    const sortedMissions = [...todayMissions].sort((a, b) => 
      new Date(b.due_date).getTime() - new Date(a.due_date).getTime()
    );
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 365; i++) {
      const dateStr = format(currentDate, "yyyy-MM-dd");
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

  const finalisedMissions = todayMissions.filter(m => m.status === "completed" || m.status === "failed");
  
  const stats = {
    level: profile?.level || 1,
    xp: profile?.xp || 0,
    xpToNextLevel: ((profile?.level || 1) * 100),
    streak: calculateStreak(),
    todayMissions: todayMissions.length,
    completedMissions: todayMissions.filter(m => m.status === "completed").length,
    weeklyScore: todayMissions.length > 0 ? Math.round((todayMissions.filter(m => m.status === "completed").length / todayMissions.length) * 100) : 0,
    disciplineIndex: finalisedMissions.length > 0 ? Math.round((todayMissions.filter(m => m.status === "completed").length / finalisedMissions.length) * 100) : 0,
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-success";
      case "normal": return "text-cyber";
      case "hard": return "text-war-orange";
      case "extreme": return "text-primary";
      default: return "text-foreground";
    }
  };

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Hero Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-war border-0 shadow-glow-war">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/80">Streak</p>
              <p className="text-2xl font-bold text-white">{stats.streak}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-elite border-0 shadow-glow-gold">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-black/20 flex items-center justify-center">
              <Award className="w-6 h-6 text-black" />
            </div>
            <div>
              <p className="text-xs text-black/80">Level</p>
              <p className="text-2xl font-bold text-black">{stats.level}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-success border-0 shadow-glow-success">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/80">Discipline</p>
              <p className="text-2xl font-bold text-white">{stats.disciplineIndex}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-cyber border-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-xs text-white/80">Score</p>
              <p className="text-2xl font-bold text-white">{stats.weeklyScore}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* XP Progress */}
      <Card className="p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Level {stats.level}</h3>
              <p className="text-sm text-muted-foreground">
                {stats.xp} / {stats.xpToNextLevel} XP
              </p>
            </div>
            <Badge variant="outline" className="text-primary border-primary">
              <TrendingUp className="w-3 h-3 mr-1" />
              {Math.round((stats.xp / stats.xpToNextLevel) * 100)}%
            </Badge>
          </div>
          <Progress value={(stats.xp / stats.xpToNextLevel) * 100} className="h-3" />
        </div>
      </Card>

      {/* Today's Missions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Today's Missions
          </h2>
          <Badge variant="secondary">
            {stats.completedMissions} / {stats.todayMissions}
          </Badge>
        </div>

        <div className="space-y-3">
          {todayMissions.map((mission) => (
            <Card
              key={mission.id}
              className={`p-4 transition-all ${
                mission.status === "completed"
                  ? "bg-success/10 border-success/30"
                  : "hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      mission.status === "completed"
                        ? "bg-success border-success"
                        : "border-muted-foreground"
                    }`}
                  >
                    {mission.status === "completed" && (
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className={`font-medium ${mission.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                      {mission.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="outline"
                        className={`text-xs ${getDifficultyColor(mission.difficulty)}`}
                      >
                        {mission.difficulty.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        +{mission.xp} XP
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <Card className="p-6">
        <h3 className="text-lg font-bold mb-4">Performance Metrics</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Daily Completion</span>
              <span className="font-medium">{Math.round((stats.completedMissions / stats.todayMissions) * 100)}%</span>
            </div>
            <Progress value={(stats.completedMissions / stats.todayMissions) * 100} />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Weekly Score</span>
              <span className="font-medium">{stats.weeklyScore}%</span>
            </div>
            <Progress value={stats.weeklyScore} className="bg-muted [&>div]:bg-success" />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Discipline Index</span>
              <span className="font-medium">{stats.disciplineIndex}%</span>
            </div>
            <Progress value={stats.disciplineIndex} className="bg-muted [&>div]:bg-primary" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
