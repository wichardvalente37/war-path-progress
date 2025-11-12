import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Settings as SettingsIcon, User, Mail, Award, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { t } from "@/lib/i18n";

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    username: "",
    avatar_url: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      setProfile(prev => ({ ...prev, email: user.email || "" }));
    }
  }, [user]);

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
