import { useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatArea from "@/components/chat/ChatArea";
import SessionPanel from "@/components/chat/SessionPanel";
import { apiRequest } from "@/lib/queryClient";
import type { Conversation, Message, File, Session } from "@shared/schema";

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

  // Fetch session info
  const { data: session } = useQuery<Session>({
    queryKey: ["/api/conversations", conversationId, "session"],
    enabled: !!conversationId,
  });

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <ChatSidebar 
        conversations={conversations}
        currentConversationId={conversationId}
      />
      
      <div className="flex-1 flex">
        <ChatArea 
          conversation={currentConversation}
          messages={messages}
          conversationId={conversationId}
        />
        
        <SessionPanel 
          conversation={currentConversation}
          files={files}
          session={session}
        />
      </div>
    </div>
  );
}
