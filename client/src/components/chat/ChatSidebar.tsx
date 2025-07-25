import { useState } from "react";
import { Button } from "@/components/ui/button";

import { 
  MessageSquare, 
  Plus, 
  Trash2, 
  User, 
  X, 
  Brain,
  Sparkles,
  Zap,
  ShoppingBag
} from "lucide-react";
import { useLocation, Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import type { Conversation } from "@shared/schema";

import LogoutButton from "@/components/LogoutButton";

interface ChatSidebarProps {
  conversations: Conversation[];
}

interface LocalUser {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}

export default function ChatSidebar({ conversations }: ChatSidebarProps) {
  const [location] = useLocation();
  const queryClient = useQueryClient();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useAuth() as { user?: LocalUser };

  const createConversationMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("/api/conversations", "POST", { 
        title: "New Conversation",
        mode: "chat"
      });
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      window.history.pushState({}, '', `/chat/${data.id}`);
    },
  });

  const deleteConversationMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/api/conversations/${id}`, "DELETE");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
    },
  });

  const formatDate = (dateInput: string | Date | null): string => {
    if (!dateInput) return "";
    
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
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
      <div className="w-16 flex flex-col items-center py-4 space-y-4 zed-glass border-r border-white/10 backdrop-blur-xl">
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

        {/* Collapsed Status */}
        <div className="w-full">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 flex flex-col h-full relative zed-glass border-r border-white/10 backdrop-blur-xl">
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

        {/* New Conversation Button */}
        <Button
          onClick={() => createConversationMutation.mutate()}
          disabled={createConversationMutation.isPending}
          className="w-full zed-gradient rounded-xl p-4 text-white font-medium zed-button"
        >
          <div className="flex items-center justify-center space-x-2">
            <Plus size={18} />
            <span>New Conversation</span>
            <Sparkles size={14} className="text-purple-200" />
          </div>
        </Button>

        {/* Navigation */}
        <div className="mt-4 space-y-2">
          <Link href="/flipshop">
            <Button
              variant="ghost"
              className="w-full justify-start space-x-3 h-12 text-left zed-button text-muted-foreground hover:text-foreground"
            >
              <ShoppingBag size={18} />
              <span>Flip.Shop</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 px-4 overflow-y-auto">
        <div className="space-y-2 py-4">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs">Start a new chat to begin</p>
            </div>
          ) : (
            conversations.map((conversation) => {
              const isActive = location === `/chat/${conversation.id}` || location === `/chat/${conversation.id}/`;
              const date = conversation.updatedAt || conversation.createdAt;
              
              return (
                <div
                  key={conversation.id}
                  className={`
                    group relative p-3 rounded-xl cursor-pointer transition-all zed-button
                    ${isActive 
                      ? 'zed-glass border-purple-500/50 shadow-lg shadow-purple-500/20' 
                      : 'hover:bg-white/5'
                    }
                  `}
                  onClick={() => window.history.pushState({}, '', `/chat/${conversation.id}`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-foreground truncate mb-1">
                        {conversation.title || 'New Conversation'}
                      </h3>
                      {conversation.preview && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {conversation.preview}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(date)}
                        </span>
                        {conversation.mode && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            conversation.mode === 'agent' 
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'bg-cyan-500/20 text-cyan-400'
                          }`}>
                            {conversation.mode}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteConversation(e, conversation.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 hover:bg-red-500/20 h-auto p-1 ml-2 rounded-lg"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Status */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-muted-foreground">System Online</span>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 relative z-10">
        <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
          <Zap size={12} className="text-purple-400" />
          <span>Powered by OpenAI</span>
          <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
          <span>Local Auth</span>
        </div>
      </div>
    </div>
  );
}