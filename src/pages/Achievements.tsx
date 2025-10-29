import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Flame, Target, Zap, Crown, Lock } from "lucide-react";

const Achievements = () => {
  const achievements = [
    {
      id: 1,
      title: "First Blood",
      description: "Complete your first mission",
      icon: Zap,
      unlocked: true,
      rarity: "common",
    },
    {
      id: 2,
      title: "Week Warrior",
      description: "Maintain a 7-day streak",
      icon: Flame,
      unlocked: true,
      rarity: "uncommon",
    },
    {
      id: 3,
      title: "Unstoppable",
      description: "Maintain a 30-day streak",
      icon: Target,
      unlocked: false,
      rarity: "rare",
      progress: 23,
      target: 30,
    },
    {
      id: 4,
      title: "Level 10 Elite",
      description: "Reach level 10",
      icon: Award,
      unlocked: true,
      rarity: "rare",
    },
    {
      id: 5,
      title: "Perfect Month",
      description: "Complete all missions for 30 consecutive days",
      icon: Crown,
      unlocked: false,
      rarity: "legendary",
      progress: 0,
      target: 30,
    },
    {
      id: 6,
      title: "Boss Slayer",
      description: "Complete your first Boss Battle",
      icon: Trophy,
      unlocked: false,
      rarity: "epic",
      progress: 0,
      target: 1,
    },
  ];

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

  const stats = {
    totalAchievements: achievements.length,
    unlocked: achievements.filter(a => a.unlocked).length,
    points: achievements.filter(a => a.unlocked).length * 100,
  };

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
          <p className="text-2xl font-bold">{stats.unlocked}/{stats.totalAchievements}</p>
        </Card>
        <Card className="p-4 bg-gradient-war border-0 text-white">
          <p className="text-xs font-medium mb-1">Points</p>
          <p className="text-2xl font-bold">{stats.points}</p>
        </Card>
        <Card className="p-4 bg-gradient-success border-0 text-white">
          <p className="text-xs font-medium mb-1">Progress</p>
          <p className="text-2xl font-bold">{Math.round((stats.unlocked / stats.totalAchievements) * 100)}%</p>
        </Card>
      </div>

      {/* Achievements Grid */}
      <div className="grid gap-4">
        {achievements.map((achievement) => {
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

                  {!achievement.unlocked && achievement.progress !== undefined && (
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
                            width: `${(achievement.progress / (achievement.target || 1)) * 100}%`,
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
                      <span className="text-xs text-muted-foreground">+100 Points</span>
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
