import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Paperclip, 
  Mic, 
  Download, 
  Share2, 
  Cpu,
  Circle
} from "lucide-react";
import ChatMessage from "@/components/chat/ChatMessage";
import FileUpload from "@/components/chat/FileUpload";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Conversation, Message } from "@shared/schema";

interface ChatAreaProps {
  conversation?: Conversation;
  messages: Message[];
  conversationId?: string;
}

export default function ChatArea({ conversation, messages, conversationId }: ChatAreaProps) {
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const [showFileUpload, setShowFileUpload] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!conversationId) throw new Error("No conversation selected");

      // Use streaming endpoint
      const response = await fetch(`/api/conversations/${conversationId}/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      return response;
    },
    onMutate: () => {
      setIsStreaming(true);
      setStreamingMessage("");
    },
    onSuccess: async (response) => {
      const reader = response.body?.getReader();
      if (!reader) return;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.error) {
                  throw new Error(data.error);
                }
                
                setStreamingMessage(prev => prev + data.content);
                
                if (data.done) {
                  setIsStreaming(false);
                  setStreamingMessage("");
                  // Refresh messages
                  queryClient.invalidateQueries({ 
                    queryKey: ["/api/conversations", conversationId, "messages"] 
                  });
                  queryClient.invalidateQueries({ 
                    queryKey: ["/api/conversations"] 
                  });
                  return;
                }
              } catch (e) {
                console.error("Error parsing SSE data:", e);
              }
            }
          }
        }
      } catch (error) {
        console.error("Streaming error:", error);
        setIsStreaming(false);
        setStreamingMessage("");
        toast({
          title: "Error",
          description: "Failed to receive response",
          variant: "destructive"
        });
      }
    },
    onError: (error) => {
      setIsStreaming(false);
      setStreamingMessage("");
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive"
      });
    }
  });

  const handleSend = () => {
    if (!inputValue.trim() || !conversationId || sendMessageMutation.isPending) return;
    
    sendMessageMutation.mutate(inputValue.trim());
    setInputValue("");
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = (files: File[]) => {
    // FileUpload component will handle the upload
    setShowFileUpload(false);
  };

  const exportConversation = async () => {
    if (!conversationId) return;
    
    try {
      const response = await fetch(`/api/conversations/${conversationId}/export`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `conversation-${conversationId}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export successful",
        description: "Conversation exported successfully"
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export conversation",
        variant: "destructive"
      });
    }
  };

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center">
          <Circle className="mx-auto mb-4 text-gray-300" size={64} />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Welcome to ZED</h2>
          <p className="text-gray-500">Select a conversation or create a new one to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {conversation?.title || "Loading..."}
            </h2>
            {conversation?.isActive && (
              <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                <Circle className="w-2 h-2 mr-2 fill-current" />
                Active Session
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={exportConversation}
              className="text-gray-500 hover:text-gray-700"
            >
              <Download size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
            >
              <Share2 size={16} />
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Cpu className="text-primary" size={16} />
              <span>{conversation?.model || "GPT-4 Turbo"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.length === 0 && !isStreaming ? (
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
              <Circle className="text-white" size={16} />
            </div>
            <Card className="flex-1 p-4 bg-white border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium text-gray-900">ZED</span>
                <span className="text-xs text-gray-500">AI Assistant</span>
              </div>
              <div className="prose prose-sm max-w-none text-gray-700">
                <p>Hello! I'm ZED, your enhanced AI assistant. I can help you analyze documents, process data files, generate insights, and assist with various tasks using advanced AI capabilities. What would you like to work on today?</p>
                <p className="text-sm text-gray-600 mt-2">You can upload files up to 32GB including CSV, Excel, PDFs, images, and more for comprehensive analysis.</p>
              </div>
            </Card>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}

        {/* Streaming message */}
        {isStreaming && (
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
            <Card className="flex-1 p-4 bg-white border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium text-gray-900">ZED</span>
                <span className="text-xs text-gray-500">Generating response...</span>
              </div>
              <div className="prose prose-sm max-w-none text-gray-700">
                {streamingMessage && <p>{streamingMessage}</p>}
                {!streamingMessage && (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }} />
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* File Upload Area */}
      {showFileUpload && (
        <FileUpload
          conversationId={conversationId}
          onUpload={handleFileUpload}
          onClose={() => setShowFileUpload(false)}
        />
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white px-6 py-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <div className="flex items-center space-x-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFileUpload(true)}
                className="text-gray-500 hover:text-primary h-auto p-1"
              >
                <Paperclip size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-primary h-auto p-1"
              >
                <Mic size={16} />
              </Button>
              <div className="text-xs text-gray-500">
                Ready for your next task
              </div>
            </div>
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask ZED to analyze your data, generate insights, or help with any task..."
              className="resize-none border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
              disabled={sendMessageMutation.isPending || isStreaming}
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || sendMessageMutation.isPending || isStreaming}
            className="bg-primary hover:bg-primary/90 rounded-xl px-6"
          >
            <span className="mr-2">Send</span>
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
