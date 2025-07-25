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

import { Settings, User, Lock, Save, Eye, EyeOff, Users } from "lucide-react";
import zLogoPath from "@assets/IMG_2227_1753477194826.png";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import UserManagement from "@/components/UserManagement";

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
  const { user } = useAuth() as { user?: any };

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
      <DialogContent className="zed-glass border-white/10 max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <img src={zLogoPath} alt="Z" className="h-4 w-4" />
            <span><span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">ZED</span> Settings</span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Manage your account and login credentials
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Check if user is admin for additional options */}
          {user?.username === 'Admin' ? (
            <div className="space-y-6">
              {/* Admin Panel Header */}
              <div className="flex items-center space-x-3 pb-4 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-lg font-semibold text-white">Admin Panel</span>
                </div>
              </div>

              {/* User Management Section */}
              <UserManagement />
            </div>
          ) : (
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
                    <div>Username: <span className="text-foreground font-medium">{user?.username || "user"}</span></div>
                  </div>
                </CardContent>
              </Card>

              {/* Limited Options for Non-Admin Users */}
              <Card className="zed-glass border-white/10">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2 text-foreground">
                    <Settings className="h-4 w-4" />
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>• Session expires in 45 minutes of inactivity</p>
                    <p>• Enhanced security with device verification</p>
                    <p>• Contact admin for account modifications</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}