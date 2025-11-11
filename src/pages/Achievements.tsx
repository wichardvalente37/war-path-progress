import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Flame, Target, Zap, Crown, Lock, Star, Swords, Medal } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { t } from "@/lib/i18n";

interface AchievementDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: string;
  points: number;
  check: (stats: any) => { unlocked: boolean; progress?: number; target?: number };
}

const achievementDefinitions: AchievementDef[] = [
  {
    id: "first_mission",
    title: "First Steps",
    description: "Complete your first mission",
    icon: "Target",
    rarity: "common",
    points: 50,
    check: (stats) => ({ unlocked: stats.completedMissions >= 1, progress: stats.completedMissions, target: 1 }),
  },
  {
    id: "mission_10",
    title: "Rising Warrior",
    description: "Complete 10 missions",
    icon: "Swords",
    rarity: "uncommon",
    points: 100,
    check: (stats) => ({ unlocked: stats.completedMissions >= 10, progress: stats.completedMissions, target: 10 }),
  },
  {
    id: "mission_50",
    title: "Veteran Fighter",
    description: "Complete 50 missions",
    icon: "Medal",
    rarity: "rare",
    points: 200,
    check: (stats) => ({ unlocked: stats.completedMissions >= 50, progress: stats.completedMissions, target: 50 }),
  },
  {
    id: "mission_100",
    title: "Elite Soldier",
    description: "Complete 100 missions",
    icon: "Award",
    rarity: "epic",
    points: 500,
    check: (stats) => ({ unlocked: stats.completedMissions >= 100, progress: stats.completedMissions, target: 100 }),
  },
  {
    id: "mission_200",
    title: "Legendary Warrior",
    description: "Complete 200 missions",
    icon: "Crown",
    rarity: "legendary",
    points: 1000,
    check: (stats) => ({ unlocked: stats.completedMissions >= 200, progress: stats.completedMissions, target: 200 }),
  },
  {
    id: "streak_7",
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "Flame",
    rarity: "uncommon",
    points: 150,
    check: (stats) => ({ unlocked: stats.currentStreak >= 7, progress: stats.currentStreak, target: 7 }),
  },
  {
    id: "streak_30",
    title: "Unstoppable Force",
    description: "Maintain a 30-day streak",
    icon: "Flame",
    rarity: "epic",
    points: 500,
    check: (stats) => ({ unlocked: stats.currentStreak >= 30, progress: stats.currentStreak, target: 30 }),
  },
  {
    id: "level_5",
    title: "Skilled Fighter",
    description: "Reach level 5",
    icon: "Star",
    rarity: "uncommon",
    points: 100,
    check: (stats) => ({ unlocked: stats.level >= 5, progress: stats.level, target: 5 }),
  },
  {
    id: "level_10",
    title: "Master Warrior",
    description: "Reach level 10",
    icon: "Star",
    rarity: "rare",
    points: 250,
    check: (stats) => ({ unlocked: stats.level >= 10, progress: stats.level, target: 10 }),
  },
  {
    id: "level_20",
    title: "Legendary Champion",
    description: "Reach level 20",
    icon: "Crown",
    rarity: "legendary",
    points: 1000,
    check: (stats) => ({ unlocked: stats.level >= 20, progress: stats.level, target: 20 }),
  },
  {
    id: "perfect_day",
    title: "Perfect Day",
    description: "Complete all missions in a single day",
    icon: "Trophy",
    rarity: "rare",
    points: 200,
    check: (stats) => ({ unlocked: stats.perfectDays >= 1, progress: stats.perfectDays, target: 1 }),
  },
  {
    id: "extreme_master",
    title: "Extreme Master",
    description: "Complete 10 extreme difficulty missions",
    icon: "Zap",
    rarity: "epic",
    points: 400,
    check: (stats) => ({ unlocked: stats.extremeMissions >= 10, progress: stats.extremeMissions, target: 10 }),
  },
  {
    id: "goal_achiever",
    title: "Goal Achiever",
    description: "Complete a goal",
    icon: "Target",
    rarity: "uncommon",
    points: 150,
    check: (stats) => ({ unlocked: stats.completedGoals >= 1, progress: stats.completedGoals, target: 1 }),
  },
  {
    id: "discipline_master",
    title: "Discipline Master",
    description: "Achieve 90% discipline score",
    icon: "Award",
    rarity: "rare",
    points: 300,
    check: (stats) => ({ unlocked: stats.disciplineScore >= 90, progress: stats.disciplineScore, target: 90 }),
  },
];

