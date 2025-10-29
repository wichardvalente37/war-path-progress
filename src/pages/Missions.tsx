import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Swords, Clock, Zap } from "lucide-react";

const Missions = () => {
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
        <Card className="p-6 border-primary/30 hover:border-primary/60 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold">Complete 100 Push-ups</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Physical challenge for strength building
              </p>
            </div>
            <Badge className="bg-primary/20 text-primary border-primary/30">
              EXTREME
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span>+100 XP</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Today</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="default" className="flex-1 bg-gradient-success border-0">
              Complete
            </Button>
            <Button variant="outline" className="flex-1 border-destructive text-destructive hover:bg-destructive/10">
              Failed
            </Button>
          </div>
        </Card>

        <Card className="p-6 hover:border-primary/30 transition-all">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold">Read for 1 hour</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Knowledge is power
              </p>
            </div>
            <Badge className="bg-cyber/20 text-cyber border-cyber/30">
              NORMAL
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span>+30 XP</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Today</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="default" className="flex-1 bg-gradient-success border-0">
              Complete
            </Button>
            <Button variant="outline" className="flex-1 border-destructive text-destructive hover:bg-destructive/10">
              Failed
            </Button>
          </div>
        </Card>

        <Card className="p-6 border-success/30 bg-success/5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold line-through text-muted-foreground">
                Morning Meditation
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Start the day with clarity
              </p>
            </div>
            <Badge className="bg-success/20 text-success border-success/30">
              COMPLETED
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Zap className="w-4 h-4" />
              <span>+20 XP Gained</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Completed Today</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Missions;
