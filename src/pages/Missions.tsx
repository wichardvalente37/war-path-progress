import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Swords, Clock, Zap, Edit, Trash2, Eye, CheckCircle2, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { t } from "@/lib/i18n";

interface Mission {
  id: string;
  title: string;
  description: string | null;
  difficulty: string;
  xp: number;
  status: string;
  created_at: string;
}

const Missions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewMissionOpen, setIsNewMissionOpen] = useState(false);
  const [isEditMissionOpen, setIsEditMissionOpen] = useState(false);
  const [isDetailsMissionOpen, setIsDetailsMissionOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "medium",
    xp: 30,
  });

  useEffect(() => {
    if (user) {
      fetchMissions();
    }
  }, [user]);

  const fetchMissions = async () => {
    try {
      const { data, error } = await supabase
        .from("missions")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMissions(data || []);
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

  const handleCreateMission = async () => {
    try {
      const { error } = await supabase.from("missions").insert({
        user_id: user?.id,
        title: formData.title,
        description: formData.description,
        difficulty: formData.difficulty,
        xp: formData.xp,
        status: "pending",
      });

      if (error) throw error;

      toast({ title: t("success"), description: t("missionCreated") });
      setIsNewMissionOpen(false);
      setFormData({ title: "", description: "", difficulty: "medium", xp: 30 });
      fetchMissions();
    } catch (error: any) {
      toast({ title: t("error"), description: error.message, variant: "destructive" });
    }
  };

  const handleEditMission = async () => {
    if (!selectedMission) return;

    try {
      const { error } = await supabase
        .from("missions")
        .update({
          title: formData.title,
          description: formData.description,
          difficulty: formData.difficulty,
          xp: formData.xp,
        })
        .eq("id", selectedMission.id);

      if (error) throw error;

      toast({ title: t("success"), description: t("missionUpdated") });
      setIsEditMissionOpen(false);
      setSelectedMission(null);
      fetchMissions();
    } catch (error: any) {
      toast({ title: t("error"), description: error.message, variant: "destructive" });
    }
  };

  const handleDeleteMission = async (id: string) => {
    try {
      const { error } = await supabase.from("missions").delete().eq("id", id);

      if (error) throw error;

      toast({ title: t("success"), description: t("missionDeleted") });
      fetchMissions();
    } catch (error: any) {
      toast({ title: t("error"), description: error.message, variant: "destructive" });
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from("missions").update({ status }).eq("id", id);

      if (error) throw error;

      toast({ title: t("success"), description: status === "completed" ? t("missionCompleted") : t("missionFailed") });
      fetchMissions();
    } catch (error: any) {
      toast({ title: t("error"), description: error.message, variant: "destructive" });
    }
  };

  const openEditDialog = (mission: Mission) => {
    setSelectedMission(mission);
    setFormData({
      title: mission.title,
      description: mission.description || "",
      difficulty: mission.difficulty,
      xp: mission.xp,
    });
    setIsEditMissionOpen(true);
  };

  const openDetailsDialog = (mission: Mission) => {
    setSelectedMission(mission);
    setIsDetailsMissionOpen(true);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-success/20 text-success border-success/30";
      case "medium": return "bg-cyber/20 text-cyber border-cyber/30";
      case "hard": return "bg-war-orange/20 text-war-orange border-war-orange/30";
      default: return "bg-muted text-foreground";
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">{t("loading")}</div>;
  }

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
        <Button className="bg-gradient-war border-0 shadow-glow-war" onClick={() => setIsNewMissionOpen(true)}>
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

            <div className="flex gap-2">
              {mission.status === "active" && (
                <>
                  <Button 
                    variant="default" 
                    className="flex-1 bg-gradient-success border-0"
                    onClick={() => handleStatusChange(mission.id, "completed")}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Complete
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-destructive text-destructive hover:bg-destructive/10"
                    onClick={() => handleStatusChange(mission.id, "failed")}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Failed
                  </Button>
                </>
              )}
              <Button size="icon" variant="ghost" onClick={() => openDetailsDialog(mission)}>
                <Eye className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => openEditDialog(mission)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => handleDeleteMission(mission.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* New Mission Dialog */}
      <Dialog open={isNewMissionOpen} onOpenChange={setIsNewMissionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Mission</DialogTitle>
            <DialogDescription>Add a new mission to your daily tasks</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Mission title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Mission description"
              />
            </div>
            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={formData.difficulty} onValueChange={(val) => setFormData({...formData, difficulty: val})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EASY">EASY</SelectItem>
                  <SelectItem value="NORMAL">NORMAL</SelectItem>
                  <SelectItem value="HARD">HARD</SelectItem>
                  <SelectItem value="EXTREME">EXTREME</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="xp">XP Reward</Label>
              <Input 
                id="xp" 
                type="number"
                value={formData.xp}
                onChange={(e) => setFormData({...formData, xp: parseInt(e.target.value)})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewMissionOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateMission}>Create Mission</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Mission Dialog */}
      <Dialog open={isEditMissionOpen} onOpenChange={setIsEditMissionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Mission</DialogTitle>
            <DialogDescription>Update mission details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input 
                id="edit-title" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea 
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="edit-difficulty">Difficulty</Label>
              <Select value={formData.difficulty} onValueChange={(val) => setFormData({...formData, difficulty: val})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EASY">EASY</SelectItem>
                  <SelectItem value="NORMAL">NORMAL</SelectItem>
                  <SelectItem value="HARD">HARD</SelectItem>
                  <SelectItem value="EXTREME">EXTREME</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-xp">XP Reward</Label>
              <Input 
                id="edit-xp" 
                type="number"
                value={formData.xp}
                onChange={(e) => setFormData({...formData, xp: parseInt(e.target.value)})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditMissionOpen(false)}>Cancel</Button>
            <Button onClick={handleEditMission}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mission Details Dialog */}
      <Dialog open={isDetailsMissionOpen} onOpenChange={setIsDetailsMissionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedMission?.title}</DialogTitle>
            <DialogDescription>Mission Details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Description</Label>
              <p className="text-sm text-muted-foreground">{selectedMission?.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Difficulty</Label>
                <Badge className="mt-2">{selectedMission?.difficulty}</Badge>
              </div>
              <div>
                <Label>XP Reward</Label>
                <p className="text-lg font-bold text-gold mt-2">+{selectedMission?.xp} XP</p>
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Badge className="mt-2" variant={selectedMission?.status === "completed" ? "default" : "secondary"}>
                {selectedMission?.status?.toUpperCase()}
              </Badge>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDetailsMissionOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Missions;
