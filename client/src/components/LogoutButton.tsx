import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function LogoutButton() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.clear();
      toast({
        title: "Logged out",
        description: "Successfully logged out of ZED",
      });
      // Reload to clear all state
      window.location.reload();
    },
    onError: () => {
      toast({
        title: "Logout failed",
        description: "Failed to logout properly",
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      disabled={logoutMutation.isPending}
      className="text-red-400 hover:text-red-300 hover:bg-red-500/20 h-auto px-2 py-1"
    >
      <LogOut size={14} />
    </Button>
  );
}