import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Plus, Trash2, FileText, User, Settings } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Conversation } from "@shared/schema";

interface ChatSidebarProps {
  conversations: Conversation[];
  currentConversationId?: string;
}

export default function ChatSidebar({ conversations, currentConversationId }: ChatSidebarProps) {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createConversationMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/conversations", {
        title: "New Analysis"
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      setLocation(`/chat/${data.id}`);
      toast({
        title: "New conversation created",
        description: "Ready to start your analysis!"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create new conversation",
        variant: "destructive"
      });
    }
  });

  const deleteConversationMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/conversations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      if (currentConversationId && conversations.find(c => c.id === currentConversationId)) {
        setLocation("/");
      }
      toast({
        title: "Conversation deleted",
        description: "The conversation has been removed."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive"
      });
    }
  });

  const formatTimeAgo = (date: Date | string | null | undefined) => {
    if (!date) return "Unknown";
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <Brain className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">ZED</h1>
            <p className="text-sm text-gray-500">AI Assistant</p>
          </div>
        </div>
      </div>

      {/* New Conversation Button */}
      <div className="p-4">
        <Button 
          onClick={() => createConversationMutation.mutate()}
          disabled={createConversationMutation.isPending}
          className="w-full bg-primary hover:bg-primary/90"
        >
          <Plus className="mr-2" size={16} />
          New Analysis
        </Button>
      </div>

      {/* Conversation History */}
      <div className="flex-1 overflow-y-auto px-4">
        <div className="space-y-2">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="mx-auto mb-2" size={24} />
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs">Start by creating a new analysis</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <Card
                key={conversation.id}
                className={`group p-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                  conversation.id === currentConversationId 
                    ? "bg-primary/5 border-primary/20" 
                    : "border-gray-200"
                }`}
              >
                <Link href={`/chat/${conversation.id}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-medium truncate ${
                        conversation.id === currentConversationId 
                          ? "text-primary" 
                          : "text-gray-900"
                      }`}>
                        {conversation.title}
                      </h3>
                      {conversation.preview && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {conversation.preview}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 mt-2">
                        <span className={`text-xs ${
                          conversation.id === currentConversationId 
                            ? "text-primary" 
                            : "text-gray-400"
                        }`}>
                          {formatTimeAgo(conversation.updatedAt)}
                        </span>
                        {conversation.isActive && (
                          <span className="text-xs text-accent">Active</span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 h-auto p-1"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        deleteConversationMutation.mutate(conversation.id);
                      }}
                      disabled={deleteConversationMutation.isPending}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </Link>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="text-gray-600" size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">Demo User</p>
            <p className="text-xs text-gray-500">ZED Assistant</p>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
            <Settings size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
