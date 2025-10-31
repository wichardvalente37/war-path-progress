import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Target, Crown, TrendingUp, Edit, Trash2, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { t } from "@/lib/i18n";

interface Goal {
  id: string;
  title: string;
  description: string | null;
  target: number;
  current: number;
  created_at: string;
}

const Goals = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewGoalOpen, setIsNewGoalOpen] = useState(false);
  const [isEditGoalOpen, setIsEditGoalOpen] = useState(false);
  const [isDetailsGoalOpen, setIsDetailsGoalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    target: 100,
    current: 0,
  });

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGoals(data || []);
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

  const handleCreateGoal = async () => {
    try {
      const { error } = await supabase.from("goals").insert({
        user_id: user?.id,
        title: formData.title,
        description: formData.description,
        target: formData.target,
        current: formData.current,
      });

      if (error) throw error;

      toast({ title: t("success"), description: t("goalCreated") });
      setIsNewGoalOpen(false);
      setFormData({ title: "", description: "", target: 100, current: 0 });
      fetchGoals();
    } catch (error: any) {
      toast({ title: t("error"), description: error.message, variant: "destructive" });
    }
  };

  const handleEditGoal = async () => {
    if (!selectedGoal) return;

    try {
      const { error } = await supabase
        .from("goals")
        .update({
          title: formData.title,
          description: formData.description,
          target: formData.target,
          current: formData.current,
        })
        .eq("id", selectedGoal.id);

      if (error) throw error;

      toast({ title: t("success"), description: t("goalUpdated") });
      setIsEditGoalOpen(false);
      setSelectedGoal(null);
      fetchGoals();
    } catch (error: any) {
      toast({ title: t("error"), description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      const { error } = await supabase.from("goals").delete().eq("id", id);

      if (error) throw error;

      toast({ title: t("success"), description: t("goalDeleted") });
      fetchGoals();
    } catch (error: any) {
      toast({ title: t("error"), description: error.message, variant: "destructive" });
    }
  };

  const openEditDialog = (goal: Goal) => {
    setSelectedGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || "",
      target: goal.target,
      current: goal.current,
    });
    setIsEditGoalOpen(true);
  };

  const openDetailsDialog = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsDetailsGoalOpen(true);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">{t("loading")}</div>;
  }

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            {t("goals")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {goals.length} {goals.length === 1 ? "goal" : "goals"}
          </p>
        </div>
        <Button className="bg-gradient-elite border-0 shadow-glow-gold text-black font-bold" onClick={() => setIsNewGoalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          {t("newGoal")}
        </Button>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
          
          return (
            <Card
              key={goal.id}
              className="p-6 hover:border-primary/30 transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">{goal.title}</h3>
                    {goal.description && (
                      <p className="text-sm text-muted-foreground">{goal.description}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t("progress")}</span>
                    <span className="font-medium">
                      {goal.current} / {goal.target} ({Math.round(progress)}%)
                    </span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>

                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button size="sm" variant="ghost" onClick={() => openDetailsDialog(goal)}>
                    <Eye className="w-4 h-4 mr-2" />
                    {t("details")}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => openEditDialog(goal)}>
                    <Edit className="w-4 h-4 mr-2" />
                    {t("edit")}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDeleteGoal(goal.id)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t("delete")}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}

        {goals.length === 0 && (
          <Card className="p-12 text-center">
            <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No goals yet. Create your first goal!</p>
          </Card>
        )}
      </div>

      {/* Stats Summary */}
      <Card className="p-6 bg-gradient-to-br from-card to-muted/20">
        <h3 className="text-lg font-bold mb-4">{t("goals")} Overview</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">{goals.length}</p>
            <p className="text-xs text-muted-foreground">Active {t("goals")}</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gold">
              {Math.round(goals.reduce((acc, g) => acc + ((g.current / g.target) * 100), 0) / Math.max(goals.length, 1))}%
            </p>
            <p className="text-xs text-muted-foreground">Average Progress</p>
          </div>
        </div>
      </Card>

      {/* New Goal Dialog */}
      <Dialog open={isNewGoalOpen} onOpenChange={setIsNewGoalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("newGoal")}</DialogTitle>
            <DialogDescription>Set a new long-term objective</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="goal-title">{t("title")}</Label>
              <Input 
                id="goal-title" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Goal title"
              />
            </div>
            <div>
              <Label htmlFor="goal-description">{t("description")}</Label>
              <Textarea 
                id="goal-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Goal description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="goal-target">{t("target")}</Label>
                <Input 
                  id="goal-target" 
                  type="number"
                  value={formData.target}
                  onChange={(e) => setFormData({...formData, target: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="goal-current">{t("current")}</Label>
                <Input 
                  id="goal-current" 
                  type="number"
                  value={formData.current}
                  onChange={(e) => setFormData({...formData, current: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewGoalOpen(false)}>{t("cancel")}</Button>
            <Button onClick={handleCreateGoal}>{t("create")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Goal Dialog */}
      <Dialog open={isEditGoalOpen} onOpenChange={setIsEditGoalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("edit")} {t("goals")}</DialogTitle>
            <DialogDescription>Update goal details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-goal-title">{t("title")}</Label>
              <Input 
                id="edit-goal-title" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-goal-description">{t("description")}</Label>
              <Textarea 
                id="edit-goal-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-goal-current">{t("current")}</Label>
                <Input 
                  id="edit-goal-current" 
                  type="number"
                  value={formData.current}
                  onChange={(e) => setFormData({...formData, current: parseInt(e.target.value) || 0})}
                />
              </div>
              <div>
                <Label htmlFor="edit-goal-target">{t("target")}</Label>
                <Input 
                  id="edit-goal-target" 
                  type="number"
                  value={formData.target}
                  onChange={(e) => setFormData({...formData, target: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditGoalOpen(false)}>{t("cancel")}</Button>
            <Button onClick={handleEditGoal}>{t("save")}</Button>
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
              <Label>{t("description")}</Label>
              <p className="text-sm text-muted-foreground">{selectedGoal?.description || "No description"}</p>
            </div>
            <div>
              <Label>{t("progress")}</Label>
              <div className="mt-2">
                <Progress value={selectedGoal ? (selectedGoal.current / selectedGoal.target) * 100 : 0} className="h-3" />
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedGoal?.current} / {selectedGoal?.target} ({Math.round(selectedGoal ? (selectedGoal.current / selectedGoal.target) * 100 : 0)}%)
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDetailsGoalOpen(false)}>{t("close")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Goals;
