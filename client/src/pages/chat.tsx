import { useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatArea from "@/components/chat/ChatArea";
import { apiRequest } from "@/lib/queryClient";
import type { Conversation, Message, File } from "@shared/schema";

export default function Chat() {
  const { id: conversationId } = useParams<{ id?: string }>();

  // Fetch conversations for sidebar
  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch current conversation if ID provided
  const { data: currentConversation } = useQuery<Conversation>({
    queryKey: ["/api/conversations", conversationId],
    enabled: !!conversationId,
  });

  // Fetch messages for current conversation
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ["/api/conversations", conversationId, "messages"],
    enabled: !!conversationId,
    refetchInterval: 5000, // Refresh every 5 seconds when active
  });

  // Fetch files for current conversation
  const { data: files = [] } = useQuery<File[]>({
    queryKey: ["/api/conversations", conversationId, "files"],
    enabled: !!conversationId,
  });

  return (
    <div className="flex h-screen bg-black relative overflow-hidden">
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{
             backgroundImage: `
               linear-gradient(rgba(139, 0, 255, 0.3) 1px, transparent 1px),
               linear-gradient(90deg, rgba(139, 0, 255, 0.3) 1px, transparent 1px)
             `,
             backgroundSize: '40px 40px'
           }} />
      
      {/* Cyberpunk Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl zed-float" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl zed-float" style={{ animationDelay: '4s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl zed-float" style={{ animationDelay: '2s' }} />
      </div>
      
      <ChatSidebar conversations={conversations} />
      <ChatArea 
        conversation={currentConversation}
        messages={messages}
        files={files}
        conversationId={conversationId}
      />
    </div>
  );
}
