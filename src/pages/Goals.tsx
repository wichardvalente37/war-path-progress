import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Target, Crown, TrendingUp, Edit, Trash2, Eye } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Goals = () => {
  const { toast } = useToast();
  const [goals, setGoals] = useState([
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
  ]);

  const [isNewGoalOpen, setIsNewGoalOpen] = useState(false);
  const [isEditGoalOpen, setIsEditGoalOpen] = useState(false);
  const [isDetailsGoalOpen, setIsDetailsGoalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "medium",
    progress: 0,
    target: 10,
    reward: 500
  });

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

  const handleCreateGoal = () => {
    const newGoal = {
      id: goals.length + 1,
      ...formData,
      status: "active"
    };
    setGoals([...goals, newGoal]);
    setIsNewGoalOpen(false);
    setFormData({ title: "", description: "", type: "medium", progress: 0, target: 10, reward: 500 });
    toast({
      title: "Goal Created! 🎯",
      description: "New goal added to your list!",
      className: "bg-primary/20 border-primary",
    });
  };

  const handleEditGoal = () => {
    setGoals(goals.map(g => 
      g.id === selectedGoal.id ? { ...g, ...formData } : g
    ));
    setIsEditGoalOpen(false);
    setSelectedGoal(null);
    setFormData({ title: "", description: "", type: "medium", progress: 0, target: 10, reward: 500 });
    toast({
      title: "Goal Updated! ✏️",
      description: "Goal successfully updated!",
      className: "bg-cyber/20 border-cyber",
    });
  };

  const handleDeleteGoal = (goalId: number) => {
    setGoals(goals.filter(g => g.id !== goalId));
    toast({
      title: "Goal Deleted! 🗑️",
      description: "Goal removed from your list.",
      variant: "destructive",
    });
  };

  const openEditDialog = (goal: any) => {
    setSelectedGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description,
      type: goal.type,
      progress: goal.progress,
      target: goal.target,
      reward: goal.reward
    });
    setIsEditGoalOpen(true);
  };

  const openDetailsDialog = (goal: any) => {
    setSelectedGoal(goal);
    setIsDetailsGoalOpen(true);
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
        <Button className="bg-gradient-elite border-0 shadow-glow-gold text-black font-bold" onClick={() => setIsNewGoalOpen(true)}>
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

              <div className="flex gap-2 pt-4 border-t border-border">
                <Button size="sm" variant="ghost" onClick={() => openDetailsDialog(goal)}>
                  <Eye className="w-4 h-4 mr-2" />
                  Details
                </Button>
                <Button size="sm" variant="ghost" onClick={() => openEditDialog(goal)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDeleteGoal(goal.id)}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
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

      {/* New Goal Dialog */}
      <Dialog open={isNewGoalOpen} onOpenChange={setIsNewGoalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Goal</DialogTitle>
            <DialogDescription>Set a new long-term objective</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="goal-title">Title</Label>
              <Input 
                id="goal-title" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Goal title"
              />
            </div>
            <div>
              <Label htmlFor="goal-description">Description</Label>
              <Textarea 
                id="goal-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Goal description"
              />
            </div>
            <div>
              <Label htmlFor="goal-type">Type</Label>
              <Select value={formData.type} onValueChange={(val) => setFormData({...formData, type: val})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boss">BOSS BATTLE</SelectItem>
                  <SelectItem value="long">LONG TERM</SelectItem>
                  <SelectItem value="medium">MEDIUM TERM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="goal-target">Target</Label>
                <Input 
                  id="goal-target" 
                  type="number"
                  value={formData.target}
                  onChange={(e) => setFormData({...formData, target: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="goal-reward">XP Reward</Label>
                <Input 
                  id="goal-reward" 
                  type="number"
                  value={formData.reward}
                  onChange={(e) => setFormData({...formData, reward: parseInt(e.target.value)})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewGoalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateGoal}>Create Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Goal Dialog */}
      <Dialog open={isEditGoalOpen} onOpenChange={setIsEditGoalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Goal</DialogTitle>
            <DialogDescription>Update goal details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-goal-title">Title</Label>
              <Input 
                id="edit-goal-title" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-goal-description">Description</Label>
              <Textarea 
                id="edit-goal-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-goal-type">Type</Label>
              <Select value={formData.type} onValueChange={(val) => setFormData({...formData, type: val})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boss">BOSS BATTLE</SelectItem>
                  <SelectItem value="long">LONG TERM</SelectItem>
                  <SelectItem value="medium">MEDIUM TERM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-goal-progress">Progress</Label>
                <Input 
                  id="edit-goal-progress" 
                  type="number"
                  value={formData.progress}
                  onChange={(e) => setFormData({...formData, progress: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="edit-goal-target">Target</Label>
                <Input 
                  id="edit-goal-target" 
                  type="number"
                  value={formData.target}
                  onChange={(e) => setFormData({...formData, target: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <Label htmlFor="edit-goal-reward">XP Reward</Label>
                <Input 
                  id="edit-goal-reward" 
                  type="number"
                  value={formData.reward}
                  onChange={(e) => setFormData({...formData, reward: parseInt(e.target.value)})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditGoalOpen(false)}>Cancel</Button>
            <Button onClick={handleEditGoal}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Goal Details Dialog */}
      <Dialog open={isDetailsGoalOpen} onOpenChange={setIsDetailsGoalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedGoal?.title}</DialogTitle>
            <DialogDescription>Goal Details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Description</Label>
              <p className="text-sm text-muted-foreground">{selectedGoal?.description}</p>
            </div>
            <div>
              <Label>Type</Label>
              <Badge className={getTypeColor(selectedGoal?.type || "")} variant="outline">
                {getTypeLabel(selectedGoal?.type || "")}
              </Badge>
            </div>
            <div>
              <Label>Progress</Label>
              <div className="mt-2">
                <Progress value={(selectedGoal?.progress / selectedGoal?.target) * 100} className="h-3" />
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedGoal?.progress} / {selectedGoal?.target} ({Math.round((selectedGoal?.progress / selectedGoal?.target) * 100)}%)
                </p>
              </div>
            </div>
            <div>
              <Label>XP Reward</Label>
              <p className="text-lg font-bold text-gold mt-2">+{selectedGoal?.reward} XP</p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDetailsGoalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Goals;
