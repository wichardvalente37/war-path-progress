import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, Flame, Trophy, Eye, Edit, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { t } from "@/lib/i18n";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Mission {
  id: string;
  title: string;
  description: string | null;
  difficulty: string;
  xp: number;
  status: string;
  created_at: string;
  due_date: string;
  goal_id: string | null;
  is_recurring: boolean;
  recurrence_pattern: string | null;
}

interface Goal {
  id: string;
  title: string;
  category: string;
}

const Missions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [missions, setMissions] = useState<Mission[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewMissionOpen, setIsNewMissionOpen] = useState(false);
  const [isEditMissionOpen, setIsEditMissionOpen] = useState(false);
  const [isDetailsMissionOpen, setIsDetailsMissionOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "tomorrow" | "custom">("today");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed" | "failed">("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "normal",
    xp: 30,
    status: "pending",
    due_date: new Date(),
    goal_id: "",
    is_recurring: false,
    recurrence_pattern: [] as number[],
  });

  useEffect(() => {
    if (user) {
      fetchMissions();
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    try {
      const { data, error } = await supabase
        .from("goals")
        .select("id, title, category")
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
    }
  };

  const fetchMissions = async () => {
    try {
      const { data, error } = await supabase
        .from("missions")
        .select("*")
        .eq("user_id", user?.id)
        .order("due_date", { ascending: true });

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
      if (formData.is_recurring && formData.recurrence_pattern.length > 0) {
        // Create recurring missions for next 30 days
        const today = new Date();
        const missionsToCreate = [];
        
        for (let i = 0; i < 30; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() + i);
          const dayOfWeek = date.getDay();
          
          if (formData.recurrence_pattern.includes(dayOfWeek)) {
            missionsToCreate.push({
              user_id: user?.id,
              title: formData.title,
              description: formData.description,
              difficulty: formData.difficulty,
              xp: formData.xp,
              status: "pending",
              due_date: format(date, "yyyy-MM-dd"),
              goal_id: formData.goal_id || null,
              is_recurring: true,
              recurrence_pattern: JSON.stringify({ days: formData.recurrence_pattern }),
            });
          }
        }

        const { error } = await supabase.from("missions").insert(missionsToCreate);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("missions").insert({
          user_id: user?.id,
          title: formData.title,
          description: formData.description,
          difficulty: formData.difficulty,
          xp: formData.xp,
          status: "pending",
          due_date: format(formData.due_date, "yyyy-MM-dd"),
          goal_id: formData.goal_id || null,
          is_recurring: false,
          recurrence_pattern: null,
        });

        if (error) throw error;
      }

      toast({ title: t("success"), description: t("missionCreated") });
      setIsNewMissionOpen(false);
      resetForm();
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
          status: formData.status,
          due_date: format(formData.due_date, "yyyy-MM-dd"),
          goal_id: formData.goal_id || null,
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

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const mission = missions.find(m => m.id === id);
      if (!mission) return;

      const { error } = await supabase
        .from("missions")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      // If mission completed, update XP and level
      if (newStatus === "completed" && mission.status !== "completed") {
        const { data: profile } = await supabase
          .from("profiles")
          .select("xp, level")
          .eq("id", user?.id)
          .single();

        if (profile) {
          const newXP = (profile.xp || 0) + mission.xp;
          const newLevel = Math.floor(newXP / 100) + 1;

          await supabase
            .from("profiles")
            .update({ xp: newXP, level: newLevel })
            .eq("id", user?.id);
        }

        // Update goal progress if mission linked to goal
        if (mission.goal_id) {
          const { data: goal } = await supabase
            .from("goals")
            .select("current, target")
            .eq("id", mission.goal_id)
            .single();

          if (goal && goal.current < goal.target) {
            await supabase
              .from("goals")
              .update({ current: goal.current + 1 })
              .eq("id", mission.goal_id);
          }
        }
      }

      toast({ title: t("success"), description: t("missionUpdated") });
      fetchMissions();
    } catch (error: any) {
      toast({ title: t("error"), description: error.message, variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      difficulty: "normal",
      xp: 30,
      status: "pending",
      due_date: new Date(),
      goal_id: "",
      is_recurring: false,
      recurrence_pattern: [],
    });
  };

  const openEditDialog = (mission: Mission) => {
    setSelectedMission(mission);
    setFormData({
      title: mission.title,
      description: mission.description || "",
      difficulty: mission.difficulty,
      xp: mission.xp,
      status: mission.status,
      due_date: new Date(mission.due_date),
      goal_id: mission.goal_id || "",
      is_recurring: mission.is_recurring,
      recurrence_pattern: mission.recurrence_pattern
        ? JSON.parse(mission.recurrence_pattern).days
        : [],
    });
    setIsEditMissionOpen(true);
  };

  const openDetailsDialog = (mission: Mission) => {
    setSelectedMission(mission);
    setIsDetailsMissionOpen(true);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success/20 text-success border-success/30">{t("completed")}</Badge>;
      case "failed":
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">{t("failed")}</Badge>;
      default:
        return <Badge variant="outline">{t("pending")}</Badge>;
    }
  };

  const filterMissions = (missions: Mission[]) => {
    let filtered = missions;

    // Date filter
    if (dateFilter !== "all") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      filtered = filtered.filter(mission => {
        const missionDate = new Date(mission.due_date);
        missionDate.setHours(0, 0, 0, 0);
        
        if (dateFilter === "today") {
          return missionDate.getTime() === today.getTime();
        } else if (dateFilter === "tomorrow") {
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          return missionDate.getTime() === tomorrow.getTime();
        } else if (dateFilter === "custom" && selectedDate) {
          const customDate = new Date(selectedDate);
          customDate.setHours(0, 0, 0, 0);
          return missionDate.getTime() === customDate.getTime();
        }
        return true;
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(mission => mission.status === statusFilter);
    }

    return filtered;
  };

  const filteredMissions = filterMissions(missions);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">{t("loading")}</div>;
  }

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            {t("missions")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredMissions.length} {filteredMissions.length === 1 ? "mission" : "missions"}
          </p>
        </div>
        <Button className="bg-gradient-elite border-0 shadow-glow-gold text-black font-bold" onClick={() => {
          resetForm();
          setIsNewMissionOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          {t("newMission")}
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <Label>{t("filters")}</Label>
            <Select value={dateFilter} onValueChange={(value: any) => setDateFilter(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("all")}</SelectItem>
                <SelectItem value="today">{t("today")}</SelectItem>
                <SelectItem value="tomorrow">{t("tomorrow")}</SelectItem>
                <SelectItem value="custom">Data específica</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {dateFilter === "custom" && (
            <div className="flex-1 min-w-[200px]">
              <Label>Selecionar Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
          <div className="flex-1 min-w-[200px]">
            <Label>{t("status")}</Label>
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("all")}</SelectItem>
                <SelectItem value="pending">{t("pending")}</SelectItem>
                <SelectItem value="completed">{t("completed")}</SelectItem>
                <SelectItem value="failed">{t("failed")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Missions List */}
      <div className="space-y-4">
        {filteredMissions.map((mission) => {
          const goal = goals.find(g => g.id === mission.goal_id);
          
          return (
            <Card
              key={mission.id}
              className={`p-6 hover:border-primary/30 transition-all ${
                mission.status === "completed" ? "bg-success/5" : 
                mission.status === "failed" ? "bg-destructive/5" : ""
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold">{mission.title}</h3>
                      {getStatusBadge(mission.status)}
                      {mission.is_recurring && (
                        <Badge variant="outline" className="text-xs">
                          <Flame className="w-3 h-3 mr-1" />
                          {t("recurring")}
                        </Badge>
                      )}
                    </div>
                    {mission.description && (
                      <p className="text-sm text-muted-foreground">{mission.description}</p>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <Badge
                        variant="outline"
                      className={`text-xs ${getDifficultyColor(mission.difficulty)}`}
                    >
                      {mission.difficulty.toUpperCase()}
                    </Badge>
                      <span className="text-xs text-muted-foreground">+{mission.xp} XP</span>
                      <span className="text-xs text-muted-foreground">
                        <CalendarIcon className="w-3 h-3 inline mr-1" />
                        {format(new Date(mission.due_date), "dd/MM/yyyy")}
                      </span>
                      {goal && (
                        <Badge variant="outline" className="text-xs">
                          <Trophy className="w-3 h-3 mr-1" />
                          {goal.title}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {mission.status === "pending" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-success/30 text-success hover:bg-success/10"
                      onClick={() => handleStatusChange(mission.id, "completed")}
                    >
                      ✓ {t("completed")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-destructive/30 text-destructive hover:bg-destructive/10"
                      onClick={() => handleStatusChange(mission.id, "failed")}
                    >
                      ✗ {t("failed")}
                    </Button>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button size="sm" variant="ghost" onClick={() => openDetailsDialog(mission)}>
                    <Eye className="w-4 h-4 mr-2" />
                    {t("details")}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => openEditDialog(mission)}>
                    <Edit className="w-4 h-4 mr-2" />
                    {t("edit")}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDeleteMission(mission.id)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t("delete")}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}

        {filteredMissions.length === 0 && (
          <Card className="p-12 text-center">
            <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">{t("noData")}</p>
          </Card>
        )}
      </div>

      {/* New Mission Dialog */}
      <Dialog open={isNewMissionOpen} onOpenChange={setIsNewMissionOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("newMission")}</DialogTitle>
            <DialogDescription>Create a new mission to complete</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="mission-title">{t("title")}</Label>
              <Input
                id="mission-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Mission title"
              />
            </div>
            <div>
              <Label htmlFor="mission-description">{t("description")}</Label>
              <Textarea
                id="mission-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mission description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mission-difficulty">{t("difficulty")}</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                >
                  <SelectTrigger id="mission-difficulty">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">{t("easy")}</SelectItem>
                    <SelectItem value="normal">{t("normal")}</SelectItem>
                    <SelectItem value="hard">{t("hard")}</SelectItem>
                    <SelectItem value="extreme">{t("extreme")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="mission-xp">XP</Label>
                <Input
                  id="mission-xp"
                  type="number"
                  value={formData.xp}
                  onChange={(e) => setFormData({ ...formData, xp: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="mission-goal">{t("selectGoal")}</Label>
              <Select
                value={formData.goal_id || "no-goal"}
                onValueChange={(value) => setFormData({ ...formData, goal_id: value === "no-goal" ? "" : value })}
              >
                <SelectTrigger id="mission-goal">
                  <SelectValue placeholder={t("noGoal")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-goal">{t("noGoal")}</SelectItem>
                  {goals.map((goal) => (
                    <SelectItem key={goal.id} value={goal.id}>
                      {goal.title} ({goal.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recurring"
                checked={formData.is_recurring}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_recurring: checked as boolean })
                }
              />
              <Label htmlFor="recurring">{t("recurring")}</Label>
            </div>
            {!formData.is_recurring ? (
              <div>
                <Label>{t("dueDate")}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.due_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.due_date ? format(formData.due_date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.due_date}
                      onSelect={(date) => date && setFormData({ ...formData, due_date: date })}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <div>
                <Label>{t("recurringDays")}</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {[
                    { day: 0, label: t("sunday") },
                    { day: 1, label: t("monday") },
                    { day: 2, label: t("tuesday") },
                    { day: 3, label: t("wednesday") },
                    { day: 4, label: t("thursday") },
                    { day: 5, label: t("friday") },
                    { day: 6, label: t("saturday") },
                  ].map(({ day, label }) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={`day-${day}`}
                        checked={formData.recurrence_pattern.includes(day)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              recurrence_pattern: [...formData.recurrence_pattern, day],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              recurrence_pattern: formData.recurrence_pattern.filter((d) => d !== day),
                            });
                          }
                        }}
                      />
                      <Label htmlFor={`day-${day}`}>{label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewMissionOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleCreateMission}>{t("create")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Mission Dialog */}
      <Dialog open={isEditMissionOpen} onOpenChange={setIsEditMissionOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("edit")} {t("missions")}</DialogTitle>
            <DialogDescription>Update mission details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-mission-title">{t("title")}</Label>
              <Input
                id="edit-mission-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="edit-mission-description">{t("description")}</Label>
              <Textarea
                id="edit-mission-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-mission-difficulty">{t("difficulty")}</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) => setFormData({ ...formData, difficulty: value })}
                >
                  <SelectTrigger id="edit-mission-difficulty">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">{t("easy")}</SelectItem>
                    <SelectItem value="normal">{t("normal")}</SelectItem>
                    <SelectItem value="hard">{t("hard")}</SelectItem>
                    <SelectItem value="extreme">{t("extreme")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-mission-xp">XP</Label>
                <Input
                  id="edit-mission-xp"
                  type="number"
                  value={formData.xp}
                  onChange={(e) => setFormData({ ...formData, xp: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-mission-status">{t("status")}</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger id="edit-mission-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">{t("pending")}</SelectItem>
                  <SelectItem value="completed">{t("completed")}</SelectItem>
                  <SelectItem value="failed">{t("failed")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-mission-goal">{t("selectGoal")}</Label>
              <Select
                value={formData.goal_id || "no-goal"}
                onValueChange={(value) => setFormData({ ...formData, goal_id: value === "no-goal" ? "" : value })}
              >
                <SelectTrigger id="edit-mission-goal">
                  <SelectValue placeholder={t("noGoal")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-goal">{t("noGoal")}</SelectItem>
                  {goals.map((goal) => (
                    <SelectItem key={goal.id} value={goal.id}>
                      {goal.title} ({goal.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>{t("dueDate")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.due_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.due_date ? format(formData.due_date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.due_date}
                    onSelect={(date) => date && setFormData({ ...formData, due_date: date })}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditMissionOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleEditMission}>{t("save")}</Button>
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
              <Label>{t("description")}</Label>
              <p className="text-sm text-muted-foreground">
                {selectedMission?.description || "No description"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t("difficulty")}</Label>
                <p className="text-sm font-medium">{selectedMission?.difficulty}</p>
              </div>
              <div>
                <Label>XP</Label>
                <p className="text-sm font-medium">+{selectedMission?.xp}</p>
              </div>
            </div>
            <div>
              <Label>{t("status")}</Label>
              <p className="text-sm font-medium">{selectedMission?.status}</p>
            </div>
            <div>
              <Label>{t("dueDate")}</Label>
              <p className="text-sm font-medium">
                {selectedMission && format(new Date(selectedMission.due_date), "PPP")}
              </p>
            </div>
            {selectedMission?.goal_id && (
              <div>
                <Label>{t("selectGoal")}</Label>
                <p className="text-sm font-medium">
                  {goals.find(g => g.id === selectedMission.goal_id)?.title}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDetailsMissionOpen(false)}>{t("close")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Missions;