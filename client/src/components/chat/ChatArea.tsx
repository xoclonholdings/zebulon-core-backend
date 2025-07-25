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
import { useChat } from "@/hooks/use-chat";
import type { Conversation, Message, File, ConversationMode } from "@shared/schema";

interface ChatAreaProps {
  conversation?: Conversation;
  messages: Message[];
  files: File[];
  conversationId?: string;
}

export default function ChatArea({ conversation, messages, files, conversationId }: ChatAreaProps) {
  const [inputValue, setInputValue] = useState("");
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showSocialFeed, setShowSocialFeed] = useState(false);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [currentMode, setCurrentMode] = useState<ConversationMode>(conversation?.mode as ConversationMode || "chat");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  
  const { isStreaming, streamingMessage } = useChat(conversationId);

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { message: string; conversationId?: string; mode?: ConversationMode }) => {
      return await apiRequest("/api/chat", "POST", { ...data, mode: currentMode });
    },
    onSuccess: () => {
      if (conversationId) {
        queryClient.invalidateQueries({ queryKey: ["/api/conversations", conversationId, "messages"] });
        queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      }
    },
  });

  const updateModeMutation = useMutation({
    mutationFn: async (mode: ConversationMode) => {
      if (!conversationId) return;
      return await apiRequest(`/api/conversations/${conversationId}`, "PATCH", { mode });
    },
    onSuccess: () => {
      if (conversationId) {
        queryClient.invalidateQueries({ queryKey: ["/api/conversations", conversationId] });
        queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
      }
    },
  });

  const handleSend = async () => {
    if (!inputValue.trim() || sendMessageMutation.isPending || isStreaming) return;

    const message = inputValue.trim();
    setInputValue("");

    try {
      await sendMessageMutation.mutateAsync({ 
        message, 
        conversationId,
        mode: currentMode
      });
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleModeChange = async (mode: ConversationMode) => {
    setCurrentMode(mode);
    if (conversationId && mode !== conversation?.mode) {
      try {
        await updateModeMutation.mutateAsync(mode);
      } catch (error) {
        console.error("Failed to update mode:", error);
      }
    }
    setShowModeSelector(false);
  };

  const handleFileUpload = (files: File[]) => {
    if (conversationId) {
      queryClient.invalidateQueries({ queryKey: ["/api/conversations", conversationId, "files"] });
    }
    setShowFileUpload(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingMessage]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  return (
    <div className="flex-1 flex h-full relative overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-600/10 to-cyan-500/10 rounded-full blur-3xl zed-float" />
        <div className="absolute bottom-40 right-20 w-48 h-48 bg-gradient-to-r from-pink-500/10 to-purple-600/10 rounded-full blur-3xl zed-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 rounded-full blur-2xl zed-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 zed-glass relative z-10">
        <div className="flex items-center space-x-3">
          <div>
            <h1 className="text-xl font-bold flex items-center space-x-2">
              <img src={zLogoPath} alt="Z" className="w-5 h-5" />
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">ZED</span>
            </h1>
            <p className="text-sm text-muted-foreground">Enhanced AI Assistant</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSocialFeed(!showSocialFeed)}
            className={`zed-button rounded-xl ${showSocialFeed ? 'text-purple-400' : 'text-muted-foreground'}`}
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
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 relative z-10">
        {messages.length === 0 && !isStreaming ? (
          <div className="flex items-start space-x-4 max-w-4xl mx-auto">
            <Card className="flex-1 p-6 zed-message zed-morph-border ml-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center space-x-2">
                  <img src={zLogoPath} alt="Z" className="w-4 h-4" />
                  <span className="text-lg font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">ZED</span>
                </div>
                <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300">AI Assistant</Badge>
              </div>
              <div className="prose prose-sm max-w-none">
                <p className="text-lg leading-relaxed">
                  Hello! I'm <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent font-semibold inline-flex items-center gap-1"><img src={zLogoPath} alt="Z" className="w-4 h-4" />ZED</span>, your enhanced AI assistant. I combine advanced AI capabilities with powerful document processing to help you with any task.
                </p>
                <p className="text-sm text-muted-foreground mt-4 flex items-center">
                  <Zap size={16} className="mr-2 text-cyan-400" />
                  Upload files up to 32GB • Analyze documents • Generate insights • Process any data format
                </p>
              </div>
            </Card>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        )}

        {/* Streaming message */}
        {isStreaming && (
          <div className="flex items-start space-x-4 max-w-4xl mx-auto">
            <Card className="flex-1 p-6 zed-message zed-glow ml-4">
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center space-x-2">
                  <img src={zLogoPath} alt="Z" className="w-4 h-4" />
                  <span className="text-lg font-semibold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">ZED</span>
                </div>  
                <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full zed-typing" />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full zed-typing" style={{ animationDelay: '0.3s' }} />
                    <div className="w-2 h-2 bg-pink-400 rounded-full zed-typing" style={{ animationDelay: '0.6s' }} />
                  </div>
                </Badge>
              </div>
              <div className="prose prose-sm max-w-none">
                {streamingMessage ? (
                  <p className="whitespace-pre-wrap">{streamingMessage}</p>
                ) : (
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Sparkles size={16} className="animate-pulse" />
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
        <div className="border-t border-white/10 p-6 zed-glass relative z-10">
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
      <div className="border-t border-white/10 zed-glass p-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-4">
            <div className="flex-1 relative">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFileUpload(true)}
                    className="zed-button text-muted-foreground hover:text-purple-400 h-auto p-2 rounded-xl"
                  >
                    <Paperclip size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="zed-button text-muted-foreground hover:text-cyan-400 h-auto p-2 rounded-xl"
                  >
                    <Mic size={18} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowModeSelector(!showModeSelector)}
                    className="zed-button text-muted-foreground hover:text-cyan-400 h-auto px-3 py-2 rounded-xl flex items-center space-x-1"
                  >
                    {currentMode === "chat" ? <MessageSquare size={14} /> : <img src={zLogoPath} alt="Z" className="w-3.5 h-3.5" />}
                    <span className="text-xs capitalize">{currentMode}</span>
                    <Settings size={10} />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground flex items-center">
                  <Sparkles size={12} className="mr-1 text-purple-400" />
                  Ready for your next task
                </div>
              </div>
              <div className="relative">
                <Textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Message ZED in ${currentMode} mode...`}
                  className="zed-input resize-none min-h-[60px] pr-14 text-base"
                  rows={1}
                  disabled={sendMessageMutation.isPending || isStreaming}
                />
                <Button
                  onClick={handleSend}
                  size="sm"
                  className="absolute right-2 bottom-2 zed-gradient hover:shadow-lg hover:shadow-purple-500/25 zed-button rounded-xl p-2"
                  disabled={!inputValue.trim() || sendMessageMutation.isPending || isStreaming}
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Social Feed Panel */}
      {showSocialFeed && (
        <div className="w-96 border-l border-white/10 zed-sidebar">
          <SocialFeed />
        </div>
      )}
    </div>
  );
}