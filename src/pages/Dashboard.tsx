import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Flame, Target, Zap, Award, TrendingUp, Clock } from "lucide-react";

const Dashboard = () => {
  // Mock data - will be replaced with real data from backend
  const stats = {
    level: 12,
    xp: 2340,
    xpToNextLevel: 3000,
    streak: 23,
    todayMissions: 5,
    completedMissions: 3,
    weeklyScore: 85,
    disciplineIndex: 92,
  };

  const todayMissions = [
    { id: 1, title: "Morning Workout", difficulty: "hard", completed: true, xp: 50 },
    { id: 2, title: "Read 30 pages", difficulty: "normal", completed: true, xp: 30 },
    { id: 3, title: "Code for 2 hours", difficulty: "hard", completed: true, xp: 50 },
    { id: 4, title: "Meditation 15min", difficulty: "easy", completed: false, xp: 20 },
    { id: 5, title: "No social media", difficulty: "extreme", completed: false, xp: 100 },
  ];

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
                mission.completed
                  ? "bg-success/10 border-success/30"
                  : "hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      mission.completed
                        ? "bg-success border-success"
                        : "border-muted-foreground"
                    }`}
                  >
                    {mission.completed && (
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
                    <h3 className={`font-medium ${mission.completed ? "line-through text-muted-foreground" : ""}`}>
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
