import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Eye, EyeOff, Sparkles, Brain, Zap } from "lucide-react";

interface LocalUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
}

export default function Login() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const { toast } = useToast();

  // Get available users
  const { data: users = [] } = useQuery<LocalUser[]>({
    queryKey: ["/api/auth/users"],
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Login failed");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Welcome to ZED",
        description: "Successfully logged in!",
      });
      // Reload to trigger auth check
      window.location.reload();
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      toast({
        title: "Missing credentials",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate(credentials);
  };

  const handleUserSelect = (user: LocalUser) => {
    setSelectedUser(user.username);
    setCredentials({
      username: user.username,
      password: "", // User still needs to enter password
    });
  };

  const quickLogin = (username: string, password: string) => {
    setCredentials({ username, password });
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/3 left-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* ZED Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Brain className="w-12 h-12 text-purple-400 animate-pulse" />
              <Zap className="w-6 h-6 text-cyan-400 absolute -top-1 -right-1 animate-bounce" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-pink-400 bg-clip-text text-transparent">
            ZED
          </h1>
          <p className="text-slate-400 mt-2">Enhanced AI Assistant</p>
        </div>

        <Card className="bg-black/40 border-purple-500/30 backdrop-blur-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">Sign In</CardTitle>
            <CardDescription className="text-center text-slate-400">
              Enter your credentials to access ZED
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quick User Selection */}
            {users.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-slate-400">Quick Login (Demo Users):</p>
                <div className="grid gap-2">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={user.profileImageUrl}
                          alt={user.username}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="text-sm font-medium text-white">{user.username}</p>
                          <p className="text-xs text-slate-400">{user.firstName} {user.lastName}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => quickLogin(user.username, user.username + "123")}
                        className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/20"
                        disabled={loginMutation.isPending}
                      >
                        Login
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex items-center my-4">
                  <div className="flex-1 border-t border-slate-700"></div>
                  <span className="px-3 text-xs text-slate-500">OR</span>
                  <div className="flex-1 border-t border-slate-700"></div>
                </div>
              </div>
            )}

            {/* Manual Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Username</label>
                <Input
                  type="text"
                  placeholder="Enter username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500"
                  disabled={loginMutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-500 pr-10"
                    disabled={loginMutation.isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Sparkles size={16} />
                    <span>Sign In</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Demo Info */}
            <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Sparkles className="h-4 w-4 text-purple-400 mt-0.5" />
                <div className="text-slate-300 text-sm">
                  <strong>Demo Credentials:</strong><br />
                  admin/admin123, demo/demo123, test/test123
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-slate-500 text-sm mt-6">
          Local authentication • No external dependencies
        </p>
      </div>
    </div>
  );
}