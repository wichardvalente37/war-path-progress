import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Target, Crown, TrendingUp } from "lucide-react";

const Goals = () => {
  const goals = [
    {
      id: 1,
      title: "Master Discipline - 90 Day Challenge",
      description: "Complete daily missions without missing a single day",
      type: "boss",
      progress: 23,
      target: 90,
      reward: 5000,
      status: "active",
    },
    {
      id: 2,
      title: "Read 12 Books This Year",
      description: "Expand knowledge through consistent reading",
      type: "long",
      progress: 3,
      target: 12,
      reward: 1200,
      status: "active",
    },
    {
      id: 3,
      title: "Lose 10kg",
      description: "Get in the best shape of your life",
      type: "medium",
      progress: 3.5,
      target: 10,
      reward: 800,
      status: "active",
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "boss": return "bg-primary/20 text-primary border-primary/30";
      case "long": return "bg-gold/20 text-gold border-gold/30";
      case "medium": return "bg-cyber/20 text-cyber border-cyber/30";
      default: return "bg-muted";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "boss": return "BOSS BATTLE";
      case "long": return "LONG TERM";
      case "medium": return "MEDIUM TERM";
      default: return type.toUpperCase();
    }
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            Goals
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Long-term objectives and boss battles
          </p>
        </div>
        <Button className="bg-gradient-elite border-0 shadow-glow-gold text-black font-bold">
          <Plus className="w-4 h-4 mr-2" />
          New Goal
        </Button>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => (
          <Card
            key={goal.id}
            className={`p-6 ${
              goal.type === "boss"
                ? "border-primary/50 shadow-glow-war animate-pulse-glow"
                : "hover:border-primary/30"
            } transition-all`}
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {goal.type === "boss" && <Crown className="w-5 h-5 text-primary" />}
                    <h3 className="text-lg font-bold">{goal.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{goal.description}</p>
                </div>
                <Badge className={getTypeColor(goal.type)}>
                  {getTypeLabel(goal.type)}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {goal.progress} / {goal.target} {goal.type === "boss" ? "days" : "completed"}
                  </span>
                </div>
                <Progress
                  value={(goal.progress / goal.target) * 100}
                  className={`h-3 ${goal.type === "boss" ? "[&>div]:bg-gradient-war" : ""}`}
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {Math.round((goal.progress / goal.target) * 100)}% Complete
                  </span>
                  <span className="text-gold font-medium">+{goal.reward} XP Reward</span>
                </div>
              </div>

              {goal.type === "boss" && (
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Crown className="w-4 h-4" />
                    <span className="font-medium">
                      {goal.target - goal.progress} days remaining. No mercy on failure.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Stats Summary */}
      <Card className="p-6 bg-gradient-to-br from-card to-muted/20">
        <h3 className="text-lg font-bold mb-4">Goals Overview</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{goals.length}</p>
            <p className="text-xs text-muted-foreground">Active Goals</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-success">
              {goals.filter(g => g.type === "boss").length}
            </p>
            <p className="text-xs text-muted-foreground">Boss Battles</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gold">
              {goals.reduce((acc, g) => acc + g.reward, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Total XP Reward</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Goals;
