import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Swords, Clock, Zap } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Missions = () => {
  const { toast } = useToast();
  const [missions, setMissions] = useState([
    { id: 1, title: "Complete 100 Push-ups", description: "Physical challenge for strength building", difficulty: "EXTREME", xp: 100, status: "active" },
    { id: 2, title: "Read for 1 hour", description: "Knowledge is power", difficulty: "NORMAL", xp: 30, status: "active" },
    { id: 3, title: "Morning Meditation", description: "Start the day with clarity", difficulty: "EASY", xp: 20, status: "completed" },
  ]);

  const handleComplete = (missionId: number) => {
    const mission = missions.find(m => m.id === missionId);
    setMissions(missions.map(m => 
      m.id === missionId ? { ...m, status: "completed" } : m
    ));
    toast({
      title: "Mission Completed! 🎯",
      description: `+${mission?.xp} XP gained! Keep the streak going!`,
      className: "bg-success/20 border-success",
    });
  };

  const handleFailed = (missionId: number) => {
    setMissions(missions.map(m => 
      m.id === missionId ? { ...m, status: "failed" } : m
    ));
    toast({
      title: "Mission Failed ⚠️",
      description: "No XP gained. Learn and come back stronger!",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Swords className="w-6 h-6 text-primary" />
            Missions
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Complete missions to gain XP and level up
          </p>
        </div>
        <Button className="bg-gradient-war border-0 shadow-glow-war">
          <Plus className="w-4 h-4 mr-2" />
          New Mission
        </Button>
      </div>

      <div className="grid gap-4">
        {missions.map((mission) => (
          <Card 
            key={mission.id}
            className={`p-6 transition-all ${
              mission.status === "completed" 
                ? "border-success/30 bg-success/5" 
                : mission.status === "failed"
                ? "border-destructive/30 bg-destructive/5 opacity-60"
                : "border-primary/30 hover:border-primary/60"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className={`text-lg font-bold ${
                  mission.status === "completed" ? "line-through text-muted-foreground" : ""
                }`}>
                  {mission.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {mission.description}
                </p>
              </div>
              <Badge className={`
                ${mission.difficulty === "EXTREME" ? "bg-primary/20 text-primary border-primary/30" : ""}
                ${mission.difficulty === "NORMAL" ? "bg-cyber/20 text-cyber border-cyber/30" : ""}
                ${mission.difficulty === "EASY" ? "bg-success/20 text-success border-success/30" : ""}
                ${mission.status === "completed" ? "bg-success/20 text-success border-success/30" : ""}
              `}>
                {mission.status === "completed" ? "COMPLETED" : mission.difficulty}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                <span>{mission.status === "completed" ? `+${mission.xp} XP Gained` : `+${mission.xp} XP`}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{mission.status === "completed" ? "Completed Today" : "Today"}</span>
              </div>
            </div>

            {mission.status === "active" && (
              <div className="flex gap-2">
                <Button 
                  variant="default" 
                  className="flex-1 bg-gradient-success border-0"
                  onClick={() => handleComplete(mission.id)}
                >
                  Complete
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                  onClick={() => handleFailed(mission.id)}
                >
                  Failed
                </Button>
              </div>
            )}
          </Card>
        ))}

      </div>
    </div>
  );
};

export default Missions;