const Achievements = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [missions, setMissions] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [profileRes, missionsRes, goalsRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user?.id).single(),
        supabase.from("missions").select("*").eq("user_id", user?.id),
        supabase.from("goals").select("*").eq("user_id", user?.id),
      ]);

      if (profileRes.error) throw profileRes.error;
      if (missionsRes.error) throw missionsRes.error;
      if (goalsRes.error) throw goalsRes.error;

      setProfile(profileRes.data);
      setMissions(missionsRes.data || []);
      setGoals(goalsRes.data || []);
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

  // Calculate stats for achievements
  const calculateStats = () => {
    const completedMissions = missions.filter(m => m.status === "completed");
    
    // Calculate current streak
    let currentStreak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 365; i++) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const dayMissions = missions.filter(m => m.due_date === dateStr);
      const hasCompleted = dayMissions.some(m => m.status === "completed");
      
      if (hasCompleted) {
        currentStreak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (i > 0) {
        break;
      } else {
        currentDate.setDate(currentDate.getDate() - 1);
      }
    }
    
    // Calculate perfect days
    const dateGroups = new Map<string, { total: number; completed: number }>();
    missions.forEach(m => {
      if (!dateGroups.has(m.due_date)) {
        dateGroups.set(m.due_date, { total: 0, completed: 0 });
      }
      const group = dateGroups.get(m.due_date)!;
      group.total++;
      if (m.status === "completed") group.completed++;
    });
    const perfectDays = Array.from(dateGroups.values()).filter(g => g.total > 0 && g.completed === g.total).length;
    
    // Calculate discipline
    const finalisedMissions = missions.filter(m => m.status === "completed" || m.status === "failed");
    const disciplineScore = finalisedMissions.length > 0 
      ? Math.round((completedMissions.length / finalisedMissions.length) * 100) 
      : 0;
    
    return {
      completedMissions: completedMissions.length,
      currentStreak,
      level: profile?.level || 1,
      perfectDays,
      extremeMissions: completedMissions.filter(m => m.difficulty === "extreme").length,
      completedGoals: goals.filter(g => g.current >= g.target).length,
      disciplineScore,
    };
  };

  const stats = calculateStats();

  // Map icon names to icon components
  const getIcon = (iconName: string) => {
    const icons: any = { Trophy, Award, Flame, Target, Zap, Crown, Star, Swords, Medal };
    return icons[iconName] || Target;
  };

  const achievementsData = achievementDefinitions.map(def => {
    const result = def.check(stats);
    return {
      ...def,
      icon: getIcon(def.icon),
      ...result,
    };
  });

  const getRarityConfig = (rarity: string) => {
    switch (rarity) {
      case "common":
        return { color: "text-muted-foreground", bg: "bg-muted/20", label: "Common" };
      case "uncommon":
        return { color: "text-success", bg: "bg-success/20 border-success/30", label: "Uncommon" };
      case "rare":
        return { color: "text-cyber", bg: "bg-cyber/20 border-cyber/30", label: "Rare" };
      case "epic":
        return { color: "text-war-orange", bg: "bg-war-orange/20 border-war-orange/30", label: "Epic" };
      case "legendary":
        return { color: "text-gold", bg: "bg-gold/20 border-gold/30", label: "Legendary" };
      default:
        return { color: "text-foreground", bg: "bg-muted", label: rarity };
    }
  };

  const totalPoints = achievementsData.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0);
  const unlockedCount = achievementsData.filter(a => a.unlocked).length;

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="w-6 h-6 text-gold" />
          Achievements
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Unlock badges and prove your dedication
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-elite border-0 text-black">
          <p className="text-xs font-medium mb-1">Unlocked</p>
          <p className="text-2xl font-bold">{unlockedCount}/{achievementsData.length}</p>
        </Card>
        <Card className="p-4 bg-gradient-war border-0 text-white">
          <p className="text-xs font-medium mb-1">Points</p>
          <p className="text-2xl font-bold">{totalPoints}</p>
        </Card>
        <Card className="p-4 bg-gradient-success border-0 text-white">
          <p className="text-xs font-medium mb-1">Progress</p>
          <p className="text-2xl font-bold">{Math.round((unlockedCount / achievementsData.length) * 100)}%</p>
        </Card>
      </div>

      {/* Achievements Grid */}
      <div className="grid gap-4">
        {achievementsData.map((achievement) => {
          const Icon = achievement.icon;
          const rarityConfig = getRarityConfig(achievement.rarity);
          
          return (
            <Card
              key={achievement.id}
              className={`p-6 transition-all ${
                achievement.unlocked
                  ? `border-2 ${rarityConfig.bg}`
                  : "opacity-60 hover:opacity-80"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                    achievement.unlocked
                      ? `${rarityConfig.bg} ${rarityConfig.color} shadow-lg`
                      : "bg-muted/30"
                  }`}
                >
                  {achievement.unlocked ? (
                    <Icon className="w-8 h-8" />
                  ) : (
                    <Lock className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                    </div>
                    <Badge variant="outline" className={rarityConfig.bg}>
                      {rarityConfig.label}
                    </Badge>
                  </div>

                  {!achievement.unlocked && achievement.progress !== undefined && achievement.target !== undefined && (
                    <div className="mt-3 space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>
                          {achievement.progress} / {achievement.target}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${rarityConfig.bg} transition-all`}
                          style={{
                            width: `${Math.min((achievement.progress / achievement.target) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {achievement.unlocked && (
                    <div className="mt-3 flex items-center gap-2">
                      <Badge variant="outline" className="text-success border-success">
                        <Trophy className="w-3 h-3 mr-1" />
                        Unlocked
                      </Badge>
                      <span className="text-xs text-muted-foreground">+{achievement.points} Points</span>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
