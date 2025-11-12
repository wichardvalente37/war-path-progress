import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings as SettingsIcon, User, Mail, Award, Shield, Bell, Moon, Sun, Trash2, Download, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { t } from "@/lib/i18n";
import { useTheme } from "next-themes";

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    username: "",
    avatar_url: "",
    email: "",
  });
  const [notifications, setNotifications] = useState({
    missions: true,
    achievements: true,
    dailyReminder: true,
  });
  const [xpSettings, setXpSettings] = useState({
    showXpPopups: true,
    soundEffects: false,
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      setProfile(prev => ({ ...prev, email: user.email || "" }));
      loadSettings();
    }
  }, [user]);

  const loadSettings = () => {
    const savedNotifications = localStorage.getItem("notifications");
    const savedXpSettings = localStorage.getItem("xpSettings");
    
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
    if (savedXpSettings) {
      setXpSettings(JSON.parse(savedXpSettings));
    }
  };

  const fetchProfile = async () => {
    try {
      const data: any = await api.getProfile();
      if (data) {
        setProfile(prev => ({
          ...prev,
          username: data.username || "",
          avatar_url: data.avatar_url || "",
        }));
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      await api.updateProfile({
        username: profile.username,
        avatar_url: profile.avatar_url,
      });
      toast.success(t("profileUpdated") || "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(t("error") || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
    toast.success("Notification settings updated");
  };

  const handleXpSettingChange = (key: keyof typeof xpSettings) => {
    const updated = { ...xpSettings, [key]: !xpSettings[key] };
    setXpSettings(updated);
    localStorage.setItem("xpSettings", JSON.stringify(updated));
    toast.success("XP settings updated");
  };

  const handleExportData = async () => {
    try {
      const [missions, goals, achievements] = await Promise.all([
        api.getMissions(),
        api.getGoals(),
        api.getAchievements(),
      ]);
      
      const exportData = {
        profile,
        missions,
        goals,
        achievements,
        exportedAt: new Date().toISOString(),
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `life-progress-export-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      
      toast.success("Data exported successfully!");
    } catch (error) {
      toast.error("Failed to export data");
    }
  };

  const handleClearData = async () => {
    if (!confirm("Are you sure you want to clear all your data? This action cannot be undone.")) {
      return;
    }
    
    try {
      const missions = await api.getMissions();
      const goals = await api.getGoals();
      const achievements = await api.getAchievements();
      
      await Promise.all([
        ...missions.map((m: any) => api.deleteMission(m.id)),
        ...goals.map((g: any) => api.deleteGoal(g.id)),
        ...achievements.map((a: any) => api.deleteAchievement(a.id)),
      ]);
      
      toast.success("All data cleared successfully!");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to clear data");
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-war rounded-xl flex items-center justify-center shadow-glow-war">
          <SettingsIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t("settings") || "Settings"}</h1>
          <p className="text-sm text-muted-foreground">{t("manageProfile") || "Manage your profile and preferences"}</p>
        </div>
      </div>

      <div className="grid gap-6 max-w-3xl">
        {/* Profile Settings */}
        <Card className="border-war/20 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-war" />
              <CardTitle>{t("profileSettings") || "Profile Settings"}</CardTitle>
            </div>
            <CardDescription>
              {t("updateProfileInfo") || "Update your profile information"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">{t("username") || "Username"}</Label>
              <Input
                id="username"
                value={profile.username}
                onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                placeholder={t("enterUsername") || "Enter your username"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">{t("avatarUrl") || "Avatar URL"}</Label>
              <Input
                id="avatar"
                value={profile.avatar_url}
                onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <Button 
              onClick={handleUpdateProfile} 
              disabled={loading}
              className="w-full bg-gradient-war hover:opacity-90 text-white shadow-glow-war"
            >
              {loading ? (t("saving") || "Saving...") : (t("saveChanges") || "Save Changes")}
            </Button>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="border-war/20 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-war" />
              <CardTitle>{t("accountInfo") || "Account Information"}</CardTitle>
            </div>
            <CardDescription>
              {t("viewAccountDetails") || "View your account details"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t("email") || "Email"}</Label>
              <Input value={profile.email} disabled />
            </div>

            <div className="space-y-2">
              <Label>{t("accountId") || "Account ID"}</Label>
              <Input value={user?.id || ""} disabled className="font-mono text-xs" />
            </div>
          </CardContent>
        </Card>

        {/* Database Configuration */}
        <Card className="border-war/20 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-war" />
              <CardTitle>{t("databaseConfig") || "Database Configuration"}</CardTitle>
            </div>
            <CardDescription>
              {t("databaseConfigDesc") || "Your Supabase connection is configured via environment variables"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/50 rounded-lg space-y-2 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">API URL:</span>
                <span className="text-foreground">{import.meta.env.VITE_API_URL || "http://localhost:3000/api"}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status:</span>
                <span className="text-green-500 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Connected
                </span>
              </div>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-sm text-foreground">
                <strong>Note:</strong> To run this project locally with your own database, 
                update the <code className="px-1 py-0.5 bg-muted rounded">.env</code> file in the backend folder with your PostgreSQL credentials. 
                See the <code className="px-1 py-0.5 bg-muted rounded">backend/README.md</code> for instructions.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="border-war/20 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              {theme === "dark" ? <Moon className="w-5 h-5 text-war" /> : <Sun className="w-5 h-5 text-war" />}
              <CardTitle>Appearance</CardTitle>
            </div>
            <CardDescription>
              Customize the look and feel of the app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
              </div>
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="border-war/20 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-war" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>
              Manage your notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mission Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified about mission updates</p>
              </div>
              <Switch
                checked={notifications.missions}
                onCheckedChange={() => handleNotificationChange("missions")}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Achievement Unlocked</Label>
                <p className="text-sm text-muted-foreground">Get notified when you unlock achievements</p>
              </div>
              <Switch
                checked={notifications.achievements}
                onCheckedChange={() => handleNotificationChange("achievements")}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Daily Reminder</Label>
                <p className="text-sm text-muted-foreground">Get daily reminders to complete missions</p>
              </div>
              <Switch
                checked={notifications.dailyReminder}
                onCheckedChange={() => handleNotificationChange("dailyReminder")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Gamification Settings */}
        <Card className="border-war/20 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-war" />
              <CardTitle>Gamification</CardTitle>
            </div>
            <CardDescription>
              Customize your XP and progression experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>XP Popups</Label>
                <p className="text-sm text-muted-foreground">Show XP gained popups when completing missions</p>
              </div>
              <Switch
                checked={xpSettings.showXpPopups}
                onCheckedChange={() => handleXpSettingChange("showXpPopups")}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sound Effects</Label>
                <p className="text-sm text-muted-foreground">Play sound effects for achievements and level ups</p>
              </div>
              <Switch
                checked={xpSettings.soundEffects}
                onCheckedChange={() => handleXpSettingChange("soundEffects")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="border-war/20 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-war" />
              <CardTitle>Data Management</CardTitle>
            </div>
            <CardDescription>
              Export or clear your data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={handleExportData}
              variant="outline"
              className="w-full justify-start"
            >
              <Download className="w-4 h-4 mr-2" />
              Export All Data
            </Button>
            <Button 
              onClick={handleClearData}
              variant="destructive"
              className="w-full justify-start"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Data
            </Button>
          </CardContent>
        </Card>

        {/* App Information */}
        <Card className="border-war/20 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-war" />
              <CardTitle>{t("appInfo") || "App Information"}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version:</span>
              <span className="text-foreground font-mono">1.0.0</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-muted-foreground">Built with:</span>
              <span className="text-foreground">React + TypeScript + Node.js + PostgreSQL</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
