import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Plus, 
  Paperclip, 
  Mic,
  Sparkles,
  Zap,
  Rss,
  MessageSquare,
  Settings
} from "lucide-react";
import zLogoPath from "@assets/IMG_2227_1753477194826.png";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import FileUpload from "./FileUpload";
import ChatMessage from "./ChatMessage";
import SocialFeed from "../social/SocialFeed";
import ModeSelector from "./ModeSelector";
import InlineChatPanel from "./InlineChatPanel";
import { useChat } from "@/hooks/use-chat";
import type { Conversation, Message, File as DBFile, ConversationMode } from "@shared/schema";

interface ChatAreaProps {
  conversation?: Conversation;
  messages: Message[];
  files: DBFile[];
  conversationId?: string;
  isMobile?: boolean;
  onOpenSidebar?: () => void;
}

export default function ChatArea({ conversation, messages, files, conversationId, isMobile = false, onOpenSidebar }: ChatAreaProps) {
  const [inputValue, setInputValue] = useState("");
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showSocialFeed, setShowSocialFeed] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [currentMode, setCurrentMode] = useState<ConversationMode>(conversation?.mode as ConversationMode || "chat");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  
  const { isStreaming, streamingMessage, sendMessage: sendChatMessage } = useChat(conversationId);

  const updateModeMutation = useMutation({
    mutationFn: async (mode: ConversationMode) => {
      if (!conversationId) return;
      return await apiRequest(`/api/conversations/${conversationId}`, "PATCH", { mode });
    },
    onSuccess: () => {
      if (conversationId) {
        queryClient.invalidateQueries({ queryKey: ["/api/conversations", conversationId] });
      }
    },
  });

  // Debug logging for ChatArea
  console.log("💬 ChatArea Debug:", {
    conversationId,
    messagesCount: messages.length,
    hasMessages: messages.length > 0,
    conversation: conversation?.id,
    firstMessage: messages[0]?.content?.substring(0, 50)
  });

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const message = inputValue.trim();
    console.log("🚀 User sending message:", message);
    console.log("📍 Conversation ID:", conversationId);
    console.log("🎯 Current mode:", currentMode);
    
    if (!conversationId) {
      console.error("❌ No conversation ID - creating new conversation");
      // Create a new conversation first
      try {
        const response = await apiRequest("POST", "/api/conversations", { mode: currentMode });
        const newConversation = await response.json() as { id: string };
        window.history.pushState({}, '', `/chat/${newConversation.id}`);
        return;
      } catch (error) {
        console.error("❌ Failed to create conversation:", error);
        return;
      }
    }
    
    setInputValue("");
    
    try {
      // Use the new AI routing sendMessage function from useChat
      await sendChatMessage(message);
    } catch (error) {
      console.error("❌ Handle send error:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleModeChange = async (mode: ConversationMode) => {
    setCurrentMode(mode);
    if (conversationId) {
      try {
        await updateModeMutation.mutateAsync(mode);
      } catch (error) {
        // Error handled by UI feedback
      }
    }
    setShowModeSelector(false);
  };

  const handleFileUpload = (files: any[]) => {
    if (conversationId) {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", conversationId, "files"] });
    }
    setShowFileUpload(false);
  };

  const handleEmojiSelect = (emoji: string) => {
    setInputValue(prev => prev + emoji);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleGifSelect = (gif: string) => {
    setInputValue(prev => prev + `![GIF](${gif})`);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleTranslate = (text: string, targetLang: string) => {
    if (inputValue.trim()) {
      setInputValue(prev => `[Translate to ${targetLang}]: ${prev}`);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMessage]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    
    // Hide welcome message when user starts typing
    if (inputValue.trim() && !hasStartedTyping) {
      setHasStartedTyping(true);
    }
  }, [inputValue, hasStartedTyping]);

  return (
    <div className="flex-1 flex h-screen-mobile relative overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-600/10 to-cyan-500/10 rounded-full blur-3xl zed-float" />
          <div className="absolute bottom-40 right-20 w-48 h-48 bg-gradient-to-r from-pink-500/10 to-purple-600/10 rounded-full blur-3xl zed-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 rounded-full blur-2xl zed-float" style={{ animationDelay: '4s' }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-white/10 zed-glass relative z-10 flex-shrink-0">
          <Button
            variant="ghost"
            size="lg"
            className="flex items-center space-x-3 p-2 h-auto hover:bg-white/5 transition-all duration-300 rounded-lg hover:scale-105"
            onClick={() => {
              console.log('ChatArea ZED header clicked!', { isMobile, onOpenSidebar });
              if (onOpenSidebar) {
                onOpenSidebar();
              }
            }}
          >
            <img src={zLogoPath} alt="Z" className="w-6 h-6 md:w-8 md:h-8" />
            <div className="text-left">
              <h1 className="text-lg md:text-xl font-bold">
                <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">ZED</span>
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">Enhanced AI Assistant</p>
            </div>
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSocialFeed(!showSocialFeed)}
              className={`zed-button rounded-xl btn-touch ${showSocialFeed ? 'text-purple-400' : 'text-muted-foreground'}`}
            >
              <Rss size={16} />
            </Button>
            <Badge variant="secondary" className="zed-glass border-purple-500/20 text-purple-300">
              <Sparkles size={12} className="mr-1" />
              Active
            </Badge>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-2 md:px-4 py-2 md:py-3 space-y-2 md:space-y-3 relative z-10">
          {/* Debug info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-muted-foreground bg-red-900/20 p-1 rounded text-center">
              Debug: Messages: {messages.length}, Streaming: {isStreaming.toString()}, Typing: {hasStartedTyping.toString()}
            </div>
          )}
          
          {/* Only show welcome message if no messages AND user hasn't started typing */}
          {messages.length === 0 && !isStreaming && !hasStartedTyping ? (
            <div className="flex items-center justify-center min-h-[30vh]">
              <Card className="max-w-sm p-3 zed-message zed-morph-border text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <img src={zLogoPath} alt="Z" className="w-4 h-4" />
                  <span className="text-lg font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">ZED</span>
                  <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300">AI Assistant</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  Enhanced AI assistant ready to help
                </p>
                <div className="text-xs text-muted-foreground/70 flex items-center justify-center">
                  <Zap size={10} className="mr-1 text-cyan-400" />
                  Start typing to begin
                </div>
              </Card>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-2 md:space-y-3">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No messages yet</p>
                  <p className="text-xs">Send a message to start chatting</p>
                </div>
              )}
            </div>
          )}

          {/* Streaming message */}
          {isStreaming && (
            <div className="flex items-start space-x-2 max-w-4xl mx-auto">
              <Card className="flex-1 p-3 md:p-4 zed-message zed-glow ml-2">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <img src={zLogoPath} alt="Z" className="w-3 h-3" />
                    <span className="text-sm font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">ZED</span>
                  </div>  
                  <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                    <div className="flex items-center space-x-1">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full zed-typing" />
                      <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full zed-typing" style={{ animationDelay: '0.3s' }} />
                      <div className="w-1.5 h-1.5 bg-pink-400 rounded-full zed-typing" style={{ animationDelay: '0.6s' }} />
                    </div>
                  </Badge>
                </div>
                <div className="prose prose-sm max-w-none">
                  {streamingMessage ? (
                    <p className="whitespace-pre-wrap text-sm">{streamingMessage}</p>
                  ) : (
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Sparkles size={14} className="animate-pulse" />
                      <span>Thinking...</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* File Upload Area */}
        {showFileUpload && conversationId && (
          <FileUpload
            conversationId={conversationId}
            onUpload={handleFileUpload}
            onClose={() => setShowFileUpload(false)}
          />
        )}

        {/* Mode Selector */}
        {showModeSelector && (
          <div className="border-t border-white/10 p-4 md:p-6 zed-glass relative z-20 max-h-[60vh] overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <ModeSelector
                selectedMode={currentMode}
                onModeChange={handleModeChange}
                disabled={updateModeMutation.isPending}
              />
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-white/10 zed-glass p-2 md:p-3 relative z-10 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-end space-x-2">
              <div className="flex-1 relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFileUpload(true)}
                      className="zed-button text-muted-foreground hover:text-purple-400 h-auto p-1.5 rounded-lg btn-touch"
                    >
                      <Paperclip size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="zed-button text-muted-foreground hover:text-cyan-400 h-auto p-1.5 rounded-lg btn-touch"
                    >
                      <Mic size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowModeSelector(!showModeSelector)}
                      className="zed-button text-muted-foreground hover:text-cyan-400 h-auto px-2 py-1.5 rounded-lg flex items-center space-x-1 btn-touch"
                    >
                      {currentMode === "chat" ? <MessageSquare size={12} /> : <img src={zLogoPath} alt="Z" className="w-3 h-3" />}
                      <span className="text-xs capitalize">{currentMode}</span>
                      <Settings size={8} />
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center">
                    <Sparkles size={10} className="mr-1 text-purple-400" />
                    Ready
                  </div>
                </div>
                <div className="relative border border-input rounded-lg bg-background overflow-hidden focus-within:ring-1 focus-within:ring-ring">
                  <div className="flex items-end">
                    {/* Left side: Inline Panel */}
                    <div className="flex items-center pl-2 py-1.5 border-r border-input/50">
                      <InlineChatPanel
                        onEmojiSelect={handleEmojiSelect}
                        onGifSelect={handleGifSelect}
                        onTranslate={handleTranslate}
                      />
                    </div>
                    
                    {/* Center: Text Area */}
                    <Textarea
                      ref={textareaRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={`Message ZED in ${currentMode} mode...`}
                      className="flex-1 bg-transparent border-0 resize-none min-h-[40px] text-sm px-3 py-2 pr-16 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      rows={1}
                      disabled={isStreaming}
                    />
                    
                    {/* Right side: Action buttons */}
                    <div className="flex items-center space-x-1 pr-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowFileUpload(true)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-purple-400 transition-colors"
                        disabled={isStreaming}
                      >
                        <Paperclip size={12} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-cyan-400 transition-colors"
                        disabled={isStreaming}
                      >
                        <Mic size={12} />
                      </Button>
                      <Button
                        onClick={handleSend}
                        size="sm"
                        className="zed-gradient hover:shadow-md hover:shadow-purple-500/25 zed-button rounded-lg h-6 w-6 p-0 transition-all duration-200 hover:scale-105"
                        disabled={!inputValue.trim() || isStreaming}
                      >
                        <Send size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Feed Panel */}
      {showSocialFeed && !isMobile && (
        <div className="w-96 border-l border-white/10 zed-sidebar">
          <SocialFeed />
        </div>
      )}
    </div>
  );
}

type ChatMessage = {
  metadata: unknown;
  id: string;
  role: string;
  content: string;
  createdAt: Date | null;
  conversationId: string;
  attachments?: any[]; // Add this line
};