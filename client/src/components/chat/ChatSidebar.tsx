import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LogoutButton from "../auth/LogoutButton";
import SatelliteConnection from "../satellite/SatelliteConnection";
import PhoneLink from "../phone/PhoneLink";
import { useAuth } from "@/hooks/useAuth";
import { 
  Plus, 
  MessageSquare, 
  Brain,
  Sparkles,
  Zap,
  X,
  User
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Link, useLocation } from "wouter";
import type { Conversation } from "@shared/schema";

interface ChatSidebarProps {
  conversations: Conversation[];
}

export default function ChatSidebar({ conversations }: ChatSidebarProps) {
  const [location] = useLocation();
  const queryClient = useQueryClient();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth();

  const createConversationMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/conversations", {
        method: "POST",
        body: JSON.stringify({ title: "New Conversation" }),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      window.history.pushState({}, '', `/chat/${data.id}`);
    },
  });

  const deleteConversationMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/conversations/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
    },
  });

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return "Today";
    } else if (diffInHours < 168) {
      return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
    } else {
      return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
    }
  };

  const handleDeleteConversation = async (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    await deleteConversationMutation.mutateAsync(id);
    
    if (location.includes(id)) {
      window.history.pushState({}, '', '/chat');
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-16 zed-sidebar flex flex-col items-center py-4 space-y-4">
        <Button
          onClick={() => setIsCollapsed(false)}
          variant="ghost"
          size="sm"
          className="w-10 h-10 zed-button rounded-xl"
        >
          <MessageSquare size={20} />
        </Button>
        
        <Button 
          onClick={() => createConversationMutation.mutate()}
          className="w-10 h-10 zed-gradient rounded-xl zed-button p-0"
          disabled={createConversationMutation.isPending}
        >
          <Plus size={20} />
        </Button>

        {/* Collapsed Connectivity */}
        <div className="w-full space-y-2">
          <SatelliteConnection isCollapsed={true} />
          <PhoneLink isCollapsed={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 zed-sidebar flex flex-col h-full relative">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-4 w-20 h-20 bg-purple-600/5 rounded-full blur-2xl zed-float" />
        <div className="absolute bottom-20 right-4 w-16 h-16 bg-cyan-500/5 rounded-full blur-xl zed-float" style={{ animationDelay: '3s' }} />
      </div>

      {/* Header */}
      <div className="p-6 border-b border-white/10 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 zed-avatar rounded-2xl flex items-center justify-center relative">
              <div className="relative z-10">
                <Brain className="text-white" size={20} />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                ZED
              </h2>
              <p className="text-xs text-muted-foreground">AI Assistant</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <LogoutButton />
            <Button
              onClick={() => setIsCollapsed(true)}
              variant="ghost"
              size="sm"
              className="w-8 h-8 zed-button rounded-xl p-0 text-muted-foreground hover:text-foreground"
            >
              <X size={16} />
            </Button>
          </div>
        </div>

        {/* User Info */}
        {user && (
          <div className="flex items-center space-x-3 p-3 rounded-xl zed-glass mb-4">
            <div className="w-8 h-8 zed-avatar rounded-xl flex items-center justify-center">
              {user.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-full h-full rounded-xl object-cover"
                />
              ) : (
                <User size={16} className="text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user.firstName || user.lastName ? 
                  `${user.firstName || ''} ${user.lastName || ''}`.trim() : 
                  user.email?.split('@')[0] || 'User'
                }
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}
        
        <Button 
          onClick={() => createConversationMutation.mutate()}
          className="w-full zed-gradient hover:shadow-lg hover:shadow-purple-500/25 zed-button rounded-xl h-12"
          disabled={createConversationMutation.isPending}
        >
          <Plus size={18} className="mr-2" />
          <span className="font-medium">New Chat</span>
          <Sparkles size={14} className="ml-2 opacity-80" />
        </Button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 relative z-10">
        {conversations.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 zed-avatar rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={24} className="text-white" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">No conversations yet</p>
            <p className="text-xs text-muted-foreground/60">Start a new chat to begin</p>
          </div>
        ) : (
          conversations.map((conversation) => {
            const isActive = location.includes(conversation.id);
            return (
              <Link key={conversation.id} href={`/chat/${conversation.id}`}>
                <div className={`group relative p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
                  isActive 
                    ? 'zed-glass border-purple-500/30 zed-glow' 
                    : 'hover:bg-white/5 border border-transparent hover:border-white/10'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${
                          isActive ? 'bg-purple-400' : 'bg-muted-foreground/40'
                        }`} />
                        <h3 className={`text-sm font-medium truncate ${
                          isActive ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {conversation.title}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className={`text-xs px-2 py-0.5 ${
                          isActive 
                            ? 'border-purple-500/30 text-purple-300' 
                            : 'border-white/10 text-muted-foreground/60'
                        }`}>
                          {formatDate(new Date(conversation.updatedAt))}
                        </Badge>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 p-0 hover:bg-red-500/20 hover:text-red-400 rounded-lg"
                      onClick={(e) => handleDeleteConversation(e, conversation.id)}
                    >
                      <X size={12} />
                    </Button>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 relative z-10">
        <div className="flex items-center space-x-3 p-3 rounded-2xl zed-glass">
          <div className="w-8 h-8 zed-avatar rounded-xl flex items-center justify-center relative">
            <div className="relative z-10">
              <Zap className="text-white" size={14} />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">Demo User</p>
            <p className="text-xs text-muted-foreground">Enhanced Assistant</p>
          </div>
          <Badge variant="outline" className="border-purple-500/30 text-purple-300 text-xs">
            Active
          </Badge>
        </div>
      </div>
    </div>
  );
}