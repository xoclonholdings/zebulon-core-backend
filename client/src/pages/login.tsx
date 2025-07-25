import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Eye, EyeOff, Sparkles, Brain, Zap } from "lucide-react";

export default function Login() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const { toast } = useToast();



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



  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle animated background elements matching chat interface */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl zed-float" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl zed-float" style={{ animationDelay: '4s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl zed-float" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" 
           style={{
             backgroundImage: `
               linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
             `,
             backgroundSize: '50px 50px'
           }} />

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
          <p className="text-muted-foreground mt-2">Enhanced AI Assistant</p>
        </div>

        <Card className="zed-glass border-white/10">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-foreground">Sign In</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Enter your credentials to access ZED
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Username</label>
                <Input
                  type="text"
                  placeholder="Enter username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="zed-input"
                  disabled={loginMutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="zed-input pr-10"
                    disabled={loginMutation.isPending}
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

              <Button
                type="submit"
                className="w-full zed-gradient hover:zed-gradient-hover text-white"
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
            <div className="zed-glass border-white/10 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Sparkles className="h-4 w-4 text-purple-400 mt-0.5" />
                <div className="text-foreground text-sm">
                  <strong>Demo Credentials:</strong><br />
                  admin/admin123 • demo/demo123 • test/test123
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-muted-foreground text-sm mt-6">
          Local authentication • No external dependencies
        </p>
      </div>
    </div>
  );
}