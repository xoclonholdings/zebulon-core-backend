import { useEffect, useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatArea from "@/components/chat/ChatArea";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import zLogoPath from "@assets/IMG_2227_1753477194826.png";
import type { Conversation, Message, File as DBFile } from "@shared/schema";

export default function Chat() {
  const { id: conversationId } = useParams<{ id?: string }>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true); // Always show sidebar on desktop
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
  const { data: messages = [], isLoading: messagesLoading, error: messagesError } = useQuery<Message[]>({
    queryKey: ["/api/conversations", conversationId, "messages"],
    enabled: !!conversationId,
    refetchInterval: 5000, // Refresh every 5 seconds when active
  });

  // Fetch files for current conversation
  const { data: files = [] } = useQuery<DBFile[]>({
    queryKey: ["/api/conversations", conversationId, "files"],
    enabled: !!conversationId,
  });

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'fixed inset-y-0 left-0 z-50 w-80' : 'w-80'} 
        ${isMobile && !isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}
        transition-transform duration-200 ease-in-out
        bg-gray-900 border-r border-gray-800
      `}>
        <ChatSidebar 
          conversations={conversations} 
          onClose={() => setIsSidebarOpen(false)}
          isMobile={isMobile}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
      </div>
      
      {/* Mobile Backdrop */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Main Chat Area */}
        <div className="flex-1 min-h-0">
          <ChatArea 
            conversation={currentConversation}
            messages={messages}
            files={files}
            conversationId={conversationId}
            isMobile={isMobile}
            onOpenSidebar={() => setIsSidebarOpen(true)}
          />
        </div>
      </div>
    </div>
  );
}
