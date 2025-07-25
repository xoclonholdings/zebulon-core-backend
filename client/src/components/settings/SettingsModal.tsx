import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, User, Lock, Save, Eye, EyeOff } from "lucide-react";
import zLogoPath from "@assets/IMG_2227_1753477194826.png";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface CredentialsForm {
  newUsername: string;
  newPassword: string;
  confirmPassword: string;
}

export default function SettingsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState<CredentialsForm>({
    newUsername: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current credentials
  const { data: currentUser } = useQuery({
    queryKey: ["/api/auth/current-credentials"],
    enabled: isOpen,
  });

  // Update credentials mutation
  const updateCredentialsMutation = useMutation({
    mutationFn: async (data: { newUsername: string; newPassword: string }) => {
      return await apiRequest("/api/auth/update-credentials", "POST", data);
    },
    onSuccess: (data) => {
      toast({
        title: "Credentials Updated",
        description: "Your login credentials have been changed successfully.",
      });
      setForm({ newUsername: "", newPassword: "", confirmPassword: "" });
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/current-credentials"] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update credentials",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.newUsername || !form.newPassword) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (form.newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    updateCredentialsMutation.mutate({
      newUsername: form.newUsername,
      newPassword: form.newPassword,
    });
  };

  const handleFormChange = (field: keyof CredentialsForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start zed-button"
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="zed-glass border-white/10 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <img src={zLogoPath} alt="Z" className="h-5 w-5" />
            <span>ZED Settings</span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Manage your account and login credentials
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current User Info */}
          <Card className="zed-glass border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                <User className="h-4 w-4" />
                Current Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                <div>Username: <span className="text-foreground font-medium">{(currentUser as any)?.username || "admin"}</span></div>
              </div>
            </CardContent>
          </Card>

          {/* Update Credentials */}
          <Card className="zed-glass border-white/10">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                <Lock className="h-4 w-4" />
                Update Login Credentials
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Change your username and password for <span className="inline-flex items-center gap-1"><img src={zLogoPath} alt="Z" className="h-3 w-3" />ZED</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newUsername" className="text-sm text-foreground">New Username</Label>
                  <Input
                    id="newUsername"
                    type="text"
                    placeholder="Enter new username"
                    value={form.newUsername}
                    onChange={(e) => handleFormChange("newUsername", e.target.value)}
                    className="zed-input"
                    disabled={updateCredentialsMutation.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm text-foreground">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password (min 6 chars)"
                      value={form.newPassword}
                      onChange={(e) => handleFormChange("newPassword", e.target.value)}
                      className="zed-input pr-10"
                      disabled={updateCredentialsMutation.isPending}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm text-foreground">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={form.confirmPassword}
                      onChange={(e) => handleFormChange("confirmPassword", e.target.value)}
                      className="zed-input pr-10"
                      disabled={updateCredentialsMutation.isPending}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full zed-gradient hover:zed-gradient-hover text-white"
                  disabled={updateCredentialsMutation.isPending}
                >
                  {updateCredentialsMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Updating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Save size={16} />
                      <span>Update Credentials</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}